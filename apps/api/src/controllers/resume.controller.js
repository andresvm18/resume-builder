const express = require("express");
const { generateResumePdf } = require("../services/resume.service");

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

module.exports = router;