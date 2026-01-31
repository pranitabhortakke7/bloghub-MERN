import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Edit,
  Bookmark,
  Heart,
} from "lucide-react";
import api from "../api/axios";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { CommentSection } from "./CommentSection";

interface BlogPostPageProps {
  postId: string;
  onNavigate: (page: string, postId?: string) => void;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  published: boolean;
  views: number;
  createdAt: string;
  coverImage?: string;
  likes?: string[];
}

export function BlogPostPage({ postId, onNavigate }: BlogPostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  /* ---------- FETCH POST ---------- */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${postId}`);
        setPost(res.data);

        const likes = res.data.likes || [];
        setLikesCount(likes.length);
        setLiked(
          currentUser ? likes.includes(currentUser._id) : false
        );
      } catch {
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  /* ---------- BOOKMARK ---------- */
  useEffect(() => {
    if (!post?._id) return;

    const stored = localStorage.getItem("bookmarks");
    const ids: string[] = stored ? JSON.parse(stored) : [];
    setIsBookmarked(ids.includes(post._id));
  }, [post]);

  const toggleBookmark = () => {
    if (!post) return;

    const stored = localStorage.getItem("bookmarks");
    let ids: string[] = stored ? JSON.parse(stored) : [];

    if (ids.includes(post._id)) {
      ids = ids.filter((id) => id !== post._id);
      toast("Removed from bookmarks");
      setIsBookmarked(false);
    } else {
      ids.push(post._id);
      toast("Added to bookmarks");
      setIsBookmarked(true);
    }

    localStorage.setItem("bookmarks", JSON.stringify(ids));
  };

  /* ---------- LIKE ---------- */
  const handleLike = async () => {
    console.log("LIKE CLICKED"); // 🔥 PROOF CLICK WORKS

    if (!currentUser) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      const res = await api.put(`/posts/${postId}/like`);
      console.log("LIKE RESPONSE:", res.data);

      setLikesCount(res.data.likesCount);
      setLiked(res.data.liked);
    } catch {
      toast.error("Failed to like post");
    }
  };

  /* ---------- UI STATES ---------- */
  if (loading) {
    return (
      <p className="p-6 text-center text-gray-500">
        Loading post...
      </p>
    );
  }

  if (!post) {
    return (
      <p className="p-6 text-center text-red-500">
        Post not found
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => onNavigate("home")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardContent className="p-8 relative">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-72 object-cover rounded-xl mb-6"
              />
            )}

            {/* TITLE + ACTIONS */}
            <div className="flex justify-between items-start gap-4 mb-4 relative z-10">
              <h1 className="text-4xl font-semibold">
                {post.title}
              </h1>

              <div className="flex gap-2 relative z-10">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleLike}
                  className={`pointer-events-auto ${
                    liked ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      liked ? "fill-red-500" : ""
                    }`}
                  />
                </Button>

                <Button
                  size="icon"
                  variant={isBookmarked ? "default" : "outline"}
                  onClick={toggleBookmark}
                  className="pointer-events-auto"
                >
                  <Bookmark
                    className={`w-5 h-5 ${
                      isBookmarked ? "fill-white" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>

            {/* META */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {post.views} views
              </div>

              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                {likesCount} likes
              </div>

              <Badge variant={post.published ? "default" : "secondary"}>
                {post.published ? "Published" : "Draft"}
              </Badge>
            </div>

            {/* TAGS */}
            {post.tags?.length > 0 && (
              <div className="flex gap-2 mb-6 flex-wrap">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* CONTENT */}
            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
              {post.content}
            </div>

            {/* COMMENTS */}
            <div className="mt-12">
              <CommentSection postId={post._id} />
            </div>

            {/* EDIT POST */}
            <div className="mt-8 flex justify-end">
              <Button onClick={() => onNavigate("edit", post._id)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Post
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
