/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
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
};

export default config;
