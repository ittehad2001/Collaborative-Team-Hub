"use client";

import { useState } from "react";

export default function WorkspaceAdminPanel({ onCreateWorkspace, onInviteMember }) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [workspaceAccentColor, setWorkspaceAccentColor] = useState("#2563eb");
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info");

  return (
    <section className="panel p-5">
      <h3 className="text-lg font-semibold">Workspace Management</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          className="rounded-xl border border-slate-200 bg-white px-3 py-2"
          placeholder="New workspace name"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />
        <input
          className="rounded-xl border border-slate-200 bg-white px-3 py-2"
          placeholder="Workspace description"
          value={workspaceDescription}
          onChange={(e) => setWorkspaceDescription(e.target.value)}
        />
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          Accent
          <input
            type="color"
            value={workspaceAccentColor}
            onChange={(e) => setWorkspaceAccentColor(e.target.value)}
          />
        </label>
        <button
          className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-2 text-white"
          onClick={async () => {
            if (!workspaceName) return;
            const result = await onCreateWorkspace({
              name: workspaceName,
              description: workspaceDescription,
              accentColor: workspaceAccentColor
            });
            if (result?.ok) {
              setWorkspaceName("");
              setWorkspaceDescription("");
              setWorkspaceAccentColor("#2563eb");
            }
            setStatus(result?.message || "Workspace action completed");
            setStatusType(result?.ok ? "success" : "error");
          }}
        >
          Create Workspace
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          className="rounded-xl border border-slate-200 bg-white px-3 py-2"
          placeholder="Invite by email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <select className="rounded-xl border border-slate-200 bg-white px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          className="rounded-xl border border-slate-300 bg-white px-3 py-2"
          onClick={async () => {
            if (!inviteEmail) return;
            const result = await onInviteMember(inviteEmail, role);
            if (result?.ok) setInviteEmail("");
            setStatus(
              result?.ok
                ? result.message
                : `${result?.message || "Invite failed"}. User must register first with this email.`
            );
            setStatusType(result?.ok ? "success" : "error");
          }}
        >
          Invite
        </button>
      </div>
      {status ? (
        <p className={`mt-2 text-sm ${statusType === "error" ? "text-red-600" : "text-emerald-600"}`}>{status}</p>
      ) : null}
    </section>
  );
}
