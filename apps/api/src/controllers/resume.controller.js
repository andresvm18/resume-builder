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
const asyncHandler = require("../utils/asyncHandler");
const createHttpError = require("../utils/httpError");

const PDF_ERROR_MESSAGES = {
  PDF_GENERATION_FAILED:
    "No se pudo compilar el PDF. Revisa que los datos del CV no contengan contenido inválido.",
  PDF_EMPTY_OR_INVALID: "El PDF generado está vacío o es inválido.",
};

const DOWNLOAD_PDF_ERROR_MESSAGES = {
  PDF_GENERATION_FAILED: "No se pudo compilar el PDF para este CV.",
  PDF_EMPTY_OR_INVALID: "El PDF generado está vacío o es inválido.",
};

function getPdfErrorMessage(error, fallbackMessage) {
  return PDF_ERROR_MESSAGES[error.message] || fallbackMessage;
}

function getDownloadPdfErrorMessage(error, fallbackMessage) {
  return DOWNLOAD_PDF_ERROR_MESSAGES[error.message] || fallbackMessage;
}

const generateResume = asyncHandler(async (req, res) => {
  const { fullName, email, summary } = req.body;

  if (!fullName || !email || !summary) {
    throw createHttpError(400, "Nombre, correo y resumen son requeridos");
  }

  const cleanData = normalizeResumeData(req.body);

  try {
    const pdfBuffer = await generateResumePdf(cleanData, req.user.userId);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");

    return res.end(pdfBuffer);
  } catch (error) {
    throw createHttpError(
      500,
      getPdfErrorMessage(error, "Error al generar el CV")
    );
  }
});

const getResumes = asyncHandler(async (req, res) => {
  const resumes = await getUserResumes(req.user.userId);
  return res.json(resumes);
});

const downloadResume = asyncHandler(async (req, res) => {
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
      throw createHttpError(404, "CV no encontrado");
    }

    throw createHttpError(
      500,
      getDownloadPdfErrorMessage(error, "Error al descargar el CV")
    );
  }
});

const getResumeById = asyncHandler(async (req, res) => {
  try {
    const resume = await getUserResumeById(req.params.id, req.user.userId);
    return res.json(resume);
  } catch (error) {
    if (error.message === "RESUME_NOT_FOUND") {
      throw createHttpError(404, "CV no encontrado");
    }

    throw error;
  }
});

const updateResume = asyncHandler(async (req, res) => {
  const cleanData = normalizeResumeData(req.body);

  try {
    const updatedResume = await updateUserResume(
      req.params.id,
      req.user.userId,
      cleanData
    );

    return res.json(updatedResume);
  } catch (error) {
    if (error.message === "RESUME_NOT_FOUND") {
      throw createHttpError(404, "CV no encontrado");
    }

    throw createHttpError(500, "Error al actualizar el CV");
  }
});

const duplicateResume = asyncHandler(async (req, res) => {
  try {
    const duplicatedResume = await duplicateUserResume(
      req.params.id,
      req.user.userId
    );

    return res.status(201).json(duplicatedResume);
  } catch (error) {
    if (error.message === "RESUME_NOT_FOUND") {
      throw createHttpError(404, "CV no encontrado");
    }

    throw createHttpError(500, "Error al duplicar el CV");
  }
});

const deleteResume = asyncHandler(async (req, res) => {
  try {
    await deleteUserResume(req.params.id, req.user.userId);

    return res.json({
      message: "CV eliminado correctamente",
    });
  } catch (error) {
    if (error.message === "RESUME_NOT_FOUND") {
      throw createHttpError(404, "CV no encontrado");
    }

    throw createHttpError(500, "Error al eliminar el CV");
  }
});

module.exports = {
  generateResume,
  getResumes,
  downloadResume,
  getResumeById,
  updateResume,
  duplicateResume,
  deleteResume,
};