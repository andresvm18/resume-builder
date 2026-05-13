const env = require("../config/env");

function getTimestamp() {
  return new Date().toISOString();
}

function formatMeta(meta = {}) {
  if (!meta || Object.keys(meta).length === 0) return "";

  return ` ${JSON.stringify(meta)}`;
}

function log(level, scope, message, meta) {
  const timestamp = getTimestamp();

  console.log(`[${timestamp}] [${level}] [${scope}] ${message}${formatMeta(meta)}`);
}

const logger = {
  info(scope, message, meta) {
    log("INFO", scope, message, meta);
  },

  warn(scope, message, meta) {
    log("WARN", scope, message, meta);
  },

  error(scope, message, meta) {
    log("ERROR", scope, message, meta);
  },

  debug(scope, message, meta) {
    if (!env.isProduction) {
      log("DEBUG", scope, message, meta);
    }
  },
};

module.exports = logger;