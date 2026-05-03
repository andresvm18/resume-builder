const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  optimizeResumeSummary,
  getAiRecommendations,
  optimizeResume,
} = require("../controllers/ai.controller");

const router = express.Router();

router.post("/optimize-summary", authMiddleware, optimizeResumeSummary);

router.post("/recommendations", authMiddleware, getAiRecommendations);

router.post("/optimize-resume", authMiddleware, optimizeResume);

module.exports = router;