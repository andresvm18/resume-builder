const { optimizeSummary } = require("../services/ai.service");

async function optimizeResumeSummary(req, res) {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        message: "resumeData es requerido",
      });
    }

    const result = optimizeSummary({
      resumeData,
      jobDescription,
    });

    return res.json(result);
  } catch (error) {
    console.error("Error optimizing summary:", error);

    return res.status(500).json({
      message: "Error al optimizar el resumen",
    });
  }
}

module.exports = {
  optimizeResumeSummary,
};