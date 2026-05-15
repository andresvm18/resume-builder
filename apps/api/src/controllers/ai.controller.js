const {
  optimizeSummary,
  generateAiRecommendations,
  optimizeFullResume,
  analyzeFinalAts,
} = require("../services/ai.service");

const asyncHandler = require("../utils/asyncHandler");
const createHttpError = require("../utils/httpError");

const optimizeResumeSummary = asyncHandler(async (req, res) => {
  const { resumeData, jobDescription } = req.body;

  if (!resumeData) {
    throw createHttpError(400, "resumeData es requerido");
  }

  const result = await optimizeSummary({
    resumeData,
    jobDescription,
  });

  return res.json(result);
});

const getAiRecommendations = asyncHandler(async (req, res) => {
  const { resumeData, jobDescription } = req.body;

  if (!resumeData || !jobDescription) {
    throw createHttpError(
      400,
      "resumeData y jobDescription son requeridos"
    );
  }

  const result = await generateAiRecommendations({
    resumeData,
    jobDescription,
  });

  return res.json(result);
});

const optimizeResume = asyncHandler(async (req, res) => {
  const { resumeData, jobDescription } = req.body;

  if (!resumeData) {
    throw createHttpError(400, "resumeData es requerido");
  }

  const result = await optimizeFullResume({
    resumeData,
    jobDescription,
  });

  return res.json(result);
});

const analyzeFinalResumeAts = asyncHandler(async (req, res) => {
  const { resumeData, jobDescription } = req.body;

  if (!resumeData || !jobDescription) {
    throw createHttpError(
      400,
      "resumeData y jobDescription son requeridos"
    );
  }

  const result = await analyzeFinalAts({
    resumeData,
    jobDescription,
  });

  return res.json(result);
});

module.exports = {
  optimizeResumeSummary,
  getAiRecommendations,
  optimizeResume,
  analyzeFinalResumeAts,
};