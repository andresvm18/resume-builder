const { prisma } = require("../lib/prisma");
const { normalizeResumeData } = require("../utils/resumeNormalizer");

function normalizeProfileData(data = {}) {
  return {
    ...normalizeResumeData(data),
    certifications: Array.isArray(data.certifications)
      ? data.certifications.map((item) => String(item).trim()).filter(Boolean)
      : [],
    links: Array.isArray(data.links)
      ? data.links.map((item) => String(item).trim()).filter(Boolean)
      : [],
    targetRoles: Array.isArray(data.targetRoles)
      ? data.targetRoles.map((item) => String(item).trim()).filter(Boolean)
      : [],
  };
}

async function getUserProfile(userId) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return {
      profileData: normalizeProfileData({}),
    };
  }

  return {
    id: profile.id,
    profileData: normalizeProfileData(profile.data),
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

async function upsertUserProfile(userId, profileData) {
  const cleanData = normalizeProfileData(profileData);

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: {
      data: cleanData,
    },
    create: {
      userId,
      data: cleanData,
    },
  });

  return {
    id: profile.id,
    profileData: normalizeProfileData(profile.data),
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

module.exports = {
  getUserProfile,
  upsertUserProfile,
  normalizeProfileData,
};