const express = require("express");
const auth = require("../middleware/auth");
const { requireWorkspaceMember } = require("../middleware/workspace");
const { dashboard, exportCsv } = require("../controllers/analytics.controller");

const router = express.Router({ mergeParams: true });

router.get("/dashboard", auth, requireWorkspaceMember, dashboard);
router.get("/export", auth, requireWorkspaceMember, exportCsv);

module.exports = router;
