import type { ResumeData } from "../../resume-builder/types/resume.types";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";

type CompletenessCheck = {
  label: string;
  condition: boolean;
};

export type ProfileCompletenessResult = {
  percentage: number;
  isReadyForAi: boolean;
  completedRequired: string[];
  missingRequired: string[];
  completedOptional: string[];
  missingOptional: string[];
};

export function calculateProfileCompleteness(
  profile: ResumeData
): ProfileCompletenessResult {
  const requiredChecks: CompletenessCheck[] = [
    {
      label: APP_MESSAGES.PROFILE.FIELD_PERSONAL_INFO,
      condition: Boolean(profile.fullName?.trim() && profile.email?.trim()),
    },
    {
      label: APP_MESSAGES.PROFILE.FIELD_EDUCATION,
      condition: profile.education.length > 0,
    },
    {
      label: APP_MESSAGES.PROFILE.FIELD_SKILLS,
      condition: profile.skills.length > 0,
    },
  ];

  const optionalChecks: CompletenessCheck[] = [
    {
      label: APP_MESSAGES.PROFILE.FIELD_SUMMARY,
      condition: Boolean(profile.summary?.trim()),
    },
    {
      label: APP_MESSAGES.PROFILE.FIELD_EXPERIENCE,
      condition: profile.experiences.length > 0,
    },
    {
      label: APP_MESSAGES.PROFILE.FIELD_LANGUAGES,
      condition: profile.languages.length > 0,
    },
    {
      label: APP_MESSAGES.PROFILE.FIELD_PROJECTS,
      condition: profile.projects.length > 0,
    },
  ];

  const completedRequired = requiredChecks
    .filter((item) => item.condition)
    .map((item) => item.label);

  const missingRequired = requiredChecks
    .filter((item) => !item.condition)
    .map((item) => item.label);

  const completedOptional = optionalChecks
    .filter((item) => item.condition)
    .map((item) => item.label);

  const missingOptional = optionalChecks
    .filter((item) => !item.condition)
    .map((item) => item.label);

  const requiredScore =
    (completedRequired.length / requiredChecks.length) * 70;

  const optionalScore =
    (completedOptional.length / optionalChecks.length) * 30;

  return {
    percentage: Math.round(requiredScore + optionalScore),
    isReadyForAi: missingRequired.length === 0,
    completedRequired,
    missingRequired,
    completedOptional,
    missingOptional,
  };
}