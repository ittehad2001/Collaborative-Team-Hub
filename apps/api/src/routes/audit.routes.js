const express = require("express");
const auth = require("../middleware/auth");
const { requireWorkspaceMember } = require("../middleware/workspace");
const { listAuditLogs, exportAuditCsv } = require("../controllers/audit.controller");

const router = express.Router({ mergeParams: true });

router.get("/", auth, requireWorkspaceMember, listAuditLogs);
router.get("/export", auth, requireWorkspaceMember, exportAuditCsv);

module.exports = router;
