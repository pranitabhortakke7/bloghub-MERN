import React, { useEffect, useState } from "react";
import { Bookmark, Clock, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ReadingListPageProps {
  posts: any[];
  onNavigate: (page: string, postId?: string) => void;
}

interface HistoryItem {
  postId: string;
  timestamp: string;
}

export function ReadingListPage({
  posts = [],
  onNavigate,
}: ReadingListPageProps) {

  /* ✅ SAFETY GUARD — prevents crashes if posts not ready */
  if (!Array.isArray(posts)) {
    return null;
  }

  const [bookmarkedPosts, setBookmarkedPosts] = useState<any[]>([]);
  const [historyPosts, setHistoryPosts] = useState<
    { post: any; timestamp: string }[]
  >([]);

  /* ---------- LOAD BOOKMARKS ---------- */
  useEffect(() => {
    if (!posts.length) return;

    const stored = localStorage.getItem("bookmarks");
    const bookmarkIds: string[] = stored ? JSON.parse(stored) : [];

    const filtered = posts.filter((post) =>
      bookmarkIds.includes(post._id)
    );

    setBookmarkedPosts(filtered);
  }, [posts]);

  /* ---------- LOAD HISTORY ---------- */
  useEffect(() => {
    if (!posts.length) return;

    const stored = localStorage.getItem("readingHistory");
    const history: HistoryItem[] = stored ? JSON.parse(stored) : [];

    const mapped = history
      .map((item) => ({
        post: posts.find((p) => p._id === item.postId),
        timestamp: item.timestamp,
      }))
      .filter((item) => item.post);

    setHistoryPosts(mapped);
  }, [posts]);

  /* ---------- REMOVE BOOKMARK ---------- */
  const removeBookmark = (postId: string) => {
    const stored = localStorage.getItem("bookmarks");
    const bookmarkIds: string[] = stored ? JSON.parse(stored) : [];

    const updated = bookmarkIds.filter((id) => id !== postId);
    localStorage.setItem("bookmarks", JSON.stringify(updated));

    setBookmarkedPosts((prev) =>
      prev.filter((post) => post._id !== postId)
    );
  };

  /* ---------- CLEAR HISTORY ---------- */
  const clearHistory = () => {
    localStorage.removeItem("readingHistory");
    setHistoryPosts([]);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl mb-8">Reading List</h1>

        <Tabs defaultValue="bookmarks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookmarks">
              <Bookmark className="w-4 h-4 mr-2" />
              Bookmarks ({bookmarkedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="w-4 h-4 mr-2" />
              History ({historyPosts.length})
            </TabsTrigger>
          </TabsList>

          {/* ---------- BOOKMARKS ---------- */}
          <TabsContent value="bookmarks">
            {bookmarkedPosts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl mb-2">No bookmarks yet</h3>
                  <Button onClick={() => onNavigate("home")}>
                    Explore Articles
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookmarkedPosts.map((post) => (
                  <Card key={post._id}>
                    <CardContent className="p-6 flex justify-between gap-4">
                      <div
                        className="cursor-pointer"
                        onClick={() => onNavigate("post", post._id)}
                      >
                        <h3 className="text-xl font-medium mb-2 hover:text-primary">
                          {post.title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.content?.slice(0, 120)}...
                        </p>

                        <div className="flex gap-2 mt-3">
                          {post.tags?.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeBookmark(post._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ---------- HISTORY ---------- */}
          <TabsContent value="history">
            {historyPosts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl mb-2">No reading history</h3>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <Button size="sm" variant="outline" onClick={clearHistory}>
                    Clear History
                  </Button>
                </div>

                <div className="space-y-4">
                  {historyPosts.map(({ post, timestamp }) => (
                    <Card key={post._id}>
                      <CardContent
                        className="p-6 cursor-pointer"
                        onClick={() => onNavigate("post", post._id)}
                      >
                        <h3 className="text-lg font-medium mb-1 hover:text-primary">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Viewed on {formatDate(timestamp)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
