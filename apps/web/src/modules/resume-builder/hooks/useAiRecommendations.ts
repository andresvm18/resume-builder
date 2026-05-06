import { useState } from "react";
import {
  getAiRecommendations,
  type AiRecommendationsResponse,
} from "../services/ai.service";
import type { ResumeData } from "../types/resume.types";

export function useAiRecommendations() {
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] =
    useState(false);
  const [recommendationsFailed, setRecommendationsFailed] = useState(false);
  const [aiRecommendations, setAiRecommendations] =
    useState<AiRecommendationsResponse | null>(null);

  const generateRecommendations = async (
    resumeData: ResumeData,
    jobDescription: string
  ) => {
    if (!jobDescription.trim()) {
      return null;
    }

    try {
      setIsGeneratingRecommendations(true);
      setRecommendationsFailed(false);
      setAiRecommendations(null);

      const result = await getAiRecommendations(resumeData, jobDescription);

      setAiRecommendations(result);

      return result;
    } catch {
      setRecommendationsFailed(true);
      return null;
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  return {
    aiRecommendations,
    isGeneratingRecommendations,
    recommendationsFailed,
    generateRecommendations,
  };
}