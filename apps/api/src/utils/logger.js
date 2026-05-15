const env = require("../config/env");

const SENSITIVE_KEYS = [
  "password",
  "token",
  "authorization",
  "apikey",
  "apiKey",
  "secret",
  "jwt",
  "DATABASE_URL",
  "JWT_SECRET",
];

function getTimestamp() {
  return new Date().toISOString();
}

function shouldRedactKey(key = "") {
  const normalizedKey = String(key).toLowerCase();

  return SENSITIVE_KEYS.some((sensitiveKey) =>
    normalizedKey.includes(String(sensitiveKey).toLowerCase())
  );
}

function sanitizeMeta(meta = {}) {
  if (!meta || typeof meta !== "object") return meta;

  return Object.entries(meta).reduce((safeMeta, [key, value]) => {
    if (shouldRedactKey(key)) {
      safeMeta[key] = "[REDACTED]";
      return safeMeta;
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      safeMeta[key] = sanitizeMeta(value);
      return safeMeta;
    }

    safeMeta[key] = value;
    return safeMeta;
  }, {});
}

function formatMeta(meta = {}) {
  const safeMeta = sanitizeMeta(meta);

  if (!safeMeta || Object.keys(safeMeta).length === 0) return "";

  return ` ${JSON.stringify(safeMeta)}`;
}

function log(level, scope, message, meta = {}) {
  const payload = {
    timestamp: getTimestamp(),
    level,
    scope,
    message,
    ...sanitizeMeta(meta),
  };

  if (env.isProduction) {
    console.log(JSON.stringify(payload));
    return;
  }

  console.log(
    `[${payload.timestamp}] [${level}] [${scope}] ${message}${formatMeta(meta)}`
  );
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