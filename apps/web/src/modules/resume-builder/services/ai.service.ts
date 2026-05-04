import type { ResumeData } from "../types/resume.types";

const API_URL = "http://localhost:8080/api/ai";

type OptimizeSummaryResponse = {
  optimizedSummary: string;
  source: "mock" | "gemini";
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
  source: "gemini";
};

export type FinalAtsAnalysisResponse = {
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  source: string;
};


export async function optimizeSummary(
  resumeData: ResumeData,
  jobDescription: string
): Promise<OptimizeSummaryResponse> {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${API_URL}/optimize-summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      resumeData,
      jobDescription,
    }),
  });

  if (!response.ok) {
    throw new Error("Error optimizing summary");
  }

  return response.json();
}

export async function getAiRecommendations(
  resumeData: ResumeData,
  jobDescription: string
): Promise<AiRecommendationsResponse> {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${API_URL}/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      resumeData,
      jobDescription,
    }),
  });

  if (!response.ok) {
    throw new Error("Error generating AI recommendations");
  }

  return response.json();
}

type OptimizeResumeResponse = {
  optimizedResumeData: ResumeData;
  source: "gemini";
};

export async function optimizeFullResume(
  resumeData: ResumeData,
  jobDescription: string
): Promise<OptimizeResumeResponse> {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${API_URL}/optimize-resume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      resumeData,
      jobDescription,
    }),
  });

  if (!response.ok) {
    throw new Error("Error optimizing full resume");
  }

  return response.json();
}

export async function analyzeFinalAts(
  resumeData: ResumeData,
  jobDescription: string
): Promise<FinalAtsAnalysisResponse> {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${API_URL}/final-ats-analysis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      resumeData,
      jobDescription,
    }),
  });

  if (!response.ok) {
    throw new Error("Error analyzing final ATS");
  }

  return response.json();
}