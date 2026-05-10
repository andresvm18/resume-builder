const {
  generateResumeFromCareerProfile,
} = require("../services/profile-ai.service");

async function generateResumeFromProfile(req, res) {
  try {
    const result = await generateResumeFromCareerProfile({
      userId: req.user.userId,
      jobDescription: req.body.jobDescription,
      template: req.body.template,
    });

    return res.json(result);
  } catch (error) {
    console.error("Error generating resume from profile:", error);

    return res.status(500).json({
      message: "Error generating resume from profile",
    });
  }
}

module.exports = {
  generateResumeFromProfile,
};