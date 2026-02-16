/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest");
const path = require("path");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  // Use absolute path to avoid issues with rootDir resolution
  setupFilesAfterEnv: [path.join(__dirname, "jest.setup.js")],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/tests/e2e/",
  ],
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
  // Coverage thresholds - set to current coverage level to prevent regression
  // Actual coverage: ~34% statements, ~34% branches, ~39% functions
  // Project focuses on E2E tests (48 tests) for critical path coverage
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 35,
      lines: 30,
      statements: 30,
    },
  },
  // Module name mapper for @/* aliases
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
