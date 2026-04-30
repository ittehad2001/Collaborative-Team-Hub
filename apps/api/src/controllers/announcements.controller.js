const prisma = require("../config/prisma");
const { logAudit } = require("../services/audit");
const { sendEmail } = require("../services/mailer");

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
  await logAudit({
    workspaceId,
    userId: req.user.id,
    action: "announcement.create",
    entityType: "announcement",
    entityId: data.id,
    details: { title, pinned: !!pinned }
  });
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
    const ann = await prisma.announcement.findUnique({ where: { id: announcementId }, select: { workspaceId: true } });
    if (ann) {
      await logAudit({
        workspaceId: ann.workspaceId,
        userId: req.user.id,
        action: "announcement.reaction.remove",
        entityType: "reaction",
        entityId: existing.id,
        details: { announcementId, emoji }
      });
    }
    return res.json({ action: "removed", emoji });
  }

  const reaction = await prisma.reaction.create({
    data: { announcementId, userId: req.user.id, emoji }
  });
  const ann = await prisma.announcement.findUnique({ where: { id: announcementId }, select: { workspaceId: true } });
  if (ann) {
    await logAudit({
      workspaceId: ann.workspaceId,
      userId: req.user.id,
      action: "announcement.reaction.add",
      entityType: "reaction",
      entityId: reaction.id,
      details: { announcementId, emoji }
    });
  }

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
  await logAudit({
    workspaceId,
    userId: req.user.id,
    action: "announcement.comment",
    entityType: "comment",
    entityId: newComment.id,
    details: { announcementId, content }
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
      await Promise.all(
        targets.map((user) =>
          sendEmail({
            to: user.email,
            subject: "You were mentioned in Team Hub",
            text: `${req.user.email} mentioned you in a workspace comment: "${content}"`,
            html: `<p>${req.user.email} mentioned you in a workspace comment.</p><blockquote>${content}</blockquote>`
          })
        )
      );
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
  const current = await prisma.announcement.findUnique({
    where: { id: announcementId },
    select: { workspaceId: true }
  });
  if (current) {
    await logAudit({
      workspaceId: current.workspaceId,
      userId: req.user.id,
      action: pinned ? "announcement.pin" : "announcement.unpin",
      entityType: "announcement",
      entityId: announcementId,
      details: { pinned: !!pinned }
    });
  }
  res.json(updated);
}

module.exports = { listAnnouncements, createAnnouncement, react, comment, pin };
