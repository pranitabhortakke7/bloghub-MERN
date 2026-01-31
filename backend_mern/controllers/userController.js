import User from "../models/User.js";

/**
 * @desc    Search users by name or email
 * @route   GET /api/users/search?q=
 * @access  Private
 */
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json([]);
    }

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("name email followers");

    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Failed to search users" });
  }
};

/**
 * @desc    Get public user profile by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email bio followers following"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch user profile" });
  }
};

/**
 * @desc    Follow / Unfollow a user
 * @route   POST /api/users/:id/follow
 * @access  Private
 */
export const toggleFollowUser = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const targetUserId = req.params.id;

    if (loggedInUserId.toString() === targetUserId) {
      return res.status(400).json({ msg: "You cannot follow yourself" });
    }

    const loggedInUser = await User.findById(loggedInUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isFollowing = loggedInUser.following.includes(targetUserId);

    if (isFollowing) {
      loggedInUser.following = loggedInUser.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== loggedInUserId.toString()
      );
    } else {
      loggedInUser.following.push(targetUserId);
      targetUser.followers.push(loggedInUserId);
    }

    await loggedInUser.save();
    await targetUser.save();

    res.json({
      followed: !isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    res.status(500).json({ msg: "Failed to follow/unfollow user" });
  }
};

/**
 * @desc    Get followers of a user
 * @route   GET /api/users/:id/followers
 * @access  Private
 */
export const getUserFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "name email"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch followers" });
  }
};

/**
 * @desc    Get users followed by a user
 * @route   GET /api/users/:id/following
 * @access  Private
 */
export const getUserFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "name email"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user.following);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch following users" });
  }
};

/**
 * @desc    Update logged-in user's profile (bio)
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.bio = bio;
    await user.save();

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ msg: "Profile update failed" });
  }
};
