import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.api.spec.ts",
  timeout: process.env.CI ? 60 * 1000 : 30 * 1000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"],
    ["json", { outputFile: "test-results/results.json" }],
  ],

  outputDir: "test-results/artifacts",

  use: {
    baseURL: "http://localhost:8081",
    trace: "on-first-retry",
    extraHTTPHeaders: {
      Accept: "application/json",
      // NOTE: Do NOT set Content-Type globally - it breaks multipart/form-data requests
      // Each method (post, postMultipart) sets its own Content-Type as needed
    },
  },

  projects: [
    {
      name: "api-tests",
      testMatch: "**/*.api.spec.ts",
    },
  ],
});
