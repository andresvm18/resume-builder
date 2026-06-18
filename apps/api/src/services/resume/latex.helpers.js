const {
  SOFT_SKILLS,
  ALLOWED_TEMPLATES,
} = require("./latex.constants");

const { getPdfTranslations } = require("./latex.i18n");

function sanitizeText(value = "") {
  return String(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function escapeLatex(value = "") {
  return String(value)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

function latexValue(value = "") {
  const clean = sanitizeText(value);

  if (!clean) return "\\mbox{}";

  return escapeLatex(clean);
}

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function capitalizeSkill(skill = "") {
  return String(skill)
    .trim()
    .split(" ")
    .map((word) => {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function formatEducationDate(
  date = "",
  translations = getPdfTranslations("es")
) {
  const year = Number(String(date).slice(0, 4));

  if (!year) return "";

  const currentYear = new Date().getFullYear();

  return year > currentYear
    ? `${year} (${translations.dates.estimated})`
    : String(year);
}

function formatExperienceDate(
  date = "",
  translations = getPdfTranslations("es")
) {
  if (!date) return "";

  const [year, month] = String(date).split("-");
  const monthIndex = Number(month) - 1;

  if (!year || monthIndex < 0 || monthIndex > 11) {
    return date;
  }

  return `${translations.dates.months[monthIndex]} ${year}`;
}

function formatExperienceRange(
  startDate = "",
  endDate = "",
  translations = getPdfTranslations("es")
) {
  const start = formatExperienceDate(startDate, translations);
  const normalizedEndDate = normalizeText(endDate);

  if (!start && !endDate) return "";

  if (
    !endDate ||
    normalizedEndDate === "present" ||
    normalizedEndDate === "presente" ||
    normalizedEndDate === "actual" ||
    normalizedEndDate === "actualidad" ||
    normalizedEndDate === "current"
  ) {
    return `${start} - ${translations.dates.present}`;
  }

  const end = formatExperienceDate(endDate, translations);

  return `${start} - ${end}`;
}

function formatLanguageLevel(
  level = "",
  translations = getPdfTranslations("es")
) {
  return translations.languageLevels[level] || level;
}

function isSoftSkill(skill = "") {
  const normalized = normalizeText(skill);

  return SOFT_SKILLS.some((softSkill) =>
    normalized.includes(normalizeText(softSkill))
  );
}

function getSoftSkillDescription(
  skill = "",
  translations = getPdfTranslations("es")
) {
  const normalized = normalizeText(skill);
  const descriptions = translations.skills.fallbackSoftDescriptions;

  if (
    normalized.includes("resolucion de problemas") ||
    normalized.includes("problem solving")
  ) {
    return descriptions.problemSolving;
  }

  if (
    normalized.includes("proactividad") ||
    normalized.includes("proactivity")
  ) {
    return descriptions.proactivity;
  }

  if (
    normalized.includes("trabajo en equipo") ||
    normalized.includes("teamwork")
  ) {
    return descriptions.teamwork;
  }

  if (
    normalized.includes("adaptabilidad") ||
    normalized.includes("adaptability")
  ) {
    return descriptions.adaptability;
  }

  if (
    normalized.includes("comunicacion") ||
    normalized.includes("communication")
  ) {
    return descriptions.communication;
  }

  if (
    normalized.includes("liderazgo") ||
    normalized.includes("leadership")
  ) {
    return descriptions.leadership;
  }

  if (
    normalized.includes("analitico") ||
    normalized.includes("analytical")
  ) {
    return descriptions.analytical;
  }

  if (
    normalized.includes("estrategico") ||
    normalized.includes("strategic")
  ) {
    return descriptions.strategic;
  }

  if (
    normalized.includes("organizacion") ||
    normalized.includes("organization")
  ) {
    return descriptions.organization;
  }

  if (
    normalized.includes("detalle") ||
    normalized.includes("detail")
  ) {
    return descriptions.detail;
  }

  if (
    normalized.includes("tiempo") ||
    normalized.includes("time management")
  ) {
    return descriptions.timeManagement;
  }

  if (
    normalized.includes("empatia") ||
    normalized.includes("empathy")
  ) {
    return descriptions.empathy;
  }

  if (
    normalized.includes("responsabilidad") ||
    normalized.includes("responsibility")
  ) {
    return descriptions.responsibility;
  }

  if (
    normalized.includes("servicio") ||
    normalized.includes("service")
  ) {
    return descriptions.service;
  }

  return descriptions.default;
}

function categorizeTechnicalSkill(
  skill = "",
  translations = getPdfTranslations("es")
) {
  const normalized = normalizeText(skill);
  const categories = translations.skills.fallbackTechnicalCategories;

  if (
    normalized.includes("javascript") ||
    normalized.includes("typescript") ||
    normalized.includes("react") ||
    normalized.includes("node") ||
    normalized.includes("sql") ||
    normalized.includes("python") ||
    normalized.includes("java") ||
    normalized.includes("api") ||
    normalized.includes("programacion") ||
    normalized.includes("programming") ||
    normalized.includes("desarrollo") ||
    normalized.includes("development")
  ) {
    return categories.software;
  }

  if (
    normalized.includes("power bi") ||
    normalized.includes("dashboard") ||
    normalized.includes("kpi") ||
    normalized.includes("analisis") ||
    normalized.includes("analysis") ||
    normalized.includes("datos") ||
    normalized.includes("data") ||
    normalized.includes("excel") ||
    normalized.includes("reportes") ||
    normalized.includes("reporting")
  ) {
    return categories.data;
  }

  if (
    normalized.includes("paciente") ||
    normalized.includes("patient") ||
    normalized.includes("clinico") ||
    normalized.includes("clinical") ||
    normalized.includes("medico") ||
    normalized.includes("medical") ||
    normalized.includes("veterin") ||
    normalized.includes("diagnostico") ||
    normalized.includes("diagnosis") ||
    normalized.includes("tratamiento") ||
    normalized.includes("treatment") ||
    normalized.includes("procedimiento") ||
    normalized.includes("procedure")
  ) {
    return categories.healthcare;
  }

  if (
    normalized.includes("obra") ||
    normalized.includes("construccion") ||
    normalized.includes("construction") ||
    normalized.includes("seguridad industrial") ||
    normalized.includes("industrial safety") ||
    normalized.includes("maquinaria") ||
    normalized.includes("machinery") ||
    normalized.includes("mantenimiento") ||
    normalized.includes("maintenance") ||
    normalized.includes("operacion") ||
    normalized.includes("operation")
  ) {
    return categories.construction;
  }

  if (
    normalized.includes("docencia") ||
    normalized.includes("teaching") ||
    normalized.includes("ensenanza") ||
    normalized.includes("capacitacion") ||
    normalized.includes("training") ||
    normalized.includes("educacion") ||
    normalized.includes("education") ||
    normalized.includes("aprendizaje") ||
    normalized.includes("learning")
  ) {
    return categories.education;
  }

  if (
    normalized.includes("cliente") ||
    normalized.includes("customer") ||
    normalized.includes("ventas") ||
    normalized.includes("sales") ||
    normalized.includes("servicio") ||
    normalized.includes("service") ||
    normalized.includes("call center") ||
    normalized.includes("soporte") ||
    normalized.includes("support")
  ) {
    return categories.customerService;
  }

  if (
    normalized.includes("inventario") ||
    normalized.includes("inventory") ||
    normalized.includes("logistica") ||
    normalized.includes("logistics") ||
    normalized.includes("bodega") ||
    normalized.includes("warehouse") ||
    normalized.includes("suministro") ||
    normalized.includes("supply") ||
    normalized.includes("distribucion") ||
    normalized.includes("distribution")
  ) {
    return categories.logistics;
  }

  if (
    normalized.includes("administracion") ||
    normalized.includes("administration") ||
    normalized.includes("gestion") ||
    normalized.includes("management") ||
    normalized.includes("documentacion") ||
    normalized.includes("documentation") ||
    normalized.includes("procesos") ||
    normalized.includes("process") ||
    normalized.includes("organizacion") ||
    normalized.includes("organization")
  ) {
    return categories.administration;
  }

  if (
    normalized.includes("marketing") ||
    normalized.includes("seo") ||
    normalized.includes("contenido") ||
    normalized.includes("content") ||
    normalized.includes("diseno") ||
    normalized.includes("design") ||
    normalized.includes("campana") ||
    normalized.includes("campaign")
  ) {
    return categories.marketing;
  }

  return categories.other;
}

function cleanBulletLine(line = "") {
  return String(line)
    .replace(/^[-•▪●*]\s*/g, "")
    .replace(/^\\item\s*/g, "")
    .trim();
}

function hasContent(value) {
  return String(value || "").trim().length > 0;
}

function hasItems(items) {
  return Array.isArray(items) && items.length > 0;
}

function hasExperienceContent(experiences = []) {
  return (
    hasItems(experiences) &&
    experiences.some(
      (exp) =>
        hasContent(exp.title) ||
        hasContent(exp.location) ||
        hasContent(exp.startDate) ||
        hasContent(exp.endDate) ||
        hasContent(exp.description)
    )
  );
}

function hasEducationContent(education = []) {
  return (
    hasItems(education) &&
    education.some(
      (edu) =>
        hasContent(edu.institution) ||
        hasContent(edu.degree) ||
        hasContent(edu.date)
    )
  );
}

function hasLanguageContent(languages = []) {
  return (
    hasItems(languages) &&
    languages.some((lang) => hasContent(lang.name) || hasContent(lang.level))
  );
}

function hasProjectContent(projects = []) {
  return (
    hasItems(projects) &&
    projects.some(
      (project) =>
        hasContent(project.name) ||
        hasContent(project.technologies) ||
        hasContent(project.description) ||
        hasContent(project.link)
    )
  );
}

function hasSkillsContent(data = {}) {
  const hasSimpleSkills = hasItems(data.skills);

  const hasTechnicalSkills =
    hasItems(data.technicalSkills) &&
    data.technicalSkills.some(
      (group) => hasContent(group.category) || hasItems(group.items)
    );

  const hasSoftSkills =
    hasItems(data.softSkills) &&
    data.softSkills.some(
      (skill) => hasContent(skill.name) || hasContent(skill.description)
    );

  return hasSimpleSkills || hasTechnicalSkills || hasSoftSkills;
}

function buildSection(title, content) {
  if (!hasContent(content)) return "";

  return `
\\resumesection{${title}}

${content}
`;
}

function buildSkills(data = {}, translations = getPdfTranslations("es")) {
  const skills = Array.isArray(data.skills) ? data.skills : [];

  const aiTechnicalSkills = Array.isArray(data.technicalSkills)
    ? data.technicalSkills
    : [];

  const aiSoftSkills = Array.isArray(data.softSkills)
    ? data.softSkills
    : [];

  const hasAiTechnicalSkills = aiTechnicalSkills.some(
    (group) =>
      group &&
      group.category &&
      Array.isArray(group.items) &&
      group.items.length > 0
  );

  const hasAiSoftSkills = aiSoftSkills.some(
    (skill) => skill && skill.name && skill.description
  );

  let technicalSection;
  let softSection;

  if (hasAiTechnicalSkills) {
    technicalSection = aiTechnicalSkills
      .filter(
        (group) =>
          group &&
          group.category &&
          Array.isArray(group.items) &&
          group.items.length > 0
      )
      .map((group) => {
        return `\\item \\textbf{${escapeLatex(group.category)}:} ${group.items
          .map((item) => escapeLatex(item))
          .join(", ")}`;
      })
      .join("\n");
  } else {
    const technicalSkills = skills.filter(
      (skill) => skill && !isSoftSkill(skill)
    );

    const groupedTechnicalSkills = technicalSkills.reduce((groups, skill) => {
      const category = categorizeTechnicalSkill(skill, translations);

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(skill);

      return groups;
    }, {});

    technicalSection = Object.entries(groupedTechnicalSkills)
      .map(([category, items]) => {
        return `\\item \\textbf{${escapeLatex(category)}:} ${items
          .map((item) => escapeLatex(item))
          .join(", ")}`;
      })
      .join("\n");
  }

  if (hasAiSoftSkills) {
    softSection = aiSoftSkills
      .filter((skill) => skill && skill.name && skill.description)
      .map((skill) => {
        return `\\item \\textbf{${escapeLatex(
          capitalizeSkill(skill.name)
        )}:} ${escapeLatex(skill.description)}`;
      })
      .join("\n");
  } else {
    const softSkills = skills.filter((skill) => skill && isSoftSkill(skill));

    softSection = softSkills
      .map((skill) => {
        return `\\item \\textbf{${escapeLatex(
          capitalizeSkill(skill)
        )}:} ${escapeLatex(getSoftSkillDescription(skill, translations))}`;
      })
      .join("\n");
  }

  return `
${
  technicalSection
    ? `\\textbf{${escapeLatex(translations.skills.technical)}}
\\begin{itemize}
${technicalSection}
\\end{itemize}`
    : ""
}

${
  softSection
    ? `\\textbf{${escapeLatex(translations.skills.soft)}}
\\begin{itemize}
${softSection}
\\end{itemize}`
    : ""
}
`;
}

function buildLanguages(
  languages = [],
  translations = getPdfTranslations("es")
) {
  if (!languages.length) return "";

  return languages
    .filter((lang) => lang.name)
    .map(
      (lang) =>
        `${escapeLatex(lang.name)} - ${escapeLatex(
          formatLanguageLevel(lang.level, translations)
        )}`
    )
    .join(" \\\\\n");
}

function buildEducation(
  education = [],
  translations = getPdfTranslations("es")
) {
  return education
    .filter((edu) => edu.institution || edu.degree)
    .map((edu) => {
      return `
\\textbf{${escapeLatex(edu.degree)}} \\\\
${escapeLatex(edu.institution)} \\hfill ${escapeLatex(
        formatEducationDate(edu.date, translations)
      )}
\\vspace{0.3em}
`;
    })
    .join("\n");
}

function buildExperience(
  experiences = [],
  translations = getPdfTranslations("es")
) {
  return experiences
    .filter((exp) => exp.title || exp.location || exp.description)
    .map((exp) => {
      const bullets = sanitizeText(exp.description)
        .split(/\n|(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑA-Z])/g)
        .map(cleanBulletLine)
        .filter(Boolean)
        .map((line) => `\\item ${escapeLatex(line)}`)
        .join("\n");

      return `
\\textbf{${escapeLatex(exp.title)}} \\\\
${escapeLatex(exp.location)} \\hfill ${escapeLatex(
        formatExperienceRange(exp.startDate, exp.endDate, translations)
      )}
\\begin{itemize}
${bullets}
\\end{itemize}
\\vspace{0.5em}
`;
    })
    .join("\n");
}

function buildProjects(projects = []) {
  return projects
    .filter((project) => project.name || project.description)
    .map((project) => {
      return `
\\textbf{${escapeLatex(project.name)}} \\\\
${escapeLatex(project.technologies)}
\\begin{itemize}
\\item ${escapeLatex(sanitizeText(project.description))}
\\end{itemize}
`;
    })
    .join("\n");
}

function resolveTemplateName(templateName) {
  if (!templateName || !ALLOWED_TEMPLATES.has(templateName)) {
    return "classic";
  }

  return templateName;
}

module.exports = {
  sanitizeText,
  escapeLatex,
  latexValue,
  normalizeText,
  capitalizeSkill,
  formatEducationDate,
  formatExperienceDate,
  formatExperienceRange,
  formatLanguageLevel,
  isSoftSkill,
  getSoftSkillDescription,
  categorizeTechnicalSkill,
  cleanBulletLine,
  hasContent,
  hasItems,
  hasExperienceContent,
  hasEducationContent,
  hasLanguageContent,
  hasProjectContent,
  hasSkillsContent,
  buildSection,
  buildSkills,
  buildLanguages,
  buildEducation,
  buildExperience,
  buildProjects,
  resolveTemplateName,
};