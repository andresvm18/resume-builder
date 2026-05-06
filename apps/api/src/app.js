const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Demasiadas solicitudes. Intenta de nuevo más tarde.",
  },
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);

module.exports = app;