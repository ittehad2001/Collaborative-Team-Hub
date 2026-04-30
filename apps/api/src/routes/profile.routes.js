const express = require("express");
const auth = require("../middleware/auth");
const { upload, me, uploadAvatar } = require("../controllers/profile.controller");

const router = express.Router();

router.get("/me", auth, me);
router.post("/avatar", auth, upload.single("avatar"), uploadAvatar);

module.exports = router;
