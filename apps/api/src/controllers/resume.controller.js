const {
  generateResumePdf,
  getUserResumes,
  generateResumePdfById,
  getUserResumeById,
  deleteUserResume,
} = require("../services/resume.service");

async function generateResume(req, res) {
  try {
    const { fullName, email, summary } = req.body;

    if (!fullName || !email || !summary) {
      return res.status(400).json({
        message: "Nombre, correo y resumen son requeridos",
      });
    }

    const pdfBuffer = await generateResumePdf(
      req.body,
      req.user.userId
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");

    return res.end(pdfBuffer);
  } catch (error) {
    console.error("Error generating resume:", error);
    return res.status(500).json({
      message: "Error al generar el CV",
    });
  }
}

async function getResumes(req, res) {
  try {
    const resumes = await getUserResumes(req.user.userId);
    return res.json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
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

    console.error("Error downloading resume:", error);

    return res.status(500).json({
      message: "Error al descargar el CV",
    });
  }
}

async function getResumeById(req, res) {
  try {
    const resume = await getUserResumeById(req.params.id, req.user.userId);

    return res.json(resume);
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("Error fetching resume:", error);
    }

    return res.status(404).json({
      message: "CV no encontrado",
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

    console.error("Error deleting resume:", error);

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
  deleteResume,
};