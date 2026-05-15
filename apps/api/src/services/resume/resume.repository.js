const { prisma } = require("../../lib/prisma");

async function createResumeWithVersion(userId, data) {
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

async function findUserResumes(userId) {
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

async function findUserResumeWithLatestVersion(resumeId, userId) {
  return prisma.resume.findFirst({
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
}

async function findUserResume(resumeId, userId) {
  return prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });
}

async function updateResumeWithVersion(resumeId, title, data) {
  return prisma.resume.update({
    where: {
      id: resumeId,
    },
    data: {
      title,
      versions: {
        create: {
          data,
        },
      },
    },
    include: {
      versions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });
}

async function createDuplicatedResume(title, userId, data) {
  return prisma.resume.create({
    data: {
      title,
      userId,
      versions: {
        create: {
          data,
        },
      },
    },
    include: {
      versions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });
}

async function deleteResumeById(resumeId) {
  return prisma.resume.delete({
    where: {
      id: resumeId,
    },
  });
}

module.exports = {
  createResumeWithVersion,
  findUserResumes,
  findUserResumeWithLatestVersion,
  findUserResume,
  updateResumeWithVersion,
  createDuplicatedResume,
  deleteResumeById,
};