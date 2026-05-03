import type { ResumeData } from "../types/resume.types";
import type { AtsMatchResult } from "../utils/ats.utils";

const API_URL = "http://localhost:8080/api/ai";

type OptimizeSummaryResponse = {
  optimizedSummary: string;
  source: "mock" | "ai";
  jobContextUsed: boolean;
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

type AiRecommendationsResponse = {
  recommendations: string[];
  source: "gemini";
};

export async function getAiRecommendations(
  resumeData: ResumeData,
  jobDescription: string,
  atsResult: AtsMatchResult
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
      atsResult,
    }),
  });

  if (!response.ok) {
    throw new Error("Error generating AI recommendations");
  }

  return response.json();
}