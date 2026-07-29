import js from "@eslint/js";
import turboPlugin from "eslint-plugin-turbo";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

/**
 * Shared environment-neutral ESLint configuration.
 *
 * @param {{ tsconfigRootDir?: string }} options
 */
export function createBaseConfig({ tsconfigRootDir } = {}) {
  return defineConfig(
    globalIgnores([
      "**/node_modules/**",
      "**/.turbo/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
    ]),

    js.configs.recommended,

    tseslint.configs.recommended,

    {
      files: ["**/*.{ts,tsx,mts,cts}"],

      languageOptions: {
        parserOptions: {
          ...(tsconfigRootDir ? { tsconfigRootDir } : {}),
        },
      },
    },

    {
      plugins: {
        turbo: turboPlugin,
      },

      rules: {
        "turbo/no-undeclared-env-vars": "warn",
      },
    },
  );
}

export default createBaseConfig;
