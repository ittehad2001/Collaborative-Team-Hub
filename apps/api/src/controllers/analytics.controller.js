const { stringify } = require("csv-stringify/sync");
const prisma = require("../config/prisma");

async function dashboard(req, res) {
  const { workspaceId } = req.params;

  const [goals, items] = await Promise.all([
    prisma.goal.findMany({ where: { workspaceId } }),
    prisma.actionItem.findMany({ where: { workspaceId } })
  ]);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const completedThisWeek = items.filter((i) => i.status === "done" && i.createdAt >= weekAgo).length;
  const overdue = items.filter((i) => i.dueDate && i.dueDate < now && i.status !== "done").length;

  res.json({
    totalGoals: goals.length,
    completedThisWeek,
    overdueCount: overdue,
    chart: goals.map((g) => ({ title: g.title, status: g.status }))
  });
}

async function exportCsv(req, res) {
  const { workspaceId } = req.params;
  const items = await prisma.actionItem.findMany({ where: { workspaceId } });

  const csv = stringify(
    items.map((i) => ({ title: i.title, priority: i.priority, status: i.status, dueDate: i.dueDate })),
    { header: true }
  );

  res.header("Content-Type", "text/csv");
  res.attachment("workspace-items.csv");
  res.send(csv);
}

module.exports = { dashboard, exportCsv };
