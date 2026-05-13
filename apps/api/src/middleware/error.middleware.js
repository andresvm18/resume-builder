import { env } from "../config/env.js";

export function notFoundHandler(req, res, next) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;

  if (!env.isProduction) {
    console.error("❌ Error:", err);
  }

  const response = {
    message:
      env.isProduction && statusCode === 500
        ? "Internal server error"
        : err.message || "Internal server error",
  };

  if (!env.isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}