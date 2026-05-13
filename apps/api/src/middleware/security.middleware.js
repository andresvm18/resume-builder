const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const env = require("../config/env");

const allowedOrigins = [
  env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (!env.isProduction && origin.startsWith("http://localhost")) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
});

const helmetMiddleware = helmet({
  crossOriginResourcePolicy: {
    policy: "cross-origin",
  },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction ? 300 : 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Demasiadas solicitudes. Intenta de nuevo más tarde.",
  },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction ? 20 : 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Demasiadas solicitudes de IA. Intenta de nuevo en unos minutos.",
  },
});

module.exports = {
  corsMiddleware,
  helmetMiddleware,
  apiLimiter,
  aiLimiter,
};