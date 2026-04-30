const multer = require("multer");
const prisma = require("../config/prisma");
const cloudinary = require("../services/cloudinary");

const upload = multer({ storage: multer.memoryStorage() });

async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true, avatarUrl: true }
  });
  res.json(user);
}

async function uploadAvatar(req, res) {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  const uploaded = await cloudinary.uploader.upload(base64, { folder: "teamhub/avatars" });

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { avatarUrl: uploaded.secure_url }
  });

  res.json({ avatarUrl: user.avatarUrl });
}

module.exports = { upload, me, uploadAvatar };
