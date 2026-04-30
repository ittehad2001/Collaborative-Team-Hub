const prisma = require("../config/prisma");

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
  res.json(item);
}

module.exports = { listItems, createItem, updateItem };
