const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  generateResume,
  getResumes,
  downloadResume,
} = require("../controllers/resume.controller");

// Generate PDF
router.post("/generate", authMiddleware, generateResume);

// Get user resumes
router.get("/", authMiddleware, getResumes);

// Get specific PDF
router.get("/:id/download", authMiddleware, downloadResume);

module.exports = router;