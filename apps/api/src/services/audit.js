const prisma = require("../config/prisma");

async function logAudit({ workspaceId, userId, action, entityType, entityId, details }) {
  if (!workspaceId || !userId || !action || !entityType) return;
  await prisma.auditLog.create({
    data: {
      workspaceId,
      userId,
      action,
      entityType,
      entityId: entityId || null,
      details: details || undefined
    }
  });
}

module.exports = { logAudit };
