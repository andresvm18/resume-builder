const {
  getUserProfile,
  upsertUserProfile,
} = require("../services/profile.service");

const logger = require("../utils/logger");

async function getProfile(req, res) {
  try {
    const profile = await getUserProfile(req.user.userId);

    return res.json(profile);
  } catch (error) {
    logger.error("PROFILE", "Error fetching profile", {
      message: error.message,
      userId: req.user?.userId,
    });

    return res.status(500).json({
      message: "Error al obtener el perfil",
    });
  }
}

async function updateProfile(req, res) {
  try {
    const profile = await upsertUserProfile(
      req.user.userId,
      req.body.profileData
    );

    return res.json(profile);
  } catch (error) {
    logger.error("PROFILE", "Error updating profile", {
      message: error.message,
      userId: req.user?.userId,
    });

    return res.status(500).json({
      message: "Error al actualizar el perfil",
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
};