const prisma = require("../config/prisma");

async function requireWorkspaceMember(req, res, next) {
  const workspaceId = req.params.workspaceId;
  if (!workspaceId) return res.status(400).json({ message: "workspaceId is required" });

  const membership = await prisma.workspaceMembership.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: req.user.id
      }
    }
  });

  if (!membership) return res.status(403).json({ message: "Workspace access denied" });
  req.membership = membership;
  next();
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.membership || !roles.includes(req.membership.role)) {
      return res.status(403).json({ message: "Insufficient role" });
    }
    next();
  };
}

module.exports = { requireWorkspaceMember, requireRole };
