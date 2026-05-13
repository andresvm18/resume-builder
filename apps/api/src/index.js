require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  override: false,
});

const env = require("./config/env");

if (
  env.isTest &&
  !env.DATABASE_URL?.includes("_test")
) {
  throw new Error("Tests are trying to use a non-test database.");
}

const app = require("./app");

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});