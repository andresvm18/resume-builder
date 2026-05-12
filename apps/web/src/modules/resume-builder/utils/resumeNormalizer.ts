import {
  DEFAULT_RESUME_DATA,
  type Education,
  type Experience,
  type Language,
  type Project,
  type ResumeData,
  type SoftSkill,
  type TechnicalSkillGroup,
} from "../types/resume.types";

function sanitizeText(value: unknown): string {
  return String(value ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => sanitizeText(item))
    .filter(Boolean);
}

function normalizeExperiences(value: unknown): Experience[] {
  if (!Array.isArray(value)) return DEFAULT_RESUME_DATA.experiences;

  return value.map((item) => ({
    id: item?.id ?? crypto.randomUUID(),
    title: sanitizeText(item?.title),
    location: sanitizeText(item?.location),
    startDate: sanitizeText(item?.startDate),
    endDate: sanitizeText(item?.endDate),
    description: sanitizeText(item?.description),
  }));
}

function normalizeEducation(value: unknown): Education[] {
  if (!Array.isArray(value)) return DEFAULT_RESUME_DATA.education;

  return value.map((item) => ({
    id: item?.id ?? crypto.randomUUID(),
    institution: sanitizeText(item?.institution),
    degree: sanitizeText(item?.degree),
    date: sanitizeText(item?.date),
  }));
}

function normalizeLanguages(value: unknown): Language[] {
  if (!Array.isArray(value)) return DEFAULT_RESUME_DATA.languages;

  return value.map((item) => ({
    id: item?.id ?? crypto.randomUUID(),
    name: sanitizeText(item?.name),
    level: item?.level || "Advanced",
  }));
}

function normalizeProjects(value: unknown): Project[] {
  if (!Array.isArray(value)) return DEFAULT_RESUME_DATA.projects;

  return value.map((item) => ({
    id: item?.id ?? crypto.randomUUID(),
    name: sanitizeText(item?.name),
    technologies: sanitizeText(item?.technologies),
    description: sanitizeText(item?.description),
    link: sanitizeText(item?.link),
  }));
}

function normalizeTechnicalSkills(value: unknown): TechnicalSkillGroup[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((group) => ({
      category: sanitizeText(group?.category),
      items: normalizeStringArray(group?.items),
    }))
    .filter((group) => group.category || group.items.length > 0);
}

function normalizeSoftSkills(value: unknown): SoftSkill[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((skill) => ({
      name: sanitizeText(skill?.name),
      description: sanitizeText(skill?.description),
    }))
    .filter((skill) => skill.name || skill.description);
}

export function normalizeResumeData(value: unknown): ResumeData {
  const data = typeof value === "object" && value !== null
    ? (value as Partial<ResumeData>)
    : {};

  return {
    ...DEFAULT_RESUME_DATA,

    fullName: sanitizeText(data.fullName),
    email: sanitizeText(data.email),
    phone: sanitizeText(data.phone),
    location: sanitizeText(data.location),
    summary: sanitizeText(data.summary),

    targetRole: sanitizeText(data.targetRole),
    targetCompany: sanitizeText(data.targetCompany),

    skills: normalizeStringArray(data.skills),
    technicalSkills: normalizeTechnicalSkills(data.technicalSkills),
    softSkills: normalizeSoftSkills(data.softSkills),

    languages: normalizeLanguages(data.languages),
    experiences: normalizeExperiences(data.experiences),
    education: normalizeEducation(data.education),
    projects: normalizeProjects(data.projects),

    jobDescription: sanitizeText(data.jobDescription),

    template:
      data.template === "modern" || data.template === "compact"
        ? data.template
        : "classic",
  };
}