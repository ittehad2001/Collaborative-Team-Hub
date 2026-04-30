"use client";

import { useMemo, useState } from "react";

export default function ActionItemsPanel({ items = [], onCreate, onStatus }) {
  const [title, setTitle] = useState("");
  const [view, setView] = useState("kanban");

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
    await onCreate({ title });
    setTitle("");
  }

  return (
    <section className="panel p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Action Items</h3>
        <button className="rounded-xl border border-slate-300 bg-white px-3 py-1 text-sm" onClick={() => setView(view === "kanban" ? "list" : "kanban")}>{view === "kanban" ? "List View" : "Kanban View"}</button>
      </div>

      <form className="mb-4 flex gap-2" onSubmit={submit}>
        <input className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New action item" />
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
              {item.title} - {item.status}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
