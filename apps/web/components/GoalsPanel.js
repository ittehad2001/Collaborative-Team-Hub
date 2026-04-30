"use client";

import { useState } from "react";

export default function GoalsPanel({ goals = [], onCreate, onAddMilestone, onAddUpdate }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("not_started");
  const [milestoneText, setMilestoneText] = useState({});
  const [milestoneProgress, setMilestoneProgress] = useState({});
  const [updateText, setUpdateText] = useState({});

  async function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await onCreate({ title, dueDate: dueDate || null, status });
    setTitle("");
    setDueDate("");
    setStatus("not_started");
  }

  return (
    <section className="panel p-5">
      <h3 className="text-lg font-semibold">Goals</h3>
      <form className="mt-3 flex flex-wrap gap-2" onSubmit={submit}>
        <input className="min-w-56 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New goal title" />
        <input
          type="date"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="not_started">not_started</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </select>
        <button className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-2 text-white">Add</button>
      </form>
      <ul className="mt-4 space-y-2">
        {goals.map((goal) => (
          <li key={goal.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="font-medium text-slate-900">{goal.title}</p>
            <p className="mt-1 text-xs text-slate-500">Owner: {goal.owner?.email || "current user"}</p>
            <p className="text-xs text-slate-500">Due: {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : "Not set"}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-600">Status: {goal.status}</p>
            <p className="mt-2 text-xs text-slate-500">Milestones: {goal.milestones?.length || 0}</p>
            <div className="mt-2 flex gap-2">
              <input
                className="flex-1 rounded-xl border border-slate-200 px-2 py-1 text-xs"
                placeholder="Add milestone"
                value={milestoneText[goal.id] || ""}
                onChange={(e) => setMilestoneText((prev) => ({ ...prev, [goal.id]: e.target.value }))}
              />
              <input
                className="w-20 rounded-xl border border-slate-200 px-2 py-1 text-xs"
                placeholder="%"
                type="number"
                min="0"
                max="100"
                value={milestoneProgress[goal.id] || ""}
                onChange={(e) => setMilestoneProgress((prev) => ({ ...prev, [goal.id]: e.target.value }))}
              />
              <button
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                onClick={() => {
                  const value = milestoneText[goal.id];
                  if (!value) return;
                  const progress = Number(milestoneProgress[goal.id] || 0);
                  onAddMilestone(goal.id, { title: value, progress });
                  setMilestoneText((prev) => ({ ...prev, [goal.id]: "" }));
                  setMilestoneProgress((prev) => ({ ...prev, [goal.id]: "" }));
                }}
              >
                Save
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {(goal.milestones || []).slice(0, 3).map((ms) => (
                <li key={ms.id} className="text-xs text-slate-600">
                  ◦ {ms.title} ({ms.progress}%)
                </li>
              ))}
            </ul>
            <div className="mt-2 flex gap-2">
              <input
                className="flex-1 rounded-xl border border-slate-200 px-2 py-1 text-xs"
                placeholder="Post progress update"
                value={updateText[goal.id] || ""}
                onChange={(e) => setUpdateText((prev) => ({ ...prev, [goal.id]: e.target.value }))}
              />
              <button
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                onClick={() => {
                  const value = updateText[goal.id];
                  if (!value) return;
                  onAddUpdate(goal.id, { message: value });
                  setUpdateText((prev) => ({ ...prev, [goal.id]: "" }));
                }}
              >
                Post
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {(goal.updates || []).slice(0, 2).map((upd) => (
                <li key={upd.id} className="text-xs text-slate-600">
                  • {upd.message}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
