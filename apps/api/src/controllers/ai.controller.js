const { optimizeSummary, generateAiRecommendations } = require("../services/ai.service");

async function optimizeResumeSummary(req, res) {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        message: "resumeData es requerido",
      });
    }

    const result = await optimizeSummary({
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

async function getAiRecommendations(req, res) {
  try {
    const { resumeData, jobDescription, atsResult } = req.body;

    if (!resumeData || !jobDescription) {
      return res.status(400).json({
        message: "resumeData y jobDescription son requeridos",
      });
    }

    const result = await generateAiRecommendations({
      resumeData,
      jobDescription,
      atsResult,
    });

    return res.json(result);
  } catch (error) {
    console.error("Error generating AI recommendations:", error);

    return res.status(500).json({
      message: "Error al generar recomendaciones con IA",
    });
  }
}

module.exports = {
  optimizeResumeSummary,
  getAiRecommendations,
};