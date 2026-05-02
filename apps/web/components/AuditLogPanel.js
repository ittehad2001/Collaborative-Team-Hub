"use client";

import { useMemo, useState } from "react";

export default function AuditLogPanel({ logs = [], onFilterChange, onExport }) {
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");

  const uniqueActions = useMemo(() => Array.from(new Set(logs.map((l) => l.action))), [logs]);
  const uniqueEntities = useMemo(() => Array.from(new Set(logs.map((l) => l.entityType))), [logs]);

  function applyFilters(nextAction, nextEntityType) {
    onFilterChange({ action: nextAction, entityType: nextEntityType });
  }

  return (
    <section className="panel p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">Audit Timeline</h3>
        <button className="btn-outline px-3 py-2 text-sm" onClick={onExport}>
          Export Audit CSV
        </button>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <select
          className="input-field w-full text-sm sm:w-auto"
          value={action}
          onChange={(e) => {
            const value = e.target.value;
            setAction(value);
            applyFilters(value, entityType);
          }}
        >
          <option value="">Filter action</option>
          {uniqueActions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          className="input-field w-full text-sm sm:w-auto"
          value={entityType}
          onChange={(e) => {
            const value = e.target.value;
            setEntityType(value);
            applyFilters(action, value);
          }}
        >
          <option value="">Filter entity</option>
          {uniqueEntities.map((et) => (
            <option key={et} value={et}>
              {et}
            </option>
          ))}
        </select>
      </div>
      <ul className="space-y-2">
        {logs.slice(0, 20).map((log) => (
          <li key={log.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
            <p className="font-semibold text-slate-800">{log.action}</p>
            <p className="text-xs text-slate-500">
              {new Date(log.createdAt).toLocaleString()} — {log.user?.email}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {log.entityType} {log.entityId ? `(${log.entityId})` : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
