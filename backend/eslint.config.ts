// backend/eslint.config.js
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  {
    files: ["**/*.js"],
    ignores: ["node_modules"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    env: {
      node: true,
      es2021: true,
    },
    rules: {
      "expo/no-env-var-destructuring": "off",
    },
  },
]);
