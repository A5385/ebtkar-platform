import eslintConfigPrettier from "eslint-config-prettier/flat";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";

import { createBaseConfig } from "./base.js";

/**
 * Shared React configuration.
 *
 * @param {{ tsconfigRootDir?: string }} options
 */
export function createReactConfig({ tsconfigRootDir } = {}) {
  return defineConfig(
    createBaseConfig({ tsconfigRootDir }),

    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat["jsx-runtime"],
    pluginReactHooks.configs.flat.recommended,

    {
      files: ["**/*.{js,jsx,ts,tsx}"],

      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.serviceworker,
        },
      },

      settings: {
        react: {
          version: "detect",
        },
      },

      rules: {
        "react/react-in-jsx-scope": "off",
      },
    },

    // Must remain last.
    eslintConfigPrettier,
  );
}

export default createReactConfig;
