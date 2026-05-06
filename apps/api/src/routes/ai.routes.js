const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  optimizeResumeSummary,
  getAiRecommendations,
  optimizeResume,
  analyzeFinalResumeAts,
} = require("../controllers/ai.controller");

const {
  validateBody,
  resumeDataSchema,
  aiWithJobDescriptionSchema,
} = require("../validators/schemas");

const router = express.Router();

router.post(
  "/optimize-summary",
  authMiddleware,
  validateBody(resumeDataSchema, "resumeData es requerido"),
  optimizeResumeSummary
);

router.post(
  "/recommendations",
  authMiddleware,
  validateBody(
    aiWithJobDescriptionSchema,
    "resumeData y jobDescription son requeridos"
  ),
  getAiRecommendations
);

router.post(
  "/optimize-resume",
  authMiddleware,
  validateBody(resumeDataSchema, "resumeData es requerido"),
  optimizeResume
);

router.post(
  "/final-ats-analysis",
  authMiddleware,
  validateBody(
    aiWithJobDescriptionSchema,
    "resumeData y jobDescription son requeridos"
  ),
  analyzeFinalResumeAts
);

module.exports = router;