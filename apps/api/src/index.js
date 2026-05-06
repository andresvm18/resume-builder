require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  override: false,
});

if (
  process.env.NODE_ENV === "test" &&
  !process.env.DATABASE_URL?.includes("_test")
) {
  throw new Error("Tests are trying to use a non-test database.");
}

const app = require("./app");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});