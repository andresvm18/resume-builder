import { apiRequest } from "../../../shared/services/apiClient";
import type { ResumeData } from "../types/resume.types";

export type AiProvider = "openrouter" | "gemini" | "openai" | "fallback" | "mock";

type OptimizeSummaryResponse = {
  optimizedSummary: string;
  source: AiProvider;
  jobContextUsed: boolean;
};

export type AiKeywordCategories = {
  technical: string[];
  softSkills: string[];
  certifications: string[];
  responsibilities: string[];
};

export type AiRecommendationsResponse = {
  keywords: AiKeywordCategories;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  source: AiProvider;
};

export type FinalAtsAnalysisResponse = {
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  source: AiProvider;
};

type OptimizeResumeResponse = {
  optimizedResumeData: ResumeData;
  source: AiProvider;
};

export async function optimizeSummary(
  resumeData: ResumeData,
  jobDescription: string
): Promise<OptimizeSummaryResponse> {
  return apiRequest<OptimizeSummaryResponse>("/ai/optimize-summary", {
    method: "POST",
    body: JSON.stringify({
      resumeData,
      jobDescription,
    }),
  });
}

export async function getAiRecommendations(
  resumeData: ResumeData,
  jobDescription: string
): Promise<AiRecommendationsResponse> {
  return apiRequest<AiRecommendationsResponse>("/ai/recommendations", {
    method: "POST",
    body: JSON.stringify({
      resumeData,
      jobDescription,
    }),
  });
}

export async function optimizeFullResume(
  resumeData: ResumeData,
  jobDescription: string
): Promise<OptimizeResumeResponse> {
  return apiRequest<OptimizeResumeResponse>("/ai/optimize-resume", {
    method: "POST",
    body: JSON.stringify({
      resumeData,
      jobDescription,
    }),
  });
}

export async function analyzeFinalAts(
  resumeData: ResumeData,
  jobDescription: string
): Promise<FinalAtsAnalysisResponse> {
  return apiRequest<FinalAtsAnalysisResponse>("/ai/final-ats-analysis", {
    method: "POST",
    body: JSON.stringify({
      resumeData,
      jobDescription,
    }),
  });
}