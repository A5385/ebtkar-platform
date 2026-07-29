/**
 * @type {
 *   import('prettier').Config &
 *   import('prettier-plugin-tailwindcss').PluginOptions
 * }
 */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],

  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: "all",
  semi: true,

  useTabs: false,
  tabWidth: 4,
  printWidth: 100,

  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",

  tailwindFunctions: ["cn", "clsx", "cva"],
};

export default config;
