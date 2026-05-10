const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");

const {
  generateResumeFromProfile,
} = require("../controllers/profile-ai.controller");

const router = express.Router();

router.post(
  "/generate-resume",
  authMiddleware,
  generateResumeFromProfile
);

module.exports = router;