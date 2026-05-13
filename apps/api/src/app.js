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

app.get("/api/health", (req, res) => {
  const memoryUsage = process.memoryUsage();

  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    memory: {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
    },
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/profile", profileAiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;