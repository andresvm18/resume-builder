const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const validateIdParam = require("../middleware/validateIdParam");

const {
  generateResume,
  getResumes,
  downloadResume,
  getResumeById,
  deleteResume,
} = require("../controllers/resume.controller");

const {
  validateBody,
  generateResumeSchema,
} = require("../validators/schemas");

router.post(
  "/generate",
  authMiddleware,
  validateBody(generateResumeSchema, "Nombre, correo y resumen son requeridos"),
  generateResume
);

router.get("/", authMiddleware, getResumes);

router.get(
  "/:id/download",
  authMiddleware,
  validateIdParam,
  downloadResume
);

router.get(
  "/:id",
  authMiddleware,
  validateIdParam,
  getResumeById
);

router.delete(
  "/:id",
  authMiddleware,
  validateIdParam,
  deleteResume
);

module.exports = router;