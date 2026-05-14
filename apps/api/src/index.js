require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  override: false,
});

const env = require("./config/env");
const logger = require("./utils/logger");
const { initializeSentry } = require("./config/sentry");

initializeSentry();

if (env.isTest && !env.DATABASE_URL?.includes("_test")) {
  throw new Error("Tests are trying to use a non-test database.");
}

const app = require("./app");

const PORT = Number(env.PORT || process.env.PORT || 8080);

const server = app.listen(PORT, () => {
  logger.info("SERVER", `API running on port ${PORT}`, {
    environment: env.NODE_ENV,
  });
});

server.on("error", (error) => {
  logger.error("SERVER", "Failed to start API server", {
    message: error.message,
  });

  process.exit(1);
});