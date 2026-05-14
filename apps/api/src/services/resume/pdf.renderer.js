const fs = require("fs/promises");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const logger = require("../../utils/logger");

const execFileAsync = promisify(execFile);

const {
  latexValue,
  hasExperienceContent,
  hasEducationContent,
  hasSkillsContent,
  hasLanguageContent,
  hasProjectContent,
  buildSection,
  buildExperience,
  buildEducation,
  buildSkills,
  buildLanguages,
  buildProjects,
  resolveTemplateName,
} = require("./latex.helpers");

async function removeTemporaryFiles(paths = []) {
  await Promise.all(paths.map((filePath) => fs.unlink(filePath).catch(() => {})));
}

async function compileLatex({ outputDir, texPath }) {
  await execFileAsync("pdflatex", [
    "-interaction=nonstopmode",
    "-halt-on-error",
    "-output-directory",
    outputDir,
    texPath,
  ]);
}

async function renderResumePdf(data) {
  const templateName = resolveTemplateName(data.template);
  const templatePath = path.join(
    __dirname,
    "../../templates/resume",
    `${templateName}.tex`
  );

  const template = await fs.readFile(templatePath, "utf8");
  const outputDir = path.join(__dirname, "../../../generated");

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
  const auxPath = path.join(outputDir, `cv-${fileId}.aux`);
  const logPath = path.join(outputDir, `cv-${fileId}.log`);

  await fs.writeFile(texPath, texContent, "utf-8");

  const start = Date.now();

  logger.info("PDF", "Starting PDF generation", {
    template: templateName,
  });

  try {
    await compileLatex({ outputDir, texPath });

    const pdfBuffer = await fs.readFile(pdfPath);

    if (!pdfBuffer || pdfBuffer.length < 1000) {
      throw new Error("PDF_EMPTY_OR_INVALID");
    }

    logger.info("PDF", "PDF generated successfully", {
      template: templateName,
      durationMs: Date.now() - start,
      sizeBytes: pdfBuffer.length,
    });

    return pdfBuffer;
  } catch (error) {
    logger.error("PDF", "PDF generation failed", {
      message: error.message,
      stdout: error.stdout,
      stderr: error.stderr,
      template: templateName,
    });

    if (error.message === "PDF_EMPTY_OR_INVALID") {
      throw error;
    }

    throw new Error("PDF_GENERATION_FAILED");
  } finally {
    await removeTemporaryFiles([texPath, auxPath, logPath, pdfPath]);
  }
}

module.exports = {
  renderResumePdf,
};