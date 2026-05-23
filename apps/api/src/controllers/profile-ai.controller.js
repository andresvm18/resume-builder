const {
  generateResumeFromCareerProfile,
} = require("../services/profile-ai.service");

const asyncHandler = require("../utils/asyncHandler");

const generateResumeFromProfile = asyncHandler(async (req, res) => {
  const result = await generateResumeFromCareerProfile({
    userId: req.user.userId,
    jobDescription: req.body.jobDescription,
    template: req.body.template,
    language: req.body.language,
  });

  return res.json(result);
});

module.exports = {
  generateResumeFromProfile,
};