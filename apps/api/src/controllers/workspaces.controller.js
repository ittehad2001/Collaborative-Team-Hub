const prisma = require("../config/prisma");
const { logAudit } = require("../services/audit");

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
  await logAudit({
    workspaceId: workspace.id,
    userId: req.user.id,
    action: "workspace.create",
    entityType: "workspace",
    entityId: workspace.id,
    details: { name, description, accentColor }
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
  await logAudit({
    workspaceId,
    userId: req.user.id,
    action: "workspace.invite",
    entityType: "member",
    entityId: user.id,
    details: { email: user.email, role: role || "MEMBER" }
  });

  res.json(membership);
}

async function listMembers(req, res) {
  const { workspaceId } = req.params;
  const members = await prisma.workspaceMembership.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: { id: true, name: true, email: true, avatarUrl: true }
      }
    }
  });
  res.json(
    members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      avatarUrl: m.user.avatarUrl,
      role: m.role
    }))
  );
}

module.exports = { listWorkspaces, createWorkspace, inviteMember, listMembers };
