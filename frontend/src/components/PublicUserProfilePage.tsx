import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface PublicUserProfilePageProps {
  userId: string;
  onNavigate: (page: string, id?: string) => void;
}

interface User {
  _id: string;
  name: string;
  email: string;
  followers: string[];
  following: string[];
}

interface Post {
  _id: string;
  title: string;
  views: number;
  published: boolean;
  createdAt: string;
}

export function PublicUserProfilePage({
  userId,
  onNavigate,
}: PublicUserProfilePageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = currentUser?._id || currentUser?.id;

  /* ---------- FETCH USER + POSTS ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get(`/posts/user/${userId}`),
        ]);

        setUser(userRes.data);
        setPosts(postsRes.data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  /* ---------- FOLLOW / UNFOLLOW ---------- */
  const toggleFollow = async () => {
    if (!user) return;

    try {
      const res = await api.post(`/users/${user._id}/follow`);

      setUser((prev) =>
        prev
          ? {
              ...prev,
              followers: res.data.followed
                ? [...prev.followers, currentUserId]
                : prev.followers.filter(
                    (id) => id !== currentUserId
                  ),
            }
          : prev
      );
    } catch {
      toast.error("Failed to update follow status");
    }
  };

  if (loading) {
    return (
      <p className="p-10 text-center text-muted-foreground">
        Loading profile...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="p-10 text-center text-red-500">
        User not found
      </p>
    );
  }

  const isOwnProfile = user._id === currentUserId;
  const isFollowing = user.followers.includes(currentUserId);

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* PROFILE CARD */}
        <Card>
          <CardContent className="p-8 flex justify-between items-center">
            <div className="flex gap-6 items-center">
              <Avatar className="w-24 h-24 text-4xl">
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-3xl font-semibold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>

                <div className="flex gap-6 mt-4 text-sm">
                  <span
                    className="cursor-pointer hover:underline"
                    onClick={() =>
                      onNavigate("followers", user._id)
                    }
                  >
                    {user.followers.length} Followers
                  </span>

                  <span
                    className="cursor-pointer hover:underline"
                    onClick={() =>
                      onNavigate("following", user._id)
                    }
                  >
                    {user.following.length} Following
                  </span>
                </div>
              </div>
            </div>

            {!isOwnProfile && (
              <Button
                variant={isFollowing ? "outline" : "default"}
                onClick={toggleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* USER POSTS */}
        <Card>
          <CardHeader>
            <CardTitle>Posts by {user.name}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No posts yet
              </p>
            ) : (
              posts.map((post) => (
                <div key={post._id}>
                  <h3
                    className="text-xl cursor-pointer hover:text-primary"
                    onClick={() =>
                      onNavigate("post", post._id)
                    }
                  >
                    {post.title}
                  </h3>

                  <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                    <span>{post.views} views</span>
                    <Badge variant="secondary">
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
