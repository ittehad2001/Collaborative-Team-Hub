const prisma = require("../config/prisma");
const { logAudit } = require("../services/audit");

async function listItems(req, res) {
  const { workspaceId } = req.params;
  const items = await prisma.actionItem.findMany({ where: { workspaceId } });
  res.json(items);
}

async function createItem(req, res) {
  const { workspaceId } = req.params;
  const { title, assigneeId, goalId, priority, dueDate, status } = req.body;
  const item = await prisma.actionItem.create({
    data: {
      workspaceId,
      title,
      assigneeId: assigneeId || req.user.id,
      goalId: goalId || null,
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      status: status || "todo"
    }
  });

  req.io?.to(workspaceId).emit("item:created", item);
  await logAudit({
    workspaceId,
    userId: req.user.id,
    action: "item.create",
    entityType: "action_item",
    entityId: item.id,
    details: { title, status: item.status, priority: item.priority, goalId: item.goalId }
  });
  res.status(201).json(item);
}

async function updateItem(req, res) {
  const { itemId } = req.params;
  const { status } = req.body;

  const item = await prisma.actionItem.update({
    where: { id: itemId },
    data: { status }
  });

  req.io?.emit("item:status", item);
  await logAudit({
    workspaceId: item.workspaceId,
    userId: req.user.id,
    action: "item.status.change",
    entityType: "action_item",
    entityId: item.id,
    details: { status: item.status }
  });
  res.json(item);
}

module.exports = { listItems, createItem, updateItem };
