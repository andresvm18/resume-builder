const {
  optimizeSummary,
  generateAiRecommendations,
  optimizeFullResume,
  analyzeFinalAts,
} = require("../services/ai.service");

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
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
      return res.status(400).json({
        message: "resumeData y jobDescription son requeridos",
      });
    }

    const result = await generateAiRecommendations({
      resumeData,
      jobDescription,
    });

    return res.json(result);
  } catch (error) {
    console.error("Error generating AI recommendations:", error);

    return res.status(500).json({
      message: "Error al generar recomendaciones con IA",
    });
  }
}

async function optimizeResume(req, res) {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        message: "resumeData es requerido",
      });
    }

    const result = await optimizeFullResume({
      resumeData,
      jobDescription,
    });

    return res.json(result);
  } catch (error) {
    console.error("Error optimizing resume:", error);

    return res.status(500).json({
      message: "Error al optimizar el CV con IA",
    });
  }
}

async function analyzeFinalResumeAts(req, res) {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
      return res.status(400).json({
        message: "resumeData y jobDescription son requeridos",
      });
    }

    const result = await analyzeFinalAts({
      resumeData,
      jobDescription,
    });

    return res.json(result);
  } catch (error) {
    console.error("Error analyzing final ATS:", error);

    return res.status(500).json({
      message: "Error al analizar el CV final con ATS",
    });
  }
}

module.exports = {
  optimizeResumeSummary,
  getAiRecommendations,
  optimizeResume,
  analyzeFinalResumeAts,
};