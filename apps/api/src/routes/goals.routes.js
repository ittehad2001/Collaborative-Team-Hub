const express = require("express");
const auth = require("../middleware/auth");
const { requireWorkspaceMember, requireRole } = require("../middleware/workspace");
const { listGoals, createGoal, addMilestone, addGoalUpdate } = require("../controllers/goals.controller");

const router = express.Router({ mergeParams: true });

router.get("/", auth, requireWorkspaceMember, listGoals);
router.post("/", auth, requireWorkspaceMember, requireRole(["ADMIN", "MEMBER"]), createGoal);
router.post("/:goalId/milestones", auth, requireWorkspaceMember, requireRole(["ADMIN", "MEMBER"]), addMilestone);
router.post("/:goalId/updates", auth, requireWorkspaceMember, requireRole(["ADMIN", "MEMBER"]), addGoalUpdate);

module.exports = router;
