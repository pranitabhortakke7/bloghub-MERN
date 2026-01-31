import express from "express";
import {
  searchUsers,
  getUserById,
  toggleFollowUser,
  getUserFollowers,
  getUserFollowing,
  updateProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ✅ THIS MUST BE FIRST */
router.put("/profile", protect, updateProfile);

/* SEARCH */
router.get("/search", protect, searchUsers);

/* FOLLOWERS / FOLLOWING */
router.get("/:id/followers", protect, getUserFollowers);
router.get("/:id/following", protect, getUserFollowing);

/* PUBLIC PROFILE */
router.get("/:id", protect, getUserById);

/* FOLLOW / UNFOLLOW */
router.post("/:id/follow", protect, toggleFollowUser);

export default router;
