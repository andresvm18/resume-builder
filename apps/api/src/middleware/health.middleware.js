const env = require("../config/env");

function requireHealthToken(req, res, next) {
  const configuredToken = process.env.HEALTH_CHECK_TOKEN;

  if (!configuredToken) {
    if (env.isProduction) {
      return res.status(404).json({ message: "Not found" });
    }

    return next();
  }

  const providedToken = req.headers["x-health-token"];

  if (providedToken !== configuredToken) {
    return res.status(404).json({ message: "Not found" });
  }

  return next();
}

module.exports = requireHealthToken;