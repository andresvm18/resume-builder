const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { optimizeResumeSummary } = require("../controllers/ai.controller");

const router = express.Router();

router.post("/optimize-summary", authMiddleware, optimizeResumeSummary);

module.exports = router;