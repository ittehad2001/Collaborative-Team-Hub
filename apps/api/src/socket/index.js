const online = new Map();
const socketPresence = new Map();

function initSocket(io) {
  io.on("connection", (socket) => {
    socket.on("workspace:join", ({ workspaceId, userId }) => {
      socket.join(workspaceId);
      if (!online.has(workspaceId)) online.set(workspaceId, new Set());
      online.get(workspaceId).add(userId);
      socketPresence.set(socket.id, { workspaceId, userId });
      io.to(workspaceId).emit("workspace:online", Array.from(online.get(workspaceId)));
    });

    socket.on("disconnecting", () => {
      const presence = socketPresence.get(socket.id);
      if (!presence) return;
      const { workspaceId, userId } = presence;
      if (!online.has(workspaceId)) return;

      online.get(workspaceId).delete(userId);
      io.to(workspaceId).emit("workspace:online", Array.from(online.get(workspaceId)));
      socketPresence.delete(socket.id);
    });
  });
}

module.exports = { initSocket };
