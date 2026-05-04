const express = require("express");
const { register, login, me } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const {
  validateBody,
  registerSchema,
  loginSchema,
} = require("../validators/schemas");

const router = express.Router();

router.post(
  "/register",
  validateBody(registerSchema, "Name, email and password are required"),
  register
);

router.post(
  "/login",
  validateBody(loginSchema, "Email and password are required"),
  login
);

router.get("/me", authMiddleware, me);

module.exports = router;