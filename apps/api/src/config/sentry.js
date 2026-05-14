const Sentry = require("@sentry/node");
const env = require("./env");

function initializeSentry() {
  if (!process.env.SENTRY_DSN_BACKEND) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN_BACKEND,
    environment: env.NODE_ENV,
    tracesSampleRate: env.isProduction ? 0.05 : 1.0,
  });
}

module.exports = {
  Sentry,
  initializeSentry,
};