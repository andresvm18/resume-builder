const {
  generateResumeFromCareerProfile,
} = require("../services/profile-ai.service");

const logger = require("../utils/logger");

async function generateResumeFromProfile(req, res) {
  try {
    const result = await generateResumeFromCareerProfile({
      userId: req.user.userId,
      jobDescription: req.body.jobDescription,
      template: req.body.template,
    });

    return res.json(result);
  } catch (error) {
    logger.error("PROFILE_AI", "Error generating resume from profile", {
      message: error.message,
      userId: req.user?.userId,
    });

    return res.status(500).json({
      message: "Error generating resume from profile",
    });
  }
}

module.exports = {
  generateResumeFromProfile,
};