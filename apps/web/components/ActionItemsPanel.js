"use client";

import { useMemo, useState } from "react";

export default function ActionItemsPanel({ items = [], members = [], goals = [], onCreate, onStatus }) {
  const [title, setTitle] = useState("");
  const [view, setView] = useState("kanban");
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("todo");
  const [goalId, setGoalId] = useState("");

  const grouped = useMemo(() => {
    return {
      todo: items.filter((i) => i.status === "todo"),
      in_progress: items.filter((i) => i.status === "in_progress"),
      done: items.filter((i) => i.status === "done")
    };
  }, [items]);

  async function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await onCreate({
      title,
      assigneeId: assigneeId || undefined,
      priority,
      dueDate: dueDate || undefined,
      status,
      goalId: goalId || undefined
    });
    setTitle("");
    setDueDate("");
    setGoalId("");
  }

  return (
    <section className="panel p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Action Items</h3>
        <button className="rounded-xl border border-slate-300 bg-white px-3 py-1 text-sm" onClick={() => setView(view === "kanban" ? "list" : "kanban")}>{view === "kanban" ? "List View" : "Kanban View"}</button>
      </div>

      <form className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3" onSubmit={submit}>
        <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 md:col-span-3" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New action item" />
        <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
          <option value="">Assign to (default: me)</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.role})
            </option>
          ))}
        </select>
        <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todo">todo</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </select>
        <input type="date" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={goalId} onChange={(e) => setGoalId(e.target.value)}>
          <option value="">Link parent goal (optional)</option>
          {goals.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
        <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-3 py-2 text-white">Add</button>
      </form>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {Object.entries(grouped).map(([status, list]) => (
            <div key={status} className="rounded-xl border border-slate-200 bg-white p-3">
              <h4 className="mb-2 text-sm font-semibold capitalize text-slate-700">{status.replace("_", " ")}</h4>
              <div className="space-y-2">
                {list.map((item) => (
                  <article key={item.id} className="rounded-lg bg-slate-50 p-2">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-slate-500">priority: {item.priority}</p>
                    <p className="text-xs text-slate-500">due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "n/a"}</p>
                    <select className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-1 text-sm" value={item.status} onChange={(e) => onStatus(item.id, e.target.value)}>
                      <option value="todo">todo</option>
                      <option value="in_progress">in_progress</option>
                      <option value="done">done</option>
                    </select>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-2">
              {item.title} - {item.status} ({item.priority})
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
