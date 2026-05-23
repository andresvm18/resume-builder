const sanitizeHtml = require("sanitize-html");

function sanitizeText(value = "") {
  const normalizedLineBreaks = String(value ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const withoutHtml = sanitizeHtml(normalizedLineBreaks, {
    allowedTags: [],
    allowedAttributes: {},
  });

  return withoutHtml.trim();
}

function normalizeArray(arr, fallback = []) {
  return Array.isArray(arr) ? arr : fallback;
}

function normalizeTemplate(template = "classic") {
  return ["classic", "modern", "compact"].includes(template)
    ? template
    : "classic";
}

function normalizeLanguage(language = "es") {
  return ["es", "en"].includes(language)
    ? language
    : "es";
}

function normalizeResumeData(data = {}) {
  return {
    ...data,

    fullName: sanitizeText(data.fullName),
    email: sanitizeText(data.email),
    phone: sanitizeText(data.phone),
    location: sanitizeText(data.location),
    summary: sanitizeText(data.summary),

    targetRole: sanitizeText(data.targetRole),
    targetCompany: sanitizeText(data.targetCompany),

    skills: normalizeArray(data.skills).map(sanitizeText),

    technicalSkills: normalizeArray(data.technicalSkills).map((group) => ({
      category: sanitizeText(group?.category),
      items: normalizeArray(group?.items).map(sanitizeText).filter(Boolean),
    })),

    softSkills: normalizeArray(data.softSkills).map((skill) => ({
      name: sanitizeText(skill?.name),
      description: sanitizeText(skill?.description),
    })),

    languages: normalizeArray(data.languages).map((lang) => ({
      ...lang,
      name: sanitizeText(lang?.name),
      level: sanitizeText(lang?.level) || "Advanced",
    })),

    experiences: normalizeArray(data.experiences).map((exp) => ({
      ...exp,
      title: sanitizeText(exp?.title),
      location: sanitizeText(exp?.location),
      startDate: sanitizeText(exp?.startDate),
      endDate: sanitizeText(exp?.endDate),
      description: sanitizeText(exp?.description),
    })),

    education: normalizeArray(data.education).map((edu) => ({
      ...edu,
      institution: sanitizeText(edu?.institution),
      degree: sanitizeText(edu?.degree),
      date: sanitizeText(edu?.date),
    })),

    projects: normalizeArray(data.projects).map((proj) => ({
      ...proj,
      name: sanitizeText(proj?.name),
      technologies: sanitizeText(proj?.technologies),
      description: sanitizeText(proj?.description),
      link: sanitizeText(proj?.link),
    })),

    jobDescription: sanitizeText(data.jobDescription),

    template: normalizeTemplate(data.template),
    language: normalizeLanguage(data.language),
  };
}

module.exports = {
  normalizeResumeData,
};