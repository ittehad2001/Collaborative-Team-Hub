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
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">Action Items</h3>
        <div className="flex items-center gap-2">
          <button
            className={`btn-ghost w-full px-3 py-1 text-sm sm:w-auto ${view === "list" ? "bg-blue-600 text-white" : ""}`}
            onClick={() => setView("list")}
          >
            List
          </button>
          <button
            className={`btn-ghost w-full px-3 py-1 text-sm sm:w-auto ${view === "kanban" ? "bg-blue-600 text-white" : ""}`}
            onClick={() => setView("kanban")}
          >
            Kanban
          </button>
        </div>
      </div>

      <form className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3" onSubmit={submit}>
        <input className="input-field md:col-span-3" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Action item title" />
        <select className="input-field text-sm" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
          <option value="">Assign to (default: me)</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.role})
            </option>
          ))}
        </select>
        <select className="input-field text-sm" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <select className="input-field text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todo">todo</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </select>
        <input type="date" className="input-field text-sm" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <select className="input-field text-sm" value={goalId} onChange={(e) => setGoalId(e.target.value)}>
          <option value="">Link parent goal (optional)</option>
          {goals.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
        <button className="btn-primary px-3 py-2">Add item</button>
      </form>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {Object.entries(grouped).map(([status, list]) => (
            <div key={status} className="rounded-xl border border-slate-200 bg-white p-3">
              <h4 className="mb-2 text-sm font-semibold capitalize text-slate-700">{status.replace("_", " ")}</h4>
              <div className="space-y-2">
                {list.map((item) => (
                  <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-slate-500">Priority: {item.priority}</p>
                    <p className="text-xs text-slate-500">Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "n/a"}</p>
                    <select className="input-field mt-2 w-full text-sm" value={item.status} onChange={(e) => onStatus(item.id, e.target.value)}>
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
            <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">Priority: {item.priority}</p>
                </div>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                  {item.status.replace("_", " ")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
