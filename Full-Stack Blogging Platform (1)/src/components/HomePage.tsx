import React, { useState } from "react";
import { Calendar, Eye, Search, PenLine } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { BlogPost } from "../types";

interface HomePageProps {
  onNavigate: (page: string, postId?: string) => void;
  posts: BlogPost[];
}

export function HomePage({ onNavigate, posts }: HomePageProps) {
  const [search, setSearch] = useState("");

  const publishedPosts = posts.filter((p) => p.published);

  const filteredPosts = publishedPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#E5E9E4] min-h-screen">
      {/* HERO */}
      <section className="text-center py-20 px-4">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-[#5F7773] flex items-center justify-center">
            <PenLine className="text-white w-6 h-6" />
          </div>
        </div>

        <h1 className="text-4xl font-semibold text-[#415E5A] mb-4">
          Write. Share. Inspire
        </h1>

        <p className="text-[#6B7F7B] max-w-xl mx-auto mb-8 leading-relaxed">
          A calm, simple space to publish your thoughts to the world
        </p>

        <div className="flex justify-center gap-4">
          <Button onClick={() => onNavigate("create")}>
            Write Post
          </Button>
          <Button variant="outline" onClick={() => onNavigate("dashboard")}>
            Dashboard
          </Button>
        </div>
      </section>

      {/* POSTS */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-[#415E5A] font-medium">
            Latest Posts
          </h2>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">
            No posts found
          </p>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                onClick={() => onNavigate("post", post._id)}
                className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-md hover:translate-y-[-2px] hover:shadow-lg hover:border-[#6B7F7B] transition-all duration-300 ease-out"
              >
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-[#415E5A]">
                    {post.author.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.createdAt).toDateString()}
                  </span>
                </div>

                <h3 className="text-xl text-[#415E5A] mb-4">
                  {post.title}
                </h3>

                <div className="flex justify-end text-sm text-gray-500">
                  <Eye className="w-4 h-4 mr-1" />
                  {post.views} views
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
