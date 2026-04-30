const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const env = require("./config/env");

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const workspaceRoutes = require("./routes/workspaces.routes");
const goalsRoutes = require("./routes/goals.routes");
const announcementRoutes = require("./routes/announcements.routes");
const itemRoutes = require("./routes/items.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const notificationsRoutes = require("./routes/notifications.routes");

function createApp(io = null) {
  const app = express();
  const openapi = YAML.load(`${__dirname}/docs/openapi.yaml`);

  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use((req, _res, next) => {
    req.io = io;
    next();
  });

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.get("/", (_req, res) =>
    res.json({
      name: "Team Hub API",
      ok: true,
      docs: "/api/docs",
      health: "/health"
    })
  );
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapi));
  app.use("/api/auth", authRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/workspaces", workspaceRoutes);
  app.use("/api/workspaces/:workspaceId/goals", goalsRoutes);
  app.use("/api/workspaces/:workspaceId/announcements", announcementRoutes);
  app.use("/api/workspaces/:workspaceId/items", itemRoutes);
  app.use("/api/workspaces/:workspaceId/analytics", analyticsRoutes);
  app.use("/api/notifications", notificationsRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}

module.exports = { createApp };
