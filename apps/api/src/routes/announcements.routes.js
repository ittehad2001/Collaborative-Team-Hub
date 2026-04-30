const express = require("express");
const auth = require("../middleware/auth");
const { requireWorkspaceMember, requireRole } = require("../middleware/workspace");
const { listAnnouncements, createAnnouncement, react, comment, pin } = require("../controllers/announcements.controller");

const router = express.Router({ mergeParams: true });

router.get("/", auth, requireWorkspaceMember, listAnnouncements);
router.post("/", auth, requireWorkspaceMember, requireRole(["ADMIN"]), createAnnouncement);
router.patch("/:announcementId/pin", auth, requireWorkspaceMember, requireRole(["ADMIN"]), pin);
router.post("/:announcementId/reactions", auth, requireWorkspaceMember, react);
router.post("/:announcementId/comments", auth, requireWorkspaceMember, comment);

module.exports = router;
