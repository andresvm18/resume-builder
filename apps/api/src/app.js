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
const requestLogger = require("./middleware/request-logger.middleware");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

const {
  getSystemHealth,
} = require("./services/system/health.service");

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: "750kb" }));
app.use(requestLogger);

if (process.env.NODE_ENV === "production") {
  app.use("/api", apiLimiter);
}

app.get("/api/health", async (req, res) => {
  const health = await getSystemHealth();

  const statusCode =
    health.status === "healthy"
      ? 200
      : 503;

  return res.status(statusCode).json(health);
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/profile", profileAiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;