const jwt = require("jsonwebtoken");
const env = require("../config/env");

function createAccessToken(payload) {
  return jwt.sign(payload, env.accessSecret, { expiresIn: "15m" });
}

function createRefreshToken(payload) {
  return jwt.sign(payload, env.refreshSecret, { expiresIn: "7d" });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.accessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.refreshSecret);
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
