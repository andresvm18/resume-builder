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

router.get("/:id/download", authMiddleware, downloadResume);

router.get("/:id", authMiddleware, getResumeById);

router.delete("/:id", authMiddleware, deleteResume);

module.exports = router;