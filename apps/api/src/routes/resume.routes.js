const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const validateIdParam = require("../middleware/validateIdParam");

const {
  generateResume,
  getResumes,
  downloadResume,
  getResumeById,
  updateResume,
  duplicateResume,
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

router.post(
  "/:id/duplicate",
  authMiddleware,
  validateIdParam,
  duplicateResume
);

router.get(
  "/:id",
  authMiddleware,
  validateIdParam,
  getResumeById
);

router.put(
  "/:id",
  authMiddleware,
  validateIdParam,
  updateResume
);

router.delete(
  "/:id",
  authMiddleware,
  validateIdParam,
  deleteResume,
);

module.exports = router;