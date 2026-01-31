import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ProfilePageProps {
  posts: any[];
  onNavigate: (page: any) => void;
}

export function ProfilePage({ posts }: ProfilePageProps) {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [user, setUser] = useState<any>(storedUser);
  const [bio, setBio] = useState(storedUser.bio || "");
  const [saving, setSaving] = useState(false);

  /* ✅ FETCH FULL USER PROFILE (followers included) */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${storedUser._id}`);
        setUser(res.data);
      } catch {
        toast.error("Failed to load profile");
      }
    };

    if (storedUser?._id) {
      fetchProfile();
    }
  }, [storedUser._id]);

  const handleSaveBio = async () => {
    try {
      setSaving(true);

      const res = await api.put("/users/profile", { bio });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser((prev: any) => ({ ...prev, bio: res.data.user.bio }));

      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* PROFILE HEADER */}
      <div className="bg-white rounded-xl p-6 border">
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>

        <div className="mt-4">
          <label className="text-sm font-medium">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write something about yourself..."
            className="mt-2"
          />

          <Button
            onClick={handleSaveBio}
            className="mt-3"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Bio"}
          </Button>
        </div>
      </div>

      {/* PROFILE STATS */}
      <div className="grid grid-cols-2 gap-4">
        {/* POSTS */}
        <div className="bg-white p-4 rounded-xl border text-center">
          <p className="text-2xl font-semibold">{posts.length}</p>
          <p className="text-sm text-gray-500">Posts</p>
        </div>

        {/* FOLLOWERS */}
        <div className="bg-white p-4 rounded-xl border text-center">
          <p className="text-2xl font-semibold">
            {user.followers ? user.followers.length : 0}
          </p>
          <p className="text-sm text-gray-500">Followers</p>
        </div>
      </div>
    </div>
  );
}
