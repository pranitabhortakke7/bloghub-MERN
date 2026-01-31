import Post from "../models/Post.js";

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  Public
 */
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch {
    res.status(500).json({ msg: "Failed to fetch posts" });
  }
};

/**
 * @desc    Get my posts
 * @route   GET /api/posts/my-posts
 * @access  Private
 */
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch {
    res.status(500).json({ msg: "Failed to fetch posts" });
  }
};

/**
 * @desc    Get single post + increment views
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "name email");

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch {
    res.status(500).json({ msg: "Failed to fetch post" });
  }
};

/**
 * @desc    Create new post
 * @route   POST /api/posts
 * @access  Private
 */
export const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      excerpt: req.body.excerpt,
      coverImage: req.body.coverImage,
      tags: req.body.tags,
      published: req.body.published,
      scheduledPublishDate: req.body.scheduledPublishDate,
      slug: req.body.slug,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch {
    res.status(500).json({ msg: "Failed to create post" });
  }
};

/**
 * @desc    Update post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedPost);
  } catch {
    res.status(500).json({ msg: "Failed to update post" });
  }
};

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ msg: "Post deleted successfully" });
  } catch {
    res.status(500).json({ msg: "Failed to delete post" });
  }
};

/**
 * @desc    Get posts by user (public profile)
 * @route   GET /api/posts/user/:userId
 * @access  Public
 */
export const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.params.userId,
      published: true,
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch {
    res.status(500).json({ msg: "Failed to fetch user posts" });
  }
};

/**
 * @desc    Get posts from followed users
 * @route   GET /api/posts/following
 * @access  Private
 */
export const getFollowingFeed = async (req, res) => {
  try {
    const user = await req.user.populate("following");

    const posts = await Post.find({
      author: { $in: user.following },
      published: true,
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch {
    res.status(500).json({ msg: "Failed to load feed" });
  }
};
/**
 * @desc    Like / Unlike a post
 * @route   PUT /api/posts/:id/like
 * @access  Private
 */

export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes
      .map((id) => id.toString())
      .includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({ msg: "Failed to like post" });
  }
};
