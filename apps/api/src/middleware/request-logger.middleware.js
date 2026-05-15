const crypto = require("crypto");
const logger = require("../utils/logger");

function getRequestId(req) {
  return (
    req.headers["x-request-id"] ||
    req.headers["x-correlation-id"] ||
    crypto.randomUUID()
  );
}

function requestLogger(req, res, next) {
  const start = Date.now();
  const requestId = getRequestId(req);

  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  res.on("finish", () => {
    const durationMs = Date.now() - start;

    logger.info("REQUEST", `${req.method} ${req.originalUrl}`, {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      userId: req.user?.userId,
    });
  });

  next();
}

module.exports = requestLogger;