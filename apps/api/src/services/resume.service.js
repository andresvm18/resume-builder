const fs = require("fs/promises");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);
const { prisma } = require("../lib/prisma");

const { normalizeResumeData } = require("../utils/resumeNormalizer");

const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const LANGUAGE_LEVELS_ES = {
  Basic: "Básico",
  Intermediate: "Intermedio",
  Advanced: "Avanzado",
  Fluent: "Fluido",
  Native: "Nativo",
};

const SOFT_SKILLS = [
  "comunicación",
  "comunicacion",
  "comunicación asertiva",
  "comunicacion asertiva",
  "trabajo en equipo",
  "liderazgo",
  "pensamiento analítico",
  "pensamiento analitico",
  "pensamiento estratégico",
  "pensamiento estrategico",
  "resolución de problemas",
  "resolucion de problemas",
  "proactividad",
  "adaptabilidad",
  "organización",
  "organizacion",
  "atención al detalle",
  "atencion al detalle",
  "gestión del tiempo",
  "gestion del tiempo",
];

function sanitizeText(value = "") {
  return String(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function latexValue(value = "") {
  const clean = sanitizeText(value);

  if (!clean) return "\\mbox{}";

  return escapeLatex(clean);
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

  return "Aplicación práctica demostrada en experiencias laborales, académicas o proyectos.";
}

function categorizeTechnicalSkill(skill = "") {
  const normalized = normalizeText(skill);

  if (
    normalized.includes("power bi") ||
    normalized.includes("dashboard") ||
    normalized.includes("reporte") ||
    normalized.includes("kpi") ||
    normalized.includes("indicadores")
  ) {
    return "Visualización y reportería";
  }

  if (
    normalized.includes("excel") ||
    normalized.includes("tabla") ||
    normalized.includes("formula") ||
    normalized.includes("macro")
  ) {
    return "Herramientas de productividad";
  }

  if (
    normalized.includes("sql") ||
    normalized.includes("base de datos") ||
    normalized.includes("bases de datos") ||
    normalized.includes("datos")
  ) {
    return "Bases de datos y análisis";
  }

  if (
    normalized.includes("proceso") ||
    normalized.includes("operacion") ||
    normalized.includes("planeacion") ||
    normalized.includes("gestion") ||
    normalized.includes("control")
  ) {
    return "Gestión y procesos";
  }

  return "Otras habilidades técnicas";
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


const ALLOWED_TEMPLATES = new Set(["classic", "modern", "compact"]);

function resolveTemplateName(templateName) {
  if (!templateName || !ALLOWED_TEMPLATES.has(templateName)) {
    return "classic";
  }

  return templateName;
}

async function renderResumePdf(data) {

  const templateName = resolveTemplateName(data.template);
  const templatePath = path.join(
    __dirname,
    "../templates/resume",
    `${templateName}.tex`
  );

  const template = await fs.readFile(templatePath, "utf8");
  const outputDir = path.join(__dirname, "../../generated");

  await fs.mkdir(outputDir, { recursive: true });

  const texContent = template
    .replaceAll("{{FULL_NAME}}", latexValue(data.fullName))
    .replaceAll("{{EMAIL}}", latexValue(data.email))
    .replaceAll("{{PHONE}}", latexValue(data.phone))
    .replaceAll("{{LOCATION}}", latexValue(data.location))
    .replaceAll("{{SUMMARY}}", latexValue(data.summary))
    .replaceAll(
      "{{EXPERIENCE_SECTION}}",
      hasExperienceContent(data.experiences)
        ? buildSection("EXPERIENCIA LABORAL", buildExperience(data.experiences))
        : ""
    )
    .replaceAll(
      "{{EDUCATION_SECTION}}",
      hasEducationContent(data.education)
        ? buildSection("EDUCACIÓN", buildEducation(data.education))
        : ""
    )
    .replaceAll(
      "{{SKILLS_SECTION}}",
      hasSkillsContent(data)
        ? buildSection("HABILIDADES", buildSkills(data))
        : ""
    )
    .replaceAll(
      "{{LANGUAGES_SECTION}}",
      hasLanguageContent(data.languages)
        ? buildSection("IDIOMAS", buildLanguages(data.languages))
        : ""
    )
    .replaceAll(
      "{{PROJECTS_SECTION}}",
      hasProjectContent(data.projects)
        ? buildSection("PROYECTOS", buildProjects(data.projects))
        : ""
    );

  const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  const texPath = path.join(outputDir, `cv-${fileId}.tex`);
  const pdfPath = path.join(outputDir, `cv-${fileId}.pdf`);

  await fs.writeFile(texPath, texContent, "utf-8");

  try {
    await execFileAsync("pdflatex", [
      "-interaction=nonstopmode",
      "-halt-on-error",
      "-output-directory",
      outputDir,
      texPath,
    ]);
  } catch (error) {
    console.error("Error compilando LaTeX:");
    console.error(error.stdout);
    console.error(error.stderr);
    throw new Error("PDF_GENERATION_FAILED");
  }

  const pdfBuffer = await fs.readFile(pdfPath);

  if (!pdfBuffer || pdfBuffer.length < 1000) {
    throw new Error("PDF_EMPTY_OR_INVALID");
  }

  await fs.unlink(texPath).catch(() => { });
  await fs.unlink(path.join(outputDir, `cv-${fileId}.aux`)).catch(() => { });
  await fs.unlink(path.join(outputDir, `cv-${fileId}.log`)).catch(() => { });
  await fs.unlink(pdfPath).catch(() => { });

  return pdfBuffer;
}

async function saveResumeVersion(userId, data) {
  const resume = await prisma.resume.create({
    data: {
      title: data.fullName || "CV sin nombre",
      userId,
    },
  });

  await prisma.resumeVersion.create({
    data: {
      resumeId: resume.id,
      data,
    },
  });

  return resume;
}

async function generateResumePdf(data, userId) {
  const cleanData = normalizeResumeData(data);

  await saveResumeVersion(userId, cleanData);
  return renderResumePdf(cleanData);
}

async function getUserResumes(userId) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      versions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
}

async function generateResumePdfById(resumeId, userId) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
    include: {
      versions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!resume || resume.versions.length === 0) {
    throw new Error("RESUME_NOT_FOUND");
  }

  const latestVersion = resume.versions[0];

  return renderResumePdf(normalizeResumeData(latestVersion.data));
}

async function getUserResumeById(resumeId, userId) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
    include: {
      versions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!resume || resume.versions.length === 0) {
    throw new Error("RESUME_NOT_FOUND");
  }

  return resume;
}

async function deleteUserResume(resumeId, userId) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });

  if (!resume) {
    throw new Error("RESUME_NOT_FOUND");
  }

  await prisma.resume.delete({
    where: {
      id: resumeId,
    },
  });

  return resume;
}

module.exports = {
  renderResumePdf,
  generateResumePdf,
  getUserResumes,
  generateResumePdfById,
  getUserResumeById,
  deleteUserResume,
};