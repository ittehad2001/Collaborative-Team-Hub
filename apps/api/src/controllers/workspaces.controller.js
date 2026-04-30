const prisma = require("../config/prisma");

async function listWorkspaces(req, res) {
  const workspaces = await prisma.workspace.findMany({
    where: { memberships: { some: { userId: req.user.id } } },
    include: { memberships: true }
  });
  res.json(workspaces);
}

async function createWorkspace(req, res) {
  const { name, description, accentColor } = req.body;
  const workspace = await prisma.workspace.create({
    data: {
      name,
      description,
      accentColor,
      memberships: {
        create: {
          userId: req.user.id,
          role: "ADMIN"
        }
      }
    }
  });
  res.status(201).json(workspace);
}

async function inviteMember(req, res) {
  const { workspaceId } = req.params;
  const { email, role } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const membership = await prisma.workspaceMembership.upsert({
    where: { workspaceId_userId: { workspaceId, userId: user.id } },
    create: { workspaceId, userId: user.id, role: role || "MEMBER" },
    update: { role: role || "MEMBER" }
  });

  res.json(membership);
}

module.exports = { listWorkspaces, createWorkspace, inviteMember };
