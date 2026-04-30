const express = require("express");
const auth = require("../middleware/auth");
const { requireWorkspaceMember, requireRole } = require("../middleware/workspace");
const { listItems, createItem, updateItem } = require("../controllers/items.controller");

const router = express.Router({ mergeParams: true });

router.get("/", auth, requireWorkspaceMember, listItems);
router.post("/", auth, requireWorkspaceMember, requireRole(["ADMIN", "MEMBER"]), createItem);
router.patch("/:itemId", auth, requireWorkspaceMember, requireRole(["ADMIN", "MEMBER"]), updateItem);

module.exports = router;
