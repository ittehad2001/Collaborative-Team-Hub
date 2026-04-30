const prisma = require("../config/prisma");

function sanitizeRichText(html) {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");
}

async function listAnnouncements(req, res) {
  const { workspaceId } = req.params;
  const announcements = await prisma.announcement.findMany({
    where: { workspaceId },
    include: {
      comments: { include: { user: true } },
      reactions: true
    },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }]
  });
  res.json(announcements);
}

async function createAnnouncement(req, res) {
  const { workspaceId } = req.params;
  const { title, content, pinned } = req.body;
  const safeContent = sanitizeRichText(content);

  const data = await prisma.announcement.create({
    data: {
      workspaceId,
      authorId: req.user.id,
      title,
      content: safeContent,
      pinned: !!pinned
    }
  });

  req.io?.to(workspaceId).emit("announcement:new", data);
  res.status(201).json(data);
}

async function react(req, res) {
  const { announcementId } = req.params;
  const { emoji } = req.body;

  const existing = await prisma.reaction.findUnique({
    where: {
      announcementId_userId_emoji: {
        announcementId,
        userId: req.user.id,
        emoji
      }
    }
  });

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
    return res.json({ action: "removed", emoji });
  }

  const reaction = await prisma.reaction.create({
    data: { announcementId, userId: req.user.id, emoji }
  });

  return res.json({ action: "added", reaction });
}

async function comment(req, res) {
  const { workspaceId, announcementId } = req.params;
  const { content } = req.body;

  const newComment = await prisma.comment.create({
    data: {
      announcementId,
      userId: req.user.id,
      content
    }
  });

  const emails = Array.from(content.matchAll(/@([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g)).map((m) =>
    m[1].toLowerCase()
  );
  if (emails.length > 0) {
    const targets = await prisma.user.findMany({
      where: {
        email: { in: emails },
        memberships: {
          some: { workspaceId }
        }
      }
    });

    if (targets.length > 0) {
      await prisma.notification.createMany({
        data: targets.map((user) => ({
          userId: user.id,
          type: "mention",
          message: `${req.user.email} mentioned you in a comment`
        }))
      });
    }

    req.io?.to(workspaceId).emit("notification:mention", {
      message: `${req.user.email} mentioned ${targets.length} teammate(s)`,
      content
    });
  }

  res.status(201).json(newComment);
}

async function pin(req, res) {
  const { announcementId } = req.params;
  const { pinned } = req.body;
  const updated = await prisma.announcement.update({
    where: { id: announcementId },
    data: { pinned: !!pinned }
  });
  res.json(updated);
}

module.exports = { listAnnouncements, createAnnouncement, react, comment, pin };
