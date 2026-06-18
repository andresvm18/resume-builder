const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["generated/**", "coverage/**"],
  },

  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2023,
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  {
    files: ["src/__tests__/**/*.js", "jest.setup.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];