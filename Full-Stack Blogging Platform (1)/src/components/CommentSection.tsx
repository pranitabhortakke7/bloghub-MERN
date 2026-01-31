import React, { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import api from "../api/axios";
import { toast } from "sonner";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  /* LOAD COMMENTS */
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/${postId}`);
        setComments(res.data);
      } catch {
        toast.error("Failed to load comments");
      }
    };

    fetchComments();
  }, [postId]);

  /* ADD COMMENT */
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/comments/${postId}`, {
        content: newComment,
      });

      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  /* UPDATE COMMENT */
  const handleUpdateComment = async (commentId: string) => {
    try {
      const res = await api.put(`/comments/${commentId}`, {
        content: editContent,
      });

      setComments((prev) =>
        prev.map((c) =>
          c._id.toString() === commentId ? res.data : c
        )
      );

      setEditingId(null);
      setEditContent("");
      toast.success("Comment updated");
    } catch {
      toast.error("Failed to update comment");
    }
  };

  /* DELETE COMMENT */
  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) =>
        prev.filter((c) => c._id.toString() !== commentId)
      );
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl">Comments ({comments.length})</h3>
        <MessageSquare className="w-5 h-5 text-gray-400" />
      </div>

      {/* ADD COMMENT */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Post Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* COMMENTS LIST */}
      <div className="space-y-4">
        {comments.map((comment) => {
          const authorId =
            typeof comment.author === "string"
              ? comment.author
              : comment.author?._id;

          const isOwner =
            authorId?.toString() ===
            currentUser?._id?.toString();

          return (
            <Card key={comment._id.toString()}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {comment.author?.name
                        ? comment.author.name.charAt(0)
                        : "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <div>
                        <p className="font-medium">
                          {comment.author?.name || "You"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>

                      {/* ✅ OWNER BUTTONS */}
                      {isOwner && (
                        <div className="flex gap-3 text-sm">
                          <button
                            className="text-blue-600"
                            onClick={() => {
                              setEditingId(comment._id.toString());
                              setEditContent(comment.content);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600"
                            onClick={() =>
                              handleDeleteComment(
                                comment._id.toString()
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {editingId === comment._id.toString() ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) =>
                            setEditContent(e.target.value)
                          }
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateComment(
                                comment._id.toString()
                              )
                            }
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700">
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
