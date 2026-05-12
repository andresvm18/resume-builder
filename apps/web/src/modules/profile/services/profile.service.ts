import { apiRequest } from "../../../shared/services/apiClient";
import type { ResumeData } from "../../resume-builder/types/resume.types";

export type ProfileResponse = {
  id?: string;
  profileData: ResumeData;
  createdAt?: string;
  updatedAt?: string;
};

export async function getProfile() {
  return apiRequest<ProfileResponse>("/profile");
}

export async function updateProfile(profileData: ResumeData) {
  return apiRequest<ProfileResponse>("/profile", {
    method: "PUT",
    body: JSON.stringify({
      profileData,
    }),
  });
}