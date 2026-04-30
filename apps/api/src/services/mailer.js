const nodemailer = require("nodemailer");
const env = require("../config/env");

function getTransport() {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass || !env.smtpFrom) return null;
  return nodemailer.createTransport({
    host: env.smtpHost,
    port: Number(env.smtpPort || 587),
    secure: String(env.smtpSecure || "false") === "true",
    auth: { user: env.smtpUser, pass: env.smtpPass }
  });
}

async function sendEmail({ to, subject, text, html }) {
  const transport = getTransport();
  if (!transport) {
    return { skipped: true };
  }
  await transport.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
    html
  });
  return { skipped: false };
}

module.exports = { sendEmail };
