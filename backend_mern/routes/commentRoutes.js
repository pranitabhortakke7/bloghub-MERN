import express from "express";
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  toggleLikeComment,
} from "../controllers/commentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get comments for post
router.get("/:postId", getComments);

// Add comment
router.post("/:postId", protect, addComment);

// Edit comment (owner)
router.put("/:id", protect, updateComment);

// Delete comment (owner)
router.delete("/:id", protect, deleteComment);

// Like / unlike comment
router.put("/like/:id", protect, toggleLikeComment);

export default router;
