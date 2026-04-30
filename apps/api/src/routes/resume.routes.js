const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  generateResume,
  getResumes,
  downloadResume,
  getResumeById,
  deleteResume,
} = require("../controllers/resume.controller");

// Generate PDF
router.post("/generate", authMiddleware, generateResume);

// Get user resumes
router.get("/", authMiddleware, getResumes);

// Get specific PDF (download)
router.get("/:id/download", authMiddleware, downloadResume);

// Get specific PDF (edit)
router.get("/:id", authMiddleware, getResumeById);

// Delete
router.delete("/:id", authMiddleware, deleteResume);

module.exports = router;