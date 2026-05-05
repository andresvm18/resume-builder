function sanitizeText(value = "") {
  return String(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function normalizeArray(arr, fallback = []) {
  return Array.isArray(arr) ? arr : fallback;
}

function normalizeResumeData(data = {}) {
  return {
    ...data,

    fullName: sanitizeText(data.fullName),
    email: sanitizeText(data.email),
    phone: sanitizeText(data.phone),
    location: sanitizeText(data.location),
    summary: sanitizeText(data.summary),

    skills: normalizeArray(data.skills).map(sanitizeText),

    languages: normalizeArray(data.languages).map((lang) => ({
      ...lang,
      name: sanitizeText(lang?.name),
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
  };
}

module.exports = {
  normalizeResumeData,
};