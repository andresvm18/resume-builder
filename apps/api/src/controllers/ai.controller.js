const {
  optimizeSummary,
  generateAiRecommendations,
  optimizeFullResume,
  analyzeFinalAts,
} = require("../services/ai.service");

const asyncHandler = require("../utils/asyncHandler");
const createHttpError = require("../utils/httpError");

function normalizeLanguage(language = "es") {
  return ["es", "en"].includes(language) ? language : "es";
}

function resolveLanguage(req) {
  return normalizeLanguage(req.body.language || req.body.resumeData?.language);
}

const optimizeResumeSummary = asyncHandler(async (req, res) => {
  const { resumeData, jobDescription } = req.body;

  if (!resumeData) {
    throw createHttpError(400, "resumeData es requerido");
  }

  const result = await optimizeSummary({
    resumeData,
    jobDescription,
    language: resolveLanguage(req),
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
    language: resolveLanguage(req),
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
    language: resolveLanguage(req),
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
    language: resolveLanguage(req),
  });

  return res.json(result);
});

module.exports = {
  optimizeResumeSummary,
  getAiRecommendations,
  optimizeResume,
  analyzeFinalResumeAts,
};