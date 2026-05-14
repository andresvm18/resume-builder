const {
  MONTHS_ES,
  LANGUAGE_LEVELS_ES,
  SOFT_SKILLS,
  ALLOWED_TEMPLATES,
} = require("./latex.constants");

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

function formatEducationDate(date = "") {
  const year = Number(String(date).slice(0, 4));

  if (!year) return "";

  const currentYear = new Date().getFullYear();

  return year > currentYear ? `${year} (estimado)` : String(year);
}

function formatExperienceDate(date = "") {
  if (!date) return "";

  const [year, month] = String(date).split("-");
  const monthIndex = Number(month) - 1;

  if (!year || monthIndex < 0 || monthIndex > 11) {
    return date;
  }

  return `${MONTHS_ES[monthIndex]} ${year}`;
}

function formatExperienceRange(startDate = "", endDate = "") {
  const start = formatExperienceDate(startDate);
  const normalizedEndDate = normalizeText(endDate);

  if (!start && !endDate) return "";

  if (
    !endDate ||
    normalizedEndDate === "present" ||
    normalizedEndDate === "presente" ||
    normalizedEndDate === "actual" ||
    normalizedEndDate === "actualidad"
  ) {
    return `${start} - Presente`;
  }

  const end = formatExperienceDate(endDate);

  return `${start} - ${end}`;
}

function formatLanguageLevel(level = "") {
  return LANGUAGE_LEVELS_ES[level] || level;
}

function isSoftSkill(skill = "") {
  const normalized = normalizeText(skill);

  return SOFT_SKILLS.some((softSkill) =>
    normalized.includes(normalizeText(softSkill))
  );
}

function getSoftSkillDescription(skill = "") {
  const normalized = normalizeText(skill);

  if (normalized.includes("resolucion de problemas")) {
    return "Análisis de situaciones complejas para identificar causas y proponer soluciones efectivas.";
  }

  if (normalized.includes("proactividad")) {
    return "Iniciativa para anticipar necesidades, optimizar procesos y mejorar resultados.";
  }

  if (normalized.includes("trabajo en equipo")) {
    return "Colaboración efectiva con otras personas para alcanzar objetivos comunes.";
  }

  if (normalized.includes("adaptabilidad")) {
    return "Aprendizaje rápido de nuevas herramientas, procesos y entornos de trabajo.";
  }

  if (normalized.includes("comunicacion")) {
    return "Explicación clara de ideas, resultados o conceptos técnicos a distintas audiencias.";
  }

  if (normalized.includes("liderazgo")) {
    return "Capacidad para orientar tareas, coordinar esfuerzos y apoyar la toma de decisiones.";
  }

  if (normalized.includes("analitico")) {
    return "Interpretación de información y datos para detectar patrones, oportunidades y mejoras.";
  }

  if (normalized.includes("estrategico")) {
    return "Evaluación de información y objetivos para tomar decisiones alineadas al negocio.";
  }

  if (normalized.includes("organizacion")) {
    return "Gestión ordenada de tareas, prioridades e información para cumplir objetivos.";
  }

  if (normalized.includes("detalle")) {
    return "Revisión cuidadosa de información para reducir errores y asegurar calidad.";
  }

  if (normalized.includes("tiempo")) {
    return "Administración eficiente de tareas y entregas dentro de plazos definidos.";
  }

  if (normalized.includes("empatia")) {
    return "Interacción respetuosa y comprensión de necesidades en distintos contextos profesionales.";
  }

  if (normalized.includes("responsabilidad")) {
    return "Cumplimiento consistente de tareas, procesos y compromisos asignados.";
  }

  if (normalized.includes("servicio")) {
    return "Orientación a brindar apoyo y atención efectiva según las necesidades del entorno.";
  }

  if (normalized.includes("liderazgo")) {
    return "Capacidad para coordinar actividades y apoyar el trabajo colaborativo.";
  }

  return "Aplicación práctica demostrada en experiencias laborales, académicas o proyectos.";
}

function categorizeTechnicalSkill(skill = "") {
  const normalized = normalizeText(skill);

  // Software / IT
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
    normalized.includes("desarrollo")
  ) {
    return "Tecnologías y desarrollo";
  }

  // Data / Analytics
  if (
    normalized.includes("power bi") ||
    normalized.includes("dashboard") ||
    normalized.includes("kpi") ||
    normalized.includes("analisis") ||
    normalized.includes("datos") ||
    normalized.includes("excel") ||
    normalized.includes("reportes")
  ) {
    return "Análisis y reportería";
  }

  // Healthcare / Veterinary
  if (
    normalized.includes("paciente") ||
    normalized.includes("clinico") ||
    normalized.includes("medico") ||
    normalized.includes("veterin") ||
    normalized.includes("diagnostico") ||
    normalized.includes("tratamiento") ||
    normalized.includes("procedimiento")
  ) {
    return "Atención y procedimientos";
  }

  // Construction / Industry
  if (
    normalized.includes("obra") ||
    normalized.includes("construccion") ||
    normalized.includes("seguridad industrial") ||
    normalized.includes("maquinaria") ||
    normalized.includes("mantenimiento") ||
    normalized.includes("operacion")
  ) {
    return "Operaciones y ejecución";
  }

  // Education
  if (
    normalized.includes("docencia") ||
    normalized.includes("ensenanza") ||
    normalized.includes("capacitacion") ||
    normalized.includes("educacion") ||
    normalized.includes("aprendizaje")
  ) {
    return "Educación y formación";
  }

  // Customer Service / Sales
  if (
    normalized.includes("cliente") ||
    normalized.includes("ventas") ||
    normalized.includes("servicio") ||
    normalized.includes("call center") ||
    normalized.includes("soporte")
  ) {
    return "Atención y servicio";
  }

  // Logistics / Operations
  if (
    normalized.includes("inventario") ||
    normalized.includes("logistica") ||
    normalized.includes("bodega") ||
    normalized.includes("suministro") ||
    normalized.includes("distribucion")
  ) {
    return "Logística y operaciones";
  }

  // Administration
  if (
    normalized.includes("administracion") ||
    normalized.includes("gestion") ||
    normalized.includes("documentacion") ||
    normalized.includes("procesos") ||
    normalized.includes("organizacion")
  ) {
    return "Gestión y administración";
  }

  // Marketing / Design
  if (
    normalized.includes("marketing") ||
    normalized.includes("seo") ||
    normalized.includes("contenido") ||
    normalized.includes("diseno") ||
    normalized.includes("campana")
  ) {
    return "Marketing y comunicación";
  }

  return "Otras habilidades profesionales";
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

function buildSkills(data = {}) {
  const skills = Array.isArray(data.skills) ? data.skills : [];

  const aiTechnicalSkills = Array.isArray(data.technicalSkills)
    ? data.technicalSkills
    : [];

  const aiSoftSkills = Array.isArray(data.softSkills) ? data.softSkills : [];

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

  let technicalSection = "";
  let softSection = "";

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
      const category = categorizeTechnicalSkill(skill);

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
        )}:} ${escapeLatex(getSoftSkillDescription(skill))}`;
      })
      .join("\n");
  }

  return `
${technicalSection
      ? `\\textbf{Habilidades técnicas}
\\begin{itemize}
${technicalSection}
\\end{itemize}`
      : ""
    }

${softSection
      ? `\\textbf{Habilidades blandas}
\\begin{itemize}
${softSection}
\\end{itemize}`
      : ""
    }
`;
}

function buildLanguages(languages = []) {
  if (!languages.length) return "";

  return languages
    .filter((lang) => lang.name)
    .map(
      (lang) =>
        `${escapeLatex(lang.name)} - ${escapeLatex(
          formatLanguageLevel(lang.level)
        )}`
    )
    .join(" \\\\\n");
}

function buildEducation(education = []) {
  return education
    .filter((edu) => edu.institution || edu.degree)
    .map((edu) => {
      return `
\\textbf{${escapeLatex(edu.degree)}} \\\\
${escapeLatex(edu.institution)} \\hfill ${escapeLatex(
        formatEducationDate(edu.date)
      )}
\\vspace{0.3em}
`;
    })
    .join("\n");
}

function buildExperience(experiences = []) {
  return experiences
    .filter((exp) => exp.title || exp.location || exp.description)
    .map((exp) => {
      const bullets = sanitizeText(exp.description)
        .split(/\n|(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ])/g)
        .map(cleanBulletLine)
        .filter(Boolean)
        .map((line) => `\\item ${escapeLatex(line)}`)
        .join("\n");

      return `
\\textbf{${escapeLatex(exp.title)}} \\\\
${escapeLatex(exp.location)} \\hfill ${escapeLatex(
        formatExperienceRange(exp.startDate, exp.endDate)
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