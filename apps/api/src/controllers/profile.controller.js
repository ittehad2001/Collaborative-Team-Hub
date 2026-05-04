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
  let avatarUrl = base64;

  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    try {
      const uploaded = await cloudinary.uploader.upload(base64, { folder: "teamhub/avatars" });
      avatarUrl = uploaded.secure_url;
    } catch (error) {
      console.warn("Avatar upload fell back to local data URL:", error.message);
    }
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { avatarUrl }
  });

  res.json({ avatarUrl: user.avatarUrl });
}

module.exports = { upload, me, uploadAvatar };
