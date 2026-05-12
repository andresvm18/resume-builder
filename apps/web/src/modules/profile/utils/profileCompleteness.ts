import type { ResumeData } from "../../resume-builder/types/resume.types";

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
      label: "Información personal",
      condition: Boolean(profile.fullName?.trim() && profile.email?.trim()),
    },
    {
      label: "Educación",
      condition: profile.education.length > 0,
    },
    {
      label: "Habilidades",
      condition: profile.skills.length > 0,
    },
  ];

  const optionalChecks: CompletenessCheck[] = [
    {
      label: "Resumen profesional",
      condition: Boolean(profile.summary?.trim()),
    },
    {
      label: "Experiencia",
      condition: profile.experiences.length > 0,
    },
    {
      label: "Idiomas",
      condition: profile.languages.length > 0,
    },
    {
      label: "Proyectos",
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