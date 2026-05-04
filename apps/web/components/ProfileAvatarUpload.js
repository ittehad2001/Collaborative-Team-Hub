"use client";

import { useState } from "react";
import { api } from "../lib/api";
import { useAuthStore } from "../store/useAuthStore";

export default function ProfileAvatarUpload() {
  const { user, bootstrap } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      await api.uploadAvatar(formData);
      await bootstrap();
      setMessage("Avatar uploaded");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name || "Avatar"}
            className="h-12 w-12 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-blue-100 text-sm font-semibold text-blue-600">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium">{user?.name || "User"}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>
      <label className="btn-outline flex w-full items-center justify-center gap-2 px-3 py-2 text-sm">
        {uploading ? "Uploading..." : "Change Avatar"}
        <input className="hidden" type="file" accept="image/*" onChange={handleChange} />
      </label>
      {message ? <span className="text-xs text-slate-500">{message}</span> : null}
    </div>
  );
}
