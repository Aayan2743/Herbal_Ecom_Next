"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ===== Prefill user ===== */
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });

      // existing profile image from API
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  /* ===== Handle image select ===== */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  /* ===== Submit ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);

      if (avatarFile) {
        formData.append("profile_image", avatarFile);
      }

      const res = await api.post("/auth/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;

      // ✅ FIX IS HERE
      updateUser({
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar,
      });

      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

      {/* AVATAR */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-semibold">
              {initials}
            </div>
          )}

          {/* Upload button */}
          <label className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded cursor-pointer">
            Change
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div>
          <p className="font-medium text-lg">{user.name}</p>
          <p className="text-sm text-gray-500">Upload a profile picture</p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <input
            type="text"
            className="w-full h-11 border rounded-lg px-3 mt-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Email Address</label>
          <input
            type="email"
            className="w-full h-11 border rounded-lg px-3 mt-1"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Mobile Number</label>
          <input
            type="tel"
            className="w-full h-11 border rounded-lg px-3 mt-1 cursor-not-allowed"
            value={form.phone}
            disabled
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="h-11 px-6 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </>
  );
}
