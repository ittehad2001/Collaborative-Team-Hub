const express = require("express");
const { register, login, logout, refresh } = require("../controllers/auth.controller");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../schemas/auth.schema");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refresh);

module.exports = router;
