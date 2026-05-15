const { normalizeResumeData } = require("../../utils/resumeNormalizer");
const { renderResumePdf } = require("./pdf.renderer");

const {
  createResumeWithVersion,
  findUserResumes,
  findUserResumeWithLatestVersion,
  findUserResume,
  updateResumeWithVersion,
  createDuplicatedResume,
  deleteResumeById,
} = require("./resume.repository");

function ensureResumeExistsWithVersion(resume) {
  if (!resume || resume.versions.length === 0) {
    throw new Error("RESUME_NOT_FOUND");
  }
}

async function generateResumePdf(data, userId) {
  const cleanData = normalizeResumeData(data);

  await createResumeWithVersion(userId, cleanData);
  return renderResumePdf(cleanData);
}

async function getUserResumes(userId) {
  return findUserResumes(userId);
}

async function generateResumePdfById(resumeId, userId) {
  const resume = await findUserResumeWithLatestVersion(resumeId, userId);

  ensureResumeExistsWithVersion(resume);

  const latestVersion = resume.versions[0];

  return renderResumePdf(normalizeResumeData(latestVersion.data));
}

async function getUserResumeById(resumeId, userId) {
  const resume = await findUserResumeWithLatestVersion(resumeId, userId);

  ensureResumeExistsWithVersion(resume);

  return resume;
}

async function updateUserResume(resumeId, userId, data) {
  const cleanData = normalizeResumeData(data);

  const resume = await findUserResume(resumeId, userId);

  if (!resume) {
    throw new Error("RESUME_NOT_FOUND");
  }

  return updateResumeWithVersion(
    resumeId,
    cleanData.fullName || resume.title,
    cleanData
  );
}

async function duplicateUserResume(resumeId, userId) {
  const resume = await findUserResumeWithLatestVersion(resumeId, userId);

  ensureResumeExistsWithVersion(resume);

  const latestVersion = resume.versions[0];
  const duplicatedData = normalizeResumeData(latestVersion.data);

  return createDuplicatedResume(
    `${resume.title} (Copia)`,
    userId,
    duplicatedData
  );
}

async function deleteUserResume(resumeId, userId) {
  const resume = await findUserResume(resumeId, userId);

  if (!resume) {
    throw new Error("RESUME_NOT_FOUND");
  }

  return deleteResumeById(resumeId);
}

module.exports = {
  generateResumePdf,
  getUserResumes,
  generateResumePdfById,
  getUserResumeById,
  updateUserResume,
  duplicateUserResume,
  deleteUserResume,
};