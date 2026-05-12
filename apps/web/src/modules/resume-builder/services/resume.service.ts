import { apiBlobRequest, apiRequest } from "../../../shared/services/apiClient";
import type { Resume, ResumeData } from "../types/resume.types";

export async function fetchUserResumes() {
  return apiRequest<Resume[]>("/resume");
}

export async function fetchResumeById(resumeId: string) {
  return apiRequest<Resume>(`/resume/${resumeId}`);
}

export async function generateResumePdf(resumeData: ResumeData) {
  return apiBlobRequest("/resume/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resumeData),
  });
}

export async function downloadResumeById(resumeId: string) {
  return apiBlobRequest(`/resume/${resumeId}/download`);
}

export async function deleteResumeById(resumeId: string) {
  return apiRequest<{ message: string }>(`/resume/${resumeId}`, {
    method: "DELETE",
  });
}

export async function updateResumeById(
  resumeId: string,
  resumeData: ResumeData
) {
  return apiRequest<Resume>(`/resume/${resumeId}`, {
    method: "PUT",
    body: JSON.stringify(resumeData),
  });
}

export async function duplicateResumeById(resumeId: string) {
  return apiRequest<Resume>(`/resume/${resumeId}/duplicate`, {
    method: "POST",
  });
}