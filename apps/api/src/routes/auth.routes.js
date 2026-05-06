const express = require("express");
const rateLimit = require("express-rate-limit");
const { register, login, me } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Demasiados intentos de autenticación. Intenta de nuevo más tarde.",
  },
});

const {
  validateBody,
  registerSchema,
  loginSchema,
} = require("../validators/schemas");

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  validateBody(registerSchema),
  register
);

router.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  login
);

router.get("/me", authMiddleware, me);

module.exports = router;