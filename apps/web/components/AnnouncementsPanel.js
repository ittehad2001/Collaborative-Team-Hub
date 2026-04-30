"use client";

import { useRef, useState } from "react";

export default function AnnouncementsPanel({
  announcements = [],
  members = [],
  onCreate,
  onReact,
  onComment,
  onPinToggle
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("<p></p>");
  const [pinned, setPinned] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [commentMessage, setCommentMessage] = useState({});
  const [actionMessage, setActionMessage] = useState({});
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState({});
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    insertUnorderedList: false
  });
  const editorRef = useRef(null);

  function getPlainTextFromHtml(html) {
    if (!html) return "";
    return html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function syncActiveFormats() {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList")
    });
  }

  function runCommand(command) {
    editorRef.current?.focus();
    document.execCommand(command);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
    syncActiveFormats();
  }

  function updateCommentAndSuggestions(announcementId, value) {
    setCommentText((prev) => ({ ...prev, [announcementId]: value }));
    const match = value.match(/@([^\s@]*)$/);
    if (!match) {
      setMentionSuggestions((prev) => ({ ...prev, [announcementId]: [] }));
      return;
    }
    const query = match[1].toLowerCase();
    const list = members
      .filter((m) => m.email.toLowerCase().includes(query) || m.name.toLowerCase().includes(query))
      .slice(0, 5);
    setMentionSuggestions((prev) => ({ ...prev, [announcementId]: list }));
  }

  function applyMention(announcementId, email) {
    const text = commentText[announcementId] || "";
    const next = text.replace(/@([^\s@]*)$/, `@${email} `);
    setCommentText((prev) => ({ ...prev, [announcementId]: next }));
    setMentionSuggestions((prev) => ({ ...prev, [announcementId]: [] }));
  }

  async function submit(e) {
    e.preventDefault();
    const plainText = getPlainTextFromHtml(content);
    if (!title.trim() || !plainText) {
      setMessage("Please provide title and announcement content.");
      return;
    }
    try {
      setPosting(true);
      await onCreate({ title: title.trim(), content, pinned });
      setTitle("");
      setContent("<p></p>");
      if (editorRef.current) editorRef.current.innerHTML = "";
      setPinned(false);
      setMessage("Announcement posted.");
    } catch (_error) {
      setMessage("Failed to post announcement.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <section className="panel p-5">
      <h3 className="text-lg font-semibold">Announcements</h3>
      <form className="mt-3 space-y-2" onSubmit={submit}>
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded border px-2 py-1 text-xs ${activeFormats.bold ? "bg-violet-600 text-white" : ""}`}
            onClick={() => runCommand("bold")}
          >
            Bold
          </button>
          <button
            type="button"
            className={`rounded border px-2 py-1 text-xs ${activeFormats.italic ? "bg-violet-600 text-white" : ""}`}
            onClick={() => runCommand("italic")}
          >
            Italic
          </button>
          <button
            type="button"
            className={`rounded border px-2 py-1 text-xs ${activeFormats.underline ? "bg-violet-600 text-white" : ""}`}
            onClick={() => runCommand("underline")}
          >
            Underline
          </button>
          <button
            type="button"
            className={`rounded border px-2 py-1 text-xs ${activeFormats.insertUnorderedList ? "bg-violet-600 text-white" : ""}`}
            onClick={() => runCommand("insertUnorderedList")}
          >
            List
          </button>
        </div>
        <div
          className="min-h-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => {
            setContent(e.currentTarget.innerHTML);
            syncActiveFormats();
          }}
          onKeyUp={syncActiveFormats}
          onMouseUp={syncActiveFormats}
        />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
          Pin this announcement
        </label>
        <button disabled={posting} className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-2 text-white disabled:opacity-60">
          {posting ? "Posting..." : "Post"}
        </button>
        {message ? <p className="text-xs text-slate-600">{message}</p> : null}
      </form>

      <ul className="mt-4 space-y-2">
        {announcements.map((a) => (
          <li key={a.id} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/90">
            <p className="font-medium text-slate-900 dark:text-slate-100">{a.title}</p>
            {a.pinned ? <p className="text-xs font-semibold text-violet-600">Pinned</p> : null}
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: a.content }} />
            <div className="mt-2 flex gap-2">
              <button
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                onClick={async () => {
                  const result = await onReact(a.id, "👍");
                  setActionMessage((prev) => ({ ...prev, [a.id]: result?.message || "Reaction updated." }));
                }}
              >
                👍 {(a.reactions || []).filter((r) => r.emoji === "👍").length}
              </button>
              <button
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                onClick={async () => {
                  const result = await onReact(a.id, "🎉");
                  setActionMessage((prev) => ({ ...prev, [a.id]: result?.message || "Reaction updated." }));
                }}
              >
                🎉 {(a.reactions || []).filter((r) => r.emoji === "🎉").length}
              </button>
              <button
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                onClick={async () => {
                  const result = await onPinToggle(a.id, !a.pinned);
                  setActionMessage((prev) => ({ ...prev, [a.id]: result?.message || "Pin status updated." }));
                }}
              >
                {a.pinned ? "Unpin" : "Pin"}
              </button>
            </div>
            {actionMessage[a.id] ? <p className="mt-1 text-xs text-slate-500">{actionMessage[a.id]}</p> : null}
            <div className="mt-2 flex gap-2">
              <input
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="@mention and comment"
                value={commentText[a.id] || ""}
                onChange={(e) => updateCommentAndSuggestions(a.id, e.target.value)}
              />
              <button
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                onClick={async () => {
                  const value = commentText[a.id];
                  if (!value) return;
                  const result = await onComment(a.id, value);
                  if (result?.ok) {
                    setCommentText((prev) => ({ ...prev, [a.id]: "" }));
                    setCommentMessage((prev) => ({ ...prev, [a.id]: "Comment posted." }));
                  } else {
                    setCommentMessage((prev) => ({ ...prev, [a.id]: result?.message || "Failed to comment." }));
                  }
                }}
              >
                Comment
              </button>
            </div>
            {commentMessage[a.id] ? <p className="mt-1 text-xs text-slate-500">{commentMessage[a.id]}</p> : null}
            {(mentionSuggestions[a.id] || []).length > 0 ? (
              <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">Mention suggestions</p>
                <div className="flex flex-wrap gap-1">
                  {mentionSuggestions[a.id].map((m) => (
                    <button
                      key={m.id}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                      onClick={() => applyMention(a.id, m.email)}
                    >
                      @{m.email}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {(a.comments || []).length > 0 ? (
              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-950/80">
                <p className="mb-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Comments</p>
                <ul className="space-y-1">
                  {a.comments.slice(0, 5).map((c) => (
                    <li key={c.id} className="text-xs text-slate-700 dark:text-slate-200">
                      <span className="font-semibold">{c.user?.email || "member"}:</span> {c.content}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
