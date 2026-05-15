const express = require("express");

const { register, login, me } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const {
  loginLimiter,
  registerLimiter,
} = require("../middleware/security.middleware");

const {
  validateBody,
  registerSchema,
  loginSchema,
} = require("../validators/schemas");

const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  validateBody(registerSchema),
  register
);

router.post(
  "/login",
  loginLimiter,
  validateBody(loginSchema),
  login
);

router.get("/me", authMiddleware, me);

module.exports = router;