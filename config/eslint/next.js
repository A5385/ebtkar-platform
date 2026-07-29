import pluginNext from "@next/eslint-plugin-next";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

import { createReactConfig } from "./react.js";

/**
 * Shared Next.js configuration.
 *
 * @param {{ tsconfigRootDir?: string }} options
 */
export function createNextConfig({ tsconfigRootDir } = {}) {
  return defineConfig(
    createReactConfig({ tsconfigRootDir }),

    globalIgnores([
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/next-env.d.ts",
    ]),

    pluginNext.configs["core-web-vitals"],

    eslintConfigPrettier,
  );
}

export default createNextConfig;
