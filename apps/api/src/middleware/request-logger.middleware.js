const logger = require("../utils/logger");

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;

    logger.info("REQUEST", `${req.method} ${req.originalUrl}`, {
      statusCode: res.statusCode,
      durationMs,
    });
  });

  next();
}

module.exports = requestLogger;