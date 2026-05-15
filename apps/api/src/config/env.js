const isTest = process.env.NODE_ENV === "test";
const isProduction = process.env.NODE_ENV === "production";

const requiredVars = ["DATABASE_URL", "JWT_SECRET"];

if (isProduction) {
  requiredVars.push("FRONTEND_URL");
}

const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length > 0 && !isTest) {
  console.error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
  process.exit(1);
}

if (
  isProduction &&
  process.env.JWT_SECRET &&
  process.env.JWT_SECRET.length < 32
) {
  console.error("JWT_SECRET must be at least 32 characters in production");
  process.exit(1);
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8080,

  DATABASE_URL: process.env.DATABASE_URL,

  JWT_SECRET: isTest
    ? process.env.JWT_SECRET || "test_secret"
    : process.env.JWT_SECRET,

  FRONTEND_URL:
    process.env.FRONTEND_URL ||
    (isProduction ? undefined : "http://localhost:5173"),

  isTest,
  isProduction,
  isDevelopment: !isProduction && !isTest,
};

module.exports = env;