const fs = require("fs/promises");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);
const { prisma } = require("../lib/prisma");

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

function buildSkills(skills = []) {
  if (!skills.length) return "";

  return skills.map((skill) => escapeLatex(skill)).join(", ");
}

function buildLanguages(languages = []) {
  if (!languages.length) return "";

  return languages
    .filter((lang) => lang.name)
    .map((lang) => `${escapeLatex(lang.name)} -- ${escapeLatex(lang.level)}`)
    .join(" \\\\\n");
}

function buildEducation(education = []) {
  return education
    .filter((edu) => edu.institution || edu.degree)
    .map((edu) => {
      return `
\\textbf{${escapeLatex(edu.degree)}} \\\\
${escapeLatex(edu.institution)} \\hfill ${escapeLatex(edu.date)}
\\vspace{0.3em}
`;
    })
    .join("\n");
}

function buildExperience(experiences = []) {
  return experiences
    .filter((exp) => exp.title || exp.location || exp.description)
    .map((exp) => {
      const bullets = String(exp.description || "")
        .split("\n")
        .filter(Boolean)
        .map((line) => `\\item ${escapeLatex(line)}`)
        .join("\n");

      return `
\\textbf{${escapeLatex(exp.title)}} \\\\
${escapeLatex(exp.location)} \\hfill ${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate || "Actual")}
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
\\item ${escapeLatex(project.description)}
\\end{itemize}
`;
    })
    .join("\n");
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
  await saveResumeVersion(userId, data);
  const templatePath = path.join(__dirname, "../templates/resume-template.tex");
  const outputDir = path.join(__dirname, "../../generated");

  await fs.mkdir(outputDir, { recursive: true });

  const template = await fs.readFile(templatePath, "utf-8");

  const texContent = template
    .replaceAll("{{FULL_NAME}}", escapeLatex(data.fullName))
    .replaceAll("{{EMAIL}}", escapeLatex(data.email))
    .replaceAll("{{PHONE}}", escapeLatex(data.phone))
    .replaceAll("{{LOCATION}}", escapeLatex(data.location))
    .replaceAll("{{SUMMARY}}", escapeLatex(data.summary))
    .replaceAll("{{EDUCATION}}", buildEducation(data.education))
    .replaceAll("{{EXPERIENCE}}", buildExperience(data.experiences))
    .replaceAll("{{SKILLS}}", buildSkills(data.skills))
    .replaceAll("{{LANGUAGES}}", buildLanguages(data.languages))
    .replaceAll("{{PROJECTS}}", buildProjects(data.projects));

  const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  const texPath = path.join(outputDir, `cv-${fileId}.tex`);
  const pdfPath = path.join(outputDir, `cv-${fileId}.pdf`);

  await fs.writeFile(texPath, texContent, "utf-8");

  await execFileAsync("pdflatex", [
    "-interaction=nonstopmode",
    "-halt-on-error",
    "-output-directory",
    outputDir,
    texPath,
  ]);

  const pdfBuffer = await fs.readFile(pdfPath);

  // Cleanup
  await fs.unlink(texPath).catch(() => { });
  await fs.unlink(path.join(outputDir, `cv-${fileId}.aux`)).catch(() => { });
  await fs.unlink(path.join(outputDir, `cv-${fileId}.log`)).catch(() => { });

  return pdfBuffer;
}

async function getUserResumes(userId) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      versions: {
        orderBy: { createdAt: "desc" },
        take: 1, // last version
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

  return generateResumePdf(latestVersion.data, userId);
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
  generateResumePdf,
  getUserResumes,
  generateResumePdfById,
  getUserResumeById,
  deleteUserResume,
};