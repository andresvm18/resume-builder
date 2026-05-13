const express = require("express");

const {
  corsMiddleware,
  helmetMiddleware,
  apiLimiter,
  aiLimiter,
} = require("./middleware/security.middleware");

const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const aiRoutes = require("./routes/ai.routes");
const profileRoutes = require("./routes/profile.routes");
const profileAiRoutes = require("./routes/profile-ai.routes");

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: "750kb" }));

if (process.env.NODE_ENV === "production") {
  app.use("/api", apiLimiter);
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/profile", profileAiRoutes);

module.exports = app;