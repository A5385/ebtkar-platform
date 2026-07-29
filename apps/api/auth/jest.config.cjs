/** @type {import('jest').Config} */
module.exports = {
  displayName: "api-auth",

  rootDir: ".",

  moduleFileExtensions: ["js", "json", "ts"],

  testMatch: ["<rootDir>/src/**/*.spec.ts"],

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
      },
    ],
  },

  collectCoverageFrom: ["src/**/*.ts", "!src/main.ts", "!src/**/*.module.ts"],

  coverageDirectory: "<rootDir>/coverage",

  testEnvironment: "node",

  clearMocks: true,
  restoreMocks: true,
};
