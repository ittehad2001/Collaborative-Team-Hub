require("dotenv").config();

module.exports = {
  port: process.env.PORT || 4000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  accessSecret: process.env.JWT_ACCESS_SECRET || "access-dev-secret",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "refresh-dev-secret",
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT || "587",
  smtpSecure: process.env.SMTP_SECURE || "false",
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpFrom: process.env.SMTP_FROM,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
};
