const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require("../utils/tokens");

function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge
  };
}

async function register(req, res) {
  const { email, password, name } = req.body;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, name, passwordHash } });
  return res.status(201).json({ id: user.id, email: user.email, name: user.name });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const payload = { id: user.id, email: user.email };
  res.cookie("accessToken", createAccessToken(payload), cookieOptions(15 * 60 * 1000));
  res.cookie("refreshToken", createRefreshToken(payload), cookieOptions(7 * 24 * 60 * 60 * 1000));

  return res.json({ user: payload });
}

function logout(req, res) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.json({ success: true });
}

function refresh(req, res) {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "Missing refresh token" });

  try {
    const payload = verifyRefreshToken(token);
    const nextPayload = { id: payload.id, email: payload.email };
    res.cookie("accessToken", createAccessToken(nextPayload), cookieOptions(15 * 60 * 1000));
    return res.json({ user: nextPayload });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

module.exports = { register, login, logout, refresh };
