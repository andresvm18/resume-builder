const {
  generateResumePdf,
  getUserResumes,
  generateResumePdfById,
  getUserResumeById,
  updateUserResume,
  duplicateUserResume,
  deleteUserResume,
} = require("../services/resume.service");

const { normalizeResumeData } = require("../utils/resumeNormalizer");
const logger = require("../utils/logger");

async function generateResume(req, res) {
  try {
    const { fullName, email, summary } = req.body;

    if (!fullName || !email || !summary) {
      return res.status(400).json({
        message: "Nombre, correo y resumen son requeridos",
      });
    }

    const cleanData = normalizeResumeData(req.body);

    const pdfBuffer = await generateResumePdf(
      cleanData,
      req.user.userId
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");

    return res.end(pdfBuffer);
  } catch (error) {
    logger.error("RESUME", "Error generating resume", {
      message: error.message,
      userId: req.user?.userId,
    });

    const knownErrors = {
      PDF_GENERATION_FAILED:
        "No se pudo compilar el PDF. Revisa que los datos del CV no contengan contenido inválido.",
      PDF_EMPTY_OR_INVALID:
        "El PDF generado está vacío o es inválido.",
    };

    return res.status(500).json({
      message: knownErrors[error.message] || "Error al generar el CV",
    });
  }
}

async function getResumes(req, res) {
  try {
    const resumes = await getUserResumes(req.user.userId);
    return res.json(resumes);
  } catch (error) {
    logger.error("RESUME", "Error fetching resumes", {
      message: error.message,
      userId: req.user?.userId,
    });

    return res.status(500).json({
      message: "Error al obtener los CVs",
    });
  }
}

async function downloadResume(req, res) {
  try {
    const pdfBuffer = await generateResumePdfById(
      req.params.id,
      req.user.userId
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.end(pdfBuffer);
  } catch (error) {
    if (error.message === "RESUME_NOT_FOUND") {
      return res.status(404).json({
        message: "CV no encontrado",
      });
    }

    logger.error("RESUME", "Error downloading resume", {
      message: error.message,
      userId: req.user?.userId,
      resumeId: req.params.id,
    });

    const knownErrors = {
      PDF_GENERATION_FAILED:
        "No se pudo compilar el PDF para este CV.",
      PDF_EMPTY_OR_INVALID:
        "El PDF generado está vacío o es inválido.",
    };

    return res.status(500).json({
      message: knownErrors[error.message] || "Error al descargar el CV",
    });
  }
}

async function getResumeById(req, res) {
  try {
    const resume = await getUserResumeById(req.params.id, req.user.userId);

    return res.json(resume);
  } catch (error) {
    logger.warn("RESUME", "Resume not found", {
      message: error.message,
      userId: req.user?.userId,
      resumeId: req.params.id,
    });

    return res.status(404).json({
      message: "CV no encontrado",
    });
  }
}

async function updateResume(req, res) {
  try {
    const cleanData = normalizeResumeData(req.body);

    const updatedResume = await updateUserResume(
      req.params.id,
      req.user.userId,
      cleanData
    );

    return res.json(updatedResume);
  } catch (error) {
    if (error.message === "RESUME_NOT_FOUND") {
      return res.status(404).json({
        message: "CV no encontrado",
      });
    }

    logger.error("RESUME", "Error updating resume", {
      message: error.message,
      userId: req.user?.userId,
      resumeId: req.params.id,
    });

    return res.status(500).json({
      message: "Error al actualizar el CV",
    });
  }
}

async function duplicateResume(req, res) {
  try {
    const duplicatedResume = await duplicateUserResume(
      req.params.id,
      req.user.userId
    );

    return res.status(201).json(duplicatedResume);
  } catch (error) {
    if (error.message === "RESUME_NOT_FOUND") {
      return res.status(404).json({
        message: "CV no encontrado",
      });
    }

    logger.error("RESUME", "Error duplicating resume", {
      message: error.message,
      userId: req.user?.userId,
      resumeId: req.params.id,
    });

    return res.status(500).json({
      message: "Error al duplicar el CV",
    });
  }
}

async function deleteResume(req, res) {
  try {
    await deleteUserResume(req.params.id, req.user.userId);

    return res.json({
      message: "CV eliminado correctamente",
    });
  } catch (error) {
    if (error.message === "RESUME_NOT_FOUND") {
      return res.status(404).json({
        message: "CV no encontrado",
      });
    }

    logger.error("RESUME", "Error deleting resume", {
      message: error.message,
      userId: req.user?.userId,
      resumeId: req.params.id,
    });

    return res.status(500).json({
      message: "Error al eliminar el CV",
    });
  }
}

module.exports = {
  generateResume,
  getResumes,
  downloadResume,
  getResumeById,
  updateResume,
  duplicateResume,
  deleteResume,
};