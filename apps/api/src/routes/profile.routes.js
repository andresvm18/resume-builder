const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profile.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { validateBody, profileSchema } = require("../validators/schemas");

const router = express.Router();

router.get("/", authMiddleware, getProfile);

router.put(
  "/",
  authMiddleware,
  validateBody(profileSchema),
  updateProfile
);

module.exports = router;