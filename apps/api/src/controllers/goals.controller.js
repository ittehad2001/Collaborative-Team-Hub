const prisma = require("../config/prisma");

async function listGoals(req, res) {
  const { workspaceId } = req.params;
  const goals = await prisma.goal.findMany({
    where: { workspaceId },
    include: { milestones: true, updates: true, owner: true, items: true }
  });
  res.json(goals);
}

async function createGoal(req, res) {
  const { workspaceId } = req.params;
  const { title, dueDate, ownerId, status } = req.body;
  const goal = await prisma.goal.create({
    data: {
      workspaceId,
      title,
      dueDate: dueDate ? new Date(dueDate) : null,
      ownerId: ownerId || req.user.id,
      status: status || "not_started"
    }
  });

  req.io?.to(workspaceId).emit("goal:created", goal);
  res.status(201).json(goal);
}

async function addMilestone(req, res) {
  const { goalId } = req.params;
  const { title, progress } = req.body;
  const milestone = await prisma.milestone.create({
    data: { goalId, title, progress: progress || 0 }
  });
  res.status(201).json(milestone);
}

async function addGoalUpdate(req, res) {
  const { goalId } = req.params;
  const { message } = req.body;
  const update = await prisma.goalUpdate.create({
    data: { goalId, userId: req.user.id, message }
  });
  res.status(201).json(update);
}

module.exports = { listGoals, createGoal, addMilestone, addGoalUpdate };
