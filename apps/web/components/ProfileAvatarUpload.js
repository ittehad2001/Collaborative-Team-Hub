"use client";

import { useState } from "react";
import { api } from "../lib/api";

export default function ProfileAvatarUpload() {
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
      setMessage("Avatar uploaded");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="btn-outline flex w-full items-center gap-2 px-3 py-2 text-sm sm:w-auto">
      {uploading ? "Uploading..." : "Upload Avatar"}
      <input className="hidden" type="file" accept="image/*" onChange={handleChange} />
      {message ? <span className="text-xs text-slate-500">{message}</span> : null}
    </label>
  );
}
