import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";

interface UserConnectionsPageProps {
  userId: string;
  type: "followers" | "following";
  onNavigate: (page: string, id?: string) => void;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

export function UserConnectionsPage({
  userId,
  type,
  onNavigate,
}: UserConnectionsPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await api.get(`/users/${userId}/${type}`);
        setUsers(res.data);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [userId, type]);

  if (loading) {
    return (
      <p className="p-10 text-center text-muted-foreground">
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">
              {type}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No users found
              </p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-4 cursor-pointer hover:bg-muted p-2 rounded-lg"
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
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
