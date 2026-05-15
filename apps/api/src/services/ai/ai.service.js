const logger = require("../../utils/logger");

const { generateWithFallback } = require("./ai.providers");
const { parseAiJson } = require("./ai.parsers");
const {
  normalizeTechnicalSkills,
  normalizeSoftSkills,
  fallbackOptimizedResume,
} = require("./ai.normalizers");

const { buildSummaryPrompt } = require("./prompts/summary.prompt");
const {
  buildRecommendationsPrompt,
} = require("./prompts/recommendations.prompt");
const {
  buildFullResumeOptimizationPrompt,
} = require("./prompts/optimize-resume.prompt");
const {
  buildFinalAtsAnalysisPrompt,
} = require("./prompts/final-ats.prompt");

async function optimizeSummary({ resumeData, jobDescription }) {
  const result = await generateWithFallback(
    buildSummaryPrompt({
      resumeData,
      jobDescription,
    })
  );

  return {
    optimizedSummary: result.text.trim(),
    source: result.provider,
    jobContextUsed: Boolean(jobDescription?.trim()),
  };
}

async function generateAiRecommendations({ resumeData, jobDescription }) {
  const result = await generateWithFallback(
    buildRecommendationsPrompt({
      resumeData,
      jobDescription,
    })
  );

  const parsed = parseAiJson(result.text);

  return {
    keywords: {
      technical: parsed.keywords?.technical || [],
      softSkills: parsed.keywords?.softSkills || [],
      certifications: parsed.keywords?.certifications || [],
      responsibilities: parsed.keywords?.responsibilities || [],
    },
    matchedKeywords: parsed.matchedKeywords || [],
    missingKeywords: parsed.missingKeywords || [],
    recommendations: parsed.recommendations || [],
    source: result.provider,
  };
}

async function optimizeFullResume({ resumeData, jobDescription }) {
  try {
    const result = await generateWithFallback(
      buildFullResumeOptimizationPrompt({
        resumeData,
        jobDescription,
      })
    );

    const parsed = parseAiJson(result.text);
    const optimized = parsed.optimizedResumeData || {};

    return {
      optimizedResumeData: {
        ...resumeData,
        ...optimized,

        fullName: resumeData.fullName,
        email: resumeData.email,
        phone: resumeData.phone,
        location: resumeData.location,

        skills: Array.isArray(optimized.skills)
          ? optimized.skills
          : resumeData.skills || [],

        technicalSkills: normalizeTechnicalSkills(optimized.technicalSkills),
        softSkills: normalizeSoftSkills(optimized.softSkills),

        jobDescription,
      },
      source: result.provider,
    };
  } catch (error) {
    logger.error("AI", "optimizeFullResume fallback triggered", {
      message: error.message,
    });

    return {
      optimizedResumeData: fallbackOptimizedResume(resumeData, jobDescription),
      source: "fallback",
    };
  }
}

async function analyzeFinalAts({ resumeData, jobDescription }) {
  const result = await generateWithFallback(
    buildFinalAtsAnalysisPrompt({
      resumeData,
      jobDescription,
    })
  );

  const parsed = parseAiJson(result.text);

  return {
    atsScore: Number(parsed.atsScore) || 0,
    summary: parsed.summary || "",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    matchedKeywords: Array.isArray(parsed.matchedKeywords)
      ? parsed.matchedKeywords
      : [],
    missingKeywords: Array.isArray(parsed.missingKeywords)
      ? parsed.missingKeywords
      : [],
    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations
      : [],
    source: result.provider,
  };
}

module.exports = {
  optimizeSummary,
  generateAiRecommendations,
  optimizeFullResume,
  analyzeFinalAts,
};