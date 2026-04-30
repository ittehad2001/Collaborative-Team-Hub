"use client";

import { useState } from "react";

export default function AnnouncementsPanel({ announcements = [], onCreate, onReact, onComment }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("<p></p>");
  const [pinned, setPinned] = useState(false);
  const [commentText, setCommentText] = useState({});

  async function submit(e) {
    e.preventDefault();
    if (!title || !content || content === "<p></p>") return;
    await onCreate({ title, content, pinned });
    setTitle("");
    setContent("<p></p>");
    setPinned(false);
  }

  return (
    <section className="panel p-5">
      <h3 className="text-lg font-semibold">Announcements</h3>
      <form className="mt-3 space-y-2" onSubmit={submit}>
        <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <div className="flex gap-2">
          <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => document.execCommand("bold")}>Bold</button>
          <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => document.execCommand("italic")}>Italic</button>
        </div>
        <div
          className="min-h-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
        />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
          Pin this announcement
        </label>
        <button className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-2 text-white">Post</button>
      </form>

      <ul className="mt-4 space-y-2">
        {announcements.map((a) => (
          <li key={a.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="font-medium text-slate-900">{a.title}</p>
            {a.pinned ? <p className="text-xs font-semibold text-violet-600">Pinned</p> : null}
            <div className="mt-1 text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: a.content }} />
            <div className="mt-2 flex gap-2">
              <button className="rounded-lg border border-slate-300 px-2 py-1 text-xs" onClick={() => onReact(a.id, "👍")}>👍</button>
              <button className="rounded-lg border border-slate-300 px-2 py-1 text-xs" onClick={() => onReact(a.id, "🎉")}>🎉</button>
            </div>
            <div className="mt-2 flex gap-2">
              <input
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="@mention and comment"
                value={commentText[a.id] || ""}
                onChange={(e) => setCommentText((prev) => ({ ...prev, [a.id]: e.target.value }))}
              />
              <button
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                onClick={() => {
                  const value = commentText[a.id];
                  if (!value) return;
                  onComment(a.id, value);
                  setCommentText((prev) => ({ ...prev, [a.id]: "" }));
                }}
              >
                Comment
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
