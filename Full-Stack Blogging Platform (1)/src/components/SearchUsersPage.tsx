import React, { useState } from "react";
import api from "../api/axios";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface SearchUsersPageProps {
  onNavigate: (page: string, userId?: string) => void;
}

interface User {
  _id: string;
  name: string;
  email: string;
  followers: string[];
}

export function SearchUsersPage({ onNavigate }: SearchUsersPageProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = currentUser?._id || currentUser?.id;

  /* ---------- SEARCH USERS ---------- */
  const searchUsers = async (value: string) => {
    console.log("Searching for:", value); // 🟡 TEMP DEBUG

    setQuery(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(`/users/search?q=${value}`);
      console.log("SEARCH RESPONSE:", res.data); // 🟡 TEMP DEBUG

      setUsers(res.data);
    } catch (error: any) {
      console.error(
        "SEARCH ERROR:",
        error?.response || error
      ); // 🟡 TEMP DEBUG

      toast.error("Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FOLLOW / UNFOLLOW ---------- */
  const toggleFollow = async (userId: string) => {
    try {
      const res = await api.post(`/users/${userId}/follow`);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? {
                ...user,
                followers: res.data.followed
                  ? [...user.followers, currentUserId]
                  : user.followers.filter(
                      (id) => id !== currentUserId
                    ),
              }
            : user
        )
      );
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold">Search Users</h1>

        <Input
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => searchUsers(e.target.value)}
        />

        {loading && (
          <p className="text-sm text-muted-foreground">
            Searching...
          </p>
        )}

        <div className="space-y-3">
          {users.map((user) => {
            const isFollowing = user.followers.includes(
              currentUserId
            );

            return (
              <Card key={user._id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() =>
                      onNavigate("user-profile", user._id)
                    }
                  >
                    <Avatar>
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isFollowing ? "outline" : "default"}
                    onClick={() => toggleFollow(user._id)}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          {!loading && query && users.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No users found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
