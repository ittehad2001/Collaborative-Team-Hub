const prisma = require("../config/prisma");

async function listNotifications(req, res) {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  res.json(notifications);
}

async function markRead(req, res) {
  const { notificationId } = req.params;
  const updated = await prisma.notification.updateMany({
    where: { id: notificationId, userId: req.user.id },
    data: { read: true }
  });
  res.json({ updated: updated.count });
}

module.exports = { listNotifications, markRead };
