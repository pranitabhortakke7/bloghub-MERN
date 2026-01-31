import React, { useEffect, useState } from "react";
import {
  PenSquare,
  Eye,
  TrendingUp,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";

import api from "../api/axios";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  published: boolean;
  views: number;
  createdAt: string;
  coverImage?: string;
  author: {
    _id: string;
    name: string;
  };
}

interface DashboardPageProps {
  onNavigate: (page: string, postId?: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loggedInUserId = localStorage.getItem("userId");

  // 🔹 Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts/my-posts");
        setPosts(res.data);
      } catch {
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 🔹 Delete post
  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Post deleted successfully");
    } catch {
      toast.error("Not authorized to delete this post");
    }
  };

  const publishedPosts = posts.filter((p) => p.published);
  const draftPosts = posts.filter((p) => !p.published);

  const totalViews = publishedPosts.reduce((sum, p) => sum + p.views, 0);
  const avgViews =
    publishedPosts.length > 0
      ? Math.round(totalViews / publishedPosts.length)
      : 0;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return <p className="p-6 text-center">Loading dashboard...</p>;
  }

  const PostCard = ({ post }: { post: Post }) => {
    const isOwner = post.author?._id === loggedInUserId;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <img
              src={post.coverImage || "https://via.placeholder.com/300x200"}
              alt={post.title}
              className="w-32 h-24 object-cover rounded-lg cursor-pointer"
              onClick={() => onNavigate("post", post._id)}
            />

            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <div>
                  <h3
                    className="text-xl font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => onNavigate("post", post._id)}
                  >
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {post.excerpt || post.content}
                  </p>
                </div>

                {/* 🔐 OWNER ONLY ACTIONS */}
                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onNavigate("edit", post._id)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(post._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-4 text-sm text-gray-500 items-center">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(post.createdAt)}
                </div>

                {post.published && (
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {post.views} views
                  </div>
                )}

                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-semibold">Dashboard</h1>
          <p className="text-gray-600">Manage your blog posts</p>
        </div>
        <Button onClick={() => onNavigate("create")}>
          <PenSquare className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card><CardContent className="p-6">Total Posts: {posts.length}</CardContent></Card>
        <Card><CardContent className="p-6">Published: {publishedPosts.length}</CardContent></Card>
        <Card><CardContent className="p-6">Total Views: {totalViews}</CardContent></Card>
        <Card><CardContent className="p-6">Avg Views: {avgViews}</CardContent></Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {posts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No posts yet. Create your first post!
                </p>
              ) : (
                posts.map((p) => <PostCard key={p._id} post={p} />)
              )}
            </TabsContent>

            <TabsContent value="published" className="space-y-4">
              {publishedPosts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No published posts yet.
                </p>
              ) : (
                publishedPosts.map((p) => <PostCard key={p._id} post={p} />)
              )}
            </TabsContent>

            <TabsContent value="drafts" className="space-y-4">
              {draftPosts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No draft posts yet.
                </p>
              ) : (
                draftPosts.map((p) => <PostCard key={p._id} post={p} />)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
