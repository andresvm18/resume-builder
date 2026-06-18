const env = require("../config/env");
const logger = require("../utils/logger");

function getSafeErrorMessage(err, statusCode) {
  if (env.isProduction && statusCode >= 500) {
    return "Internal server error";
  }

  return err.message || "Internal server error";
}

function notFoundHandler(req, res, _next) {
  return res.status(404).json({
    message: env.isProduction
      ? "Route not found"
      : `Route not found: ${req.method} ${req.originalUrl}`,
    requestId: req.requestId,
  });
}

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || err.status || 500;

  logger.error("ERROR", err.message || "Unhandled server error", {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    userId: req.user?.userId,
    cause: err.cause?.message,
  });

  const response = {
    message: getSafeErrorMessage(err, statusCode),
    requestId: req.requestId,
  };

  if (!env.isProduction) {
    response.stack = err.stack;

    if (err.cause) {
      response.causeMessage = err.cause.message;
      response.causeStack = err.cause.stack;
    }
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};