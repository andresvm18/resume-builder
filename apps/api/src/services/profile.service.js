const { prisma } = require("../lib/prisma");
const { normalizeResumeData } = require("../utils/resumeNormalizer");

function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
}

function normalizeProfileData(data = {}) {
  return {
    ...normalizeResumeData(data),

    certifications: normalizeStringArray(data.certifications),

    links: normalizeStringArray(data.links),

    targetRoles: normalizeStringArray(data.targetRoles),
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