import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  X,
  Mic,
  MicOff,
} from "lucide-react";

import api from "../api/axios";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Card, CardContent } from "./ui/card";

import { BlogPost } from "../types";
import { useVoiceToText } from "../lib/useVoiceToText";

interface CreateEditPostPageProps {
  post?: BlogPost;
  onNavigate: (page: string, postId?: string) => void;
  onPostSaved?: () => void;
}

export function CreateEditPostPage({
  post,
  onNavigate,
  onPostSaved,
}: CreateEditPostPageProps) {
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [published, setPublished] = useState(false);

  /* ---------------- EDIT MODE ---------------- */
  useEffect(() => {
    if (!post) return;

    setTitle(post.title);
    setExcerpt(post.excerpt || "");
    setContent(post.content);
    setCoverImage(post.coverImage || "");
    setTags(post.tags || []);
    setPublished(post.published || false);
  }, [post]);

  /* ---------------- VOICE TO TEXT ---------------- */
  const handleVoice = (text: string) => {
    setContent((prev) => prev + " " + text);
  };

  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
  } = useVoiceToText(handleVoice);

  /* ---------------- TAGS ---------------- */
  const addTag = () => {
    if (!tagInput.trim() || tags.includes(tagInput)) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);

    const payload = {
      title,
      excerpt,
      content,
      coverImage,
      tags,
      published,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    };

    try {
      if (post?._id) {
        await api.put(`/posts/${post._id}`, payload);
        toast.success("Post updated successfully");
      } else {
        await api.post("/posts", payload);
        toast.success("Post created successfully");
      }

      onPostSaved?.();
      onNavigate("dashboard");
    } catch (err) {
      toast.error("Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => onNavigate("dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={published} onCheckedChange={setPublished} />
              <Label>{published ? "Published" : "Draft"}</Label>
            </div>

            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {post ? "Update Post" : "Publish Post"}
            </Button>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
        {/* MAIN */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title"
                />
              </div>

              <div>
                <Label>Excerpt</Label>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Content</Label>
                  {isSupported && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={isListening ? stopListening : startListening}
                    >
                      {isListening ? <MicOff /> : <Mic />}
                      <span className="ml-2">
                        {isListening ? "Stop" : "Voice"}
                      </span>
                    </Button>
                  )}
                </div>

                <Textarea
                  rows={18}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label>Cover Image</Label>
              {coverImage ? (
                <div className="relative">
                  <img
                    src={coverImage}
                    className="rounded-lg w-full h-40 object-cover"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setCoverImage("")}
                  >
                    <X />
                  </Button>
                </div>
              ) : (
                <Input
                  placeholder="Image URL"
                  onBlur={(e) => setCoverImage(e.target.value)}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                />
                <Button variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      className="ml-2"
                      onClick={() => removeTag(tag)}
                    >
                      ✕
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
