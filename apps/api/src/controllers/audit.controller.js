const { stringify } = require("csv-stringify/sync");
const prisma = require("../config/prisma");

async function listAuditLogs(req, res) {
  const { workspaceId } = req.params;
  const { action, entityType } = req.query;
  const logs = await prisma.auditLog.findMany({
    where: {
      workspaceId,
      ...(action ? { action } : {}),
      ...(entityType ? { entityType } : {})
    },
    include: {
      user: { select: { id: true, email: true, name: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 200
  });
  res.json(logs);
}

async function exportAuditCsv(req, res) {
  const { workspaceId } = req.params;
  const logs = await prisma.auditLog.findMany({
    where: { workspaceId },
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: "desc" }
  });

  const csv = stringify(
    logs.map((l) => ({
      createdAt: l.createdAt.toISOString(),
      actor: l.user.email,
      action: l.action,
      entityType: l.entityType,
      entityId: l.entityId || "",
      details: JSON.stringify(l.details || {})
    })),
    { header: true }
  );

  res.header("Content-Type", "text/csv");
  res.attachment("workspace-audit-log.csv");
  res.send(csv);
}

module.exports = { listAuditLogs, exportAuditCsv };
