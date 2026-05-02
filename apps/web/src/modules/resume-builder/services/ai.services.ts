import type { ResumeData } from "../types/resume.types";

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