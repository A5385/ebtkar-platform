import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import globals from "globals";

import { createBaseConfig } from "./base.js";

/**
 * Shared Node.js library configuration.
 *
 * @param {{ tsconfigRootDir?: string }} options
 */
export function createLibraryConfig({ tsconfigRootDir } = {}) {
  return defineConfig(
    createBaseConfig({ tsconfigRootDir }),

    {
      files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],

      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",

        globals: {
          ...globals.node,
        },
      },
    },

    eslintConfigPrettier,
  );
}

export default createLibraryConfig;
