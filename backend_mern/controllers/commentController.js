import Comment from "../models/Comment.js";

/**
 * CREATE COMMENT
 * POST /api/comments/:postId
 */
export const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      content: req.body.content,
    });

    const populated = await comment.populate("author", "name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ msg: "Failed to add comment" });
  }
};

/**
 * GET COMMENTS FOR POST
 * GET /api/comments/:postId
 */
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch {
    res.status(500).json({ msg: "Failed to load comments" });
  }
};

/**
 * UPDATE COMMENT (OWNER ONLY)
 * PUT /api/comments/:id
 */
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment)
      return res.status(404).json({ msg: "Comment not found" });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    comment.content = req.body.content;
    await comment.save();

    res.json(comment);
  } catch {
    res.status(500).json({ msg: "Failed to update comment" });
  }
};

/**
 * DELETE COMMENT (OWNER ONLY)
 * DELETE /api/comments/:id
 */
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment)
      return res.status(404).json({ msg: "Comment not found" });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ msg: "Comment deleted" });
  } catch {
    res.status(500).json({ msg: "Failed to delete comment" });
  }
};

/**
 * LIKE / UNLIKE COMMENT
 * PUT /api/comments/like/:id
 */
export const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment)
      return res.status(404).json({ msg: "Comment not found" });

    const userId = req.user._id.toString();

    if (comment.likes.map(String).includes(userId)) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      comment.likes.push(req.user._id);
    }

    await comment.save();
    res.json(comment);
  } catch {
    res.status(500).json({ msg: "Failed to like comment" });
  }
};
