import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import { Calendar, Eye, Users } from "lucide-react";

import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface FollowingFeedPageProps {
  onNavigate: (page: string, postId?: string) => void;
}

export function FollowingFeedPage({ onNavigate }: FollowingFeedPageProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get("/posts/following");
        setPosts(res.data);
      } catch {
        toast.error("Failed to load feed");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <p className="p-10 text-center text-muted-foreground">
        Loading feed...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Following Feed
        </h1>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                You’re not seeing any posts yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Follow users to see their posts here.
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card
              key={post._id}
              className="cursor-pointer hover:shadow-md transition"
              onClick={() => onNavigate("post", post._id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {post.author?.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <span className="font-medium text-foreground">
                    {post.author?.name}
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(
                      post.createdAt
                    ).toDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-medium mb-2">
                  {post.title}
                </h3>

                <div className="flex justify-end text-sm text-muted-foreground">
                  <Eye className="w-4 h-4 mr-1" />
                  {post.views} views
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
