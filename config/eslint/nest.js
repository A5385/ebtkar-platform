import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

import { createBaseConfig } from "./base.js";

/**
 * Shared ESLint configuration for NestJS applications.
 *
 * @param {{ tsconfigRootDir: string }} options
 */
export function createNestConfig({ tsconfigRootDir }) {
  if (!tsconfigRootDir) {
    throw new Error(
      "createNestConfig requires tsconfigRootDir from the consuming project.",
    );
  }

  return defineConfig(
    createBaseConfig({
      tsconfigRootDir,
    }),

    ...tseslint.configs.recommendedTypeChecked,

    {
      name: "@repo/eslint-config/nest/source",

      files: ["**/*.ts"],

      languageOptions: {
        sourceType: "module",

        globals: {
          ...globals.node,
        },

        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },

      rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-misused-promises": "error",
        "@typescript-eslint/no-unsafe-argument": "warn",
      },
    },

    {
      name: "@repo/eslint-config/nest/tests",

      files: ["**/*.spec.ts", "**/*.test.ts", "test/**/*.ts"],

      languageOptions: {
        globals: {
          ...globals.jest,
        },
      },

      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      },
    },

    eslintConfigPrettier,
  );
}

export default createNestConfig;
