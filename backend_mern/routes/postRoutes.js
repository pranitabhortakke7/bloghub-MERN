import express from "express";
import {
  getPosts,
  getPost,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
  getPostsByUser,
  getFollowingFeed,
  toggleLikePost,
} from "../controllers/postController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * ======================
 * PUBLIC ROUTES
 * ======================
 */

// All public posts (Home)
router.get("/", getPosts);

/**
 * ======================
 * PRIVATE ROUTES
 * ======================
 * ⚠️ MUST be before `/:id`
 */

// Feed of followed users
router.get("/following", protect, getFollowingFeed);

// Logged-in user's posts
router.get("/my-posts", protect, getMyPosts);

/**
 * ======================
 * PUBLIC USER PROFILE
 * ======================
 */

// Posts by specific user (public profile)
router.get("/user/:userId", getPostsByUser);

/**
 * ======================
 * LIKE ROUTE (PRIVATE)
 * ======================
 */

// Like / Unlike a post
router.put("/:id/like", protect, toggleLikePost);

/**
 * ======================
 * CRUD ROUTES (PRIVATE)
 * ======================
 */

// Create post
router.post("/", protect, createPost);

// Update post (owner only)
router.put("/:id", protect, updatePost);

// Delete post (owner only)
router.delete("/:id", protect, deletePost);

/**
 * ======================
 * SINGLE POST (PUBLIC)
 * ======================
 * ⚠️ MUST BE LAST
 */
router.get("/:id", getPost);

export default router;
