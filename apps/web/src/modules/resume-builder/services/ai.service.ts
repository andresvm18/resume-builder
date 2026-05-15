import { apiRequest } from "../../../shared/services/apiClient";
import type { ResumeData } from "../types/resume.types";
import { API_ROUTES } from "../../../shared/constants/apiRoutes";

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
  return apiRequest<OptimizeSummaryResponse>(API_ROUTES.AI.OPTIMIZE_SUMMARY, {
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
  return apiRequest<AiRecommendationsResponse>(API_ROUTES.AI.RECOMMENDATIONS, {
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
  return apiRequest<OptimizeResumeResponse>(API_ROUTES.AI.OPTIMIZE_RESUME, {
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
  return apiRequest<FinalAtsAnalysisResponse>(API_ROUTES.AI.FINAL_ATS_ANALYSIS, {
    method: "POST",
    body: JSON.stringify({
      resumeData,
      jobDescription,
    }),
  });
}