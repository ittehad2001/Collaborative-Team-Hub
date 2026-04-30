"use client";

import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../lib/api";
import { useAuthStore } from "../store/useAuthStore";
import StatsCards from "./StatsCards";
import GoalChart from "./GoalChart";
import GoalsPanel from "./GoalsPanel";
import AnnouncementsPanel from "./AnnouncementsPanel";
import ActionItemsPanel from "./ActionItemsPanel";
import ProfileAvatarUpload from "./ProfileAvatarUpload";
import WorkspaceAdminPanel from "./WorkspaceAdminPanel";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export default function DashboardClient() {
  const { user, logout } = useAuthStore();
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceId, setWorkspaceId] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [goals, setGoals] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [online, setOnline] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const socket = useMemo(() => io(SOCKET_URL, { withCredentials: true }), []);

  async function loadAll(id) {
    try {
      const [a, g, an, it, ntf, mbr] = await Promise.all([
        api.analytics(id),
        api.goals(id),
        api.announcements(id),
        api.items(id),
        api.notifications(),
        api.workspaceMembers(id)
      ]);
      setAnalytics(a);
      setGoals(g);
      setAnnouncements(an);
      setItems(it);
      setNotifications(ntf);
      setMembers(mbr);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    api.workspaces()
      .then((data) => {
        setWorkspaces(data);
        if (data.length > 0) setWorkspaceId(data[0].id);
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!workspaceId || !user?.id) return;
    loadAll(workspaceId);
    socket.emit("workspace:join", { workspaceId, userId: user.id });

    socket.on("workspace:online", (list) => setOnline(list));
    socket.on("goal:created", () => loadAll(workspaceId));
    socket.on("announcement:new", () => loadAll(workspaceId));
    socket.on("item:created", () => loadAll(workspaceId));
    socket.on("item:status", () => loadAll(workspaceId));

    return () => {
      socket.off("workspace:online");
      socket.off("goal:created");
      socket.off("announcement:new");
      socket.off("item:created");
      socket.off("item:status");
      socket.disconnect();
    };
  }, [workspaceId, socket, user]);

  async function createGoalOptimistic(payload) {
    const previous = [...goals];
    const optimistic = { id: `temp-goal-${Date.now()}`, title: payload.title, status: "not_started" };
    setGoals((prev) => [optimistic, ...prev]);
    try {
      await api.createGoal(workspaceId, payload);
      await loadAll(workspaceId);
    } catch (e) {
      setGoals(previous);
      setError(e.message);
    }
  }

  async function createAnnouncementOptimistic(payload) {
    const previous = [...announcements];
    const optimistic = { id: `temp-ann-${Date.now()}`, title: payload.title, content: payload.content };
    setAnnouncements((prev) => [optimistic, ...prev]);
    try {
      await api.createAnnouncement(workspaceId, payload);
      await loadAll(workspaceId);
    } catch (e) {
      setAnnouncements(previous);
      setError(e.message);
    }
  }

  async function reactAnnouncement(announcementId, emoji) {
    try {
      const result = await api.reactAnnouncement(workspaceId, announcementId, emoji);
      await loadAll(workspaceId);
      return { ok: true, message: result.action === "removed" ? "Reaction removed." : "Reaction added." };
    } catch (e) {
      setError(e.message);
      return { ok: false, message: e.message };
    }
  }

  async function commentAnnouncement(announcementId, content) {
    try {
      await api.commentAnnouncement(workspaceId, announcementId, content);
      await loadAll(workspaceId);
      return { ok: true };
    } catch (e) {
      setError(e.message);
      return { ok: false, message: e.message };
    }
  }

  async function pinAnnouncement(announcementId, pinned) {
    try {
      await api.pinAnnouncement(workspaceId, announcementId, pinned);
      await loadAll(workspaceId);
      return { ok: true, message: pinned ? "Announcement pinned." : "Announcement unpinned." };
    } catch (e) {
      setError(e.message);
      return { ok: false, message: e.message };
    }
  }

  async function createItemOptimistic(payload) {
    const previous = [...items];
    const optimistic = { id: `temp-item-${Date.now()}`, title: payload.title, status: "todo" };
    setItems((prev) => [optimistic, ...prev]);
    try {
      await api.createItem(workspaceId, payload);
      await loadAll(workspaceId);
    } catch (e) {
      setItems(previous);
      setError(e.message);
    }
  }

  async function updateItemStatusOptimistic(itemId, status) {
    const previous = [...items];
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status } : item)));
    try {
      await api.updateItem(workspaceId, itemId, { status });
      await loadAll(workspaceId);
    } catch (e) {
      setItems(previous);
      setError(e.message);
    }
  }

  async function createWorkspace(payload) {
    try {
      await api.createWorkspace(payload);
      const ws = await api.workspaces();
      setWorkspaces(ws);
      if (ws.length) setWorkspaceId(ws[0].id);
      return { ok: true, message: "Workspace created" };
    } catch (e) {
      setError(e.message);
      return { ok: false, message: e.message };
    }
  }

  async function addGoalMilestone(goalId, data) {
    try {
      await api.addMilestone(workspaceId, goalId, data);
      await loadAll(workspaceId);
    } catch (e) {
      setError(e.message);
    }
  }

  async function addGoalUpdate(goalId, data) {
    try {
      await api.addGoalUpdate(workspaceId, goalId, data);
      await loadAll(workspaceId);
    } catch (e) {
      setError(e.message);
    }
  }

  async function markNotificationRead(id) {
    try {
      await api.readNotification(id);
      if (workspaceId) await loadAll(workspaceId);
    } catch (e) {
      setError(e.message);
    }
  }

  async function inviteMember(email, role) {
    if (!workspaceId) return { ok: false, message: "Select a workspace first" };
    try {
      await api.inviteMember(workspaceId, email, role);
      return { ok: true, message: "Invitation sent successfully" };
    } catch (e) {
      setError(e.message);
      return { ok: false, message: e.message };
    }
  }

  async function exportWorkspaceCsv() {
    if (!workspaceId) return;
    try {
      const res = await api.exportCsv(workspaceId);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "workspace-items.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-5 p-6">
      <header className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Team Hub Dashboard</h1>
          <p className="text-sm text-slate-500">Online members: {online.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <ProfileAvatarUpload />
          <button className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm transition hover:bg-slate-50" onClick={exportWorkspaceCsv}>
            Export CSV
          </button>
          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2" value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)}>
            {workspaces.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <button className="rounded-xl border border-slate-300 bg-white px-3 py-2 transition hover:bg-slate-50" onClick={logout}>Logout</button>
        </div>
      </header>

      <WorkspaceAdminPanel onCreateWorkspace={createWorkspace} onInviteMember={inviteMember} />
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p> : null}
      {notifications.length > 0 ? (
        <section className="panel p-4">
          <h4 className="font-semibold">Notifications</h4>
          <ul className="mt-2 space-y-1">
            {notifications.slice(0, 5).map((n) => (
              <li key={n.id} className="flex items-center justify-between rounded border border-slate-200 bg-white px-2 py-1 text-sm">
                <span>{n.message}</span>
                {!n.read ? <button className="text-xs text-blue-600" onClick={() => markNotificationRead(n.id)}>Mark read</button> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!workspaceId ? (
        <section className="panel p-6 text-slate-600">
          <p className="text-lg font-semibold text-slate-900">Welcome! Create your first workspace</p>
          <p className="mt-1 text-sm">
            Use the workspace form above to create one, then goals, announcements, and action items will appear here.
          </p>
        </section>
      ) : (
        <>
          <StatsCards data={analytics} />
          <GoalChart chart={analytics?.chart || []} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <GoalsPanel
              goals={goals}
              onCreate={createGoalOptimistic}
              onAddMilestone={addGoalMilestone}
              onAddUpdate={addGoalUpdate}
            />
            <AnnouncementsPanel
              announcements={announcements}
              members={members}
              onCreate={createAnnouncementOptimistic}
              onReact={reactAnnouncement}
              onComment={commentAnnouncement}
              onPinToggle={pinAnnouncement}
            />
          </div>

          <ActionItemsPanel
            items={items}
            members={members}
            goals={goals}
            onCreate={createItemOptimistic}
            onStatus={updateItemStatusOptimistic}
          />
        </>
      )}
    </main>
  );
}
