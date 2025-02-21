import globals from "globals";
import pluginJs from "@eslint/js";
import next from "@next/eslint-plugin-next";

export default [
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true, // Enable JSX support
      },
    },
  },
  pluginJs.configs.recommended,
  next.configs.recommended, // Add Next.js ESLint rules
];
