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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">Goals</h3>
        <p className="text-muted text-sm">Track outcomes and milestones.</p>
      </div>
      <form className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-[1.6fr_1fr_1fr_auto]" onSubmit={submit}>
        <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goal title" />
        <input type="date" className="input-field text-sm" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <select className="input-field text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="not_started">Not started</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <button className="btn-primary px-4 py-2">Add goal</button>
      </form>
      <ul className="mt-4 space-y-2">
        {goals.map((goal) => (
          <li key={goal.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900">{goal.title}</p>
                <p className="text-muted mt-1 text-xs">
                  Owner: {goal.owner?.email || "current user"} · Due: {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : "Not set"}
                </p>
              </div>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                {goal.status.replace("_", " ")}
              </span>
            </div>

            <details className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <summary className="cursor-pointer text-xs font-semibold text-slate-600">Milestones</summary>
              <div className="mt-2 flex flex-wrap gap-2">
                <input
                  className="input-field flex-1 text-xs"
                  placeholder="Milestone"
                  value={milestoneText[goal.id] || ""}
                  onChange={(e) => setMilestoneText((prev) => ({ ...prev, [goal.id]: e.target.value }))}
                />
                <input
                  className="input-field w-24 text-xs"
                  placeholder="%"
                  type="number"
                  min="0"
                  max="100"
                  value={milestoneProgress[goal.id] || ""}
                  onChange={(e) => setMilestoneProgress((prev) => ({ ...prev, [goal.id]: e.target.value }))}
                />
                <button
                  className="btn-outline px-3 py-2 text-xs"
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
                    {ms.title} · {ms.progress}%
                  </li>
                ))}
              </ul>
            </details>

            <details className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <summary className="cursor-pointer text-xs font-semibold text-slate-600">Progress updates</summary>
              <div className="mt-2 flex flex-wrap gap-2">
                <input
                  className="input-field flex-1 text-xs"
                  placeholder="Share a short update"
                  value={updateText[goal.id] || ""}
                  onChange={(e) => setUpdateText((prev) => ({ ...prev, [goal.id]: e.target.value }))}
                />
                <button
                  className="btn-outline px-3 py-2 text-xs"
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
                    {upd.message}
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
