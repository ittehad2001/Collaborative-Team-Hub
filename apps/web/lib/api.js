const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const res = await fetch(`${API}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}

export const api = {
  register: (data) => request("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  refresh: () => request("/api/auth/refresh", { method: "POST" }),
  me: () => request("/api/profile/me"),
  uploadAvatar: (formData) => request("/api/profile/avatar", { method: "POST", body: formData }),
  workspaces: () => request("/api/workspaces"),
  createWorkspace: (data) => request("/api/workspaces", { method: "POST", body: JSON.stringify(data) }),
  inviteMember: (workspaceId, email, role) => request(`/api/workspaces/${workspaceId}/invite`, { method: "POST", body: JSON.stringify({ email, role }) }),
  goals: (workspaceId) => request(`/api/workspaces/${workspaceId}/goals`),
  createGoal: (workspaceId, data) => request(`/api/workspaces/${workspaceId}/goals`, { method: "POST", body: JSON.stringify(data) }),
  addMilestone: (workspaceId, goalId, data) =>
    request(`/api/workspaces/${workspaceId}/goals/${goalId}/milestones`, { method: "POST", body: JSON.stringify(data) }),
  addGoalUpdate: (workspaceId, goalId, data) =>
    request(`/api/workspaces/${workspaceId}/goals/${goalId}/updates`, { method: "POST", body: JSON.stringify(data) }),
  announcements: (workspaceId) => request(`/api/workspaces/${workspaceId}/announcements`),
  createAnnouncement: (workspaceId, data) => request(`/api/workspaces/${workspaceId}/announcements`, { method: "POST", body: JSON.stringify(data) }),
  pinAnnouncement: (workspaceId, announcementId, pinned) => request(`/api/workspaces/${workspaceId}/announcements/${announcementId}/pin`, { method: "PATCH", body: JSON.stringify({ pinned }) }),
  reactAnnouncement: (workspaceId, announcementId, emoji) => request(`/api/workspaces/${workspaceId}/announcements/${announcementId}/reactions`, { method: "POST", body: JSON.stringify({ emoji }) }),
  commentAnnouncement: (workspaceId, announcementId, content) => request(`/api/workspaces/${workspaceId}/announcements/${announcementId}/comments`, { method: "POST", body: JSON.stringify({ content }) }),
  items: (workspaceId) => request(`/api/workspaces/${workspaceId}/items`),
  createItem: (workspaceId, data) => request(`/api/workspaces/${workspaceId}/items`, { method: "POST", body: JSON.stringify(data) }),
  updateItem: (workspaceId, itemId, data) => request(`/api/workspaces/${workspaceId}/items/${itemId}`, { method: "PATCH", body: JSON.stringify(data) }),
  analytics: (workspaceId) => request(`/api/workspaces/${workspaceId}/analytics/dashboard`),
  notifications: () => request("/api/notifications"),
  readNotification: (notificationId) => request(`/api/notifications/${notificationId}/read`, { method: "PATCH" })
};
