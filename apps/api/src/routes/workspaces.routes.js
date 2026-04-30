const express = require("express");
const auth = require("../middleware/auth");
const { requireWorkspaceMember, requireRole } = require("../middleware/workspace");
const { listWorkspaces, createWorkspace, inviteMember } = require("../controllers/workspaces.controller");

const router = express.Router();

router.get("/", auth, listWorkspaces);
router.post("/", auth, createWorkspace);
router.post("/:workspaceId/invite", auth, requireWorkspaceMember, requireRole(["ADMIN"]), inviteMember);

module.exports = router;
