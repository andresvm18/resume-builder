const express = require("express");
const { register, login, me } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", register);  // Create new account
router.post("/login", login);        // Authenticate and get token

// Protected route (requires valid JWT token)
router.get("/me", authMiddleware, me);  // Get current user profile

module.exports = router;