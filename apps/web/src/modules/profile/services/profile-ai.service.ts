import { apiRequest } from "../../../shared/services/apiClient";
import type { ResumeData } from "../../resume-builder/types/resume.types";

type GenerateProfileResumeResponse = {
  resumeData: ResumeData;
};

export async function generateResumeFromProfile(
  jobDescription: string,
  template: string
) {
  return apiRequest<GenerateProfileResumeResponse>(
    "/profile/generate-resume",
    {
      method: "POST",
      body: JSON.stringify({
        jobDescription,
        template,
      }),
    }
  );
}