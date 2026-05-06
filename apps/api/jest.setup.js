require("dotenv").config({
  path: process.env.NODE_ENV === "test"
    ? ".env.test"
    : ".env",
  override: false,
});

if (
  process.env.NODE_ENV === "test" &&
  !process.env.DATABASE_URL?.includes("_test")
) {
  throw new Error(
    "Tests are trying to use a non-test database."
  );
}

process.env.JWT_SECRET =
  process.env.JWT_SECRET || "test_secret";