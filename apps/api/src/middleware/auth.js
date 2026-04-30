const { verifyAccessToken } = require("../utils/tokens");

module.exports = function auth(req, res, next) {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
