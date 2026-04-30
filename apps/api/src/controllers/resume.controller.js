const express = require("express");
const { generateResumePdf, getUserResumes } = require("../services/resume.service");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const pdfBuffer = await generateResumePdf(req.body, req.user.userId);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.end(pdfBuffer);
  } catch (error) {
    console.error("Error generating resume:", error);
    return res.status(500).json({
      message: "Error al generar el CV",
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const resumes = await getUserResumes(req.user.userId);
    return res.json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return res.status(500).json({
      message: "Error al obtener los CVs",
    });
  }
});

module.exports = router;