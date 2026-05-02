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
      <div className="mt-4 grid gap-3 md:grid-cols-[1.2fr_1.4fr_auto]">
        <input
          className="input-field"
          placeholder="Workspace name"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Workspace description"
          value={workspaceDescription}
          onChange={(e) => setWorkspaceDescription(e.target.value)}
        />
        <div className="flex flex-wrap items-center gap-2">
          <label className="input-field flex w-full items-center gap-2 text-sm sm:w-auto">
            Accent
            <input
              type="color"
              value={workspaceAccentColor}
              onChange={(e) => setWorkspaceAccentColor(e.target.value)}
            />
          </label>
          <button
            className="btn-primary w-full px-3 py-2 sm:w-auto"
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
            Create
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1.6fr_0.6fr_auto]">
        <input
          className="input-field"
          placeholder="Invite by email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          className="btn-outline w-full px-3 py-2 sm:w-auto"
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
