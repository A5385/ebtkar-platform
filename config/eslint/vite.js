import eslintConfigPrettier from "eslint-config-prettier/flat";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

import { createReactConfig } from "./react.js";

/**
 * Shared Vite + React configuration.
 *
 * @param {{ tsconfigRootDir?: string }} options
 */
export function createViteConfig({ tsconfigRootDir } = {}) {
  return defineConfig(
    createReactConfig({ tsconfigRootDir }),

    globalIgnores(["**/dist/**"]),

    {
      files: ["**/*.{js,jsx,ts,tsx}"],

      plugins: {
        "react-refresh": reactRefresh,
      },

      rules: {
        "react-refresh/only-export-components": [
          "warn",
          {
            allowConstantExport: true,
          },
        ],
      },
    },

    eslintConfigPrettier,
  );
}

export default createViteConfig;
