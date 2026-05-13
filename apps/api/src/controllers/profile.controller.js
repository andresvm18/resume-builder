const {
  getUserProfile,
  upsertUserProfile,
} = require("../services/profile.service");

const asyncHandler = require("../utils/asyncHandler");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await getUserProfile(req.user.userId);
  return res.json(profile);
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await upsertUserProfile(
    req.user.userId,
    req.body.profileData
  );

  return res.json(profile);
});

module.exports = {
  getProfile,
  updateProfile,
};