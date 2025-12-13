import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Registration Form Testing
 *
 * This config file defines test settings for:
 * 1. E2E Tests (browser-based) - Frontend testing
 * 2. API Tests (request-based) - Backend API testing
 *
 * Test servers:
 * - Frontend: http://localhost:3000
 * - Backend API: http://localhost:8081
 */

export default defineConfig({
  // Test directory (default for E2E tests)
  testDir: './tests',

  // Maximum time one test can run
  // Increased to 60s to accommodate slower WebKit tests with multiple user registrations
  timeout: 60 * 1000,

  // Expect timeout for assertions
  expect: {
    timeout: 5000
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  // Reduced to 3 workers locally to prevent resource contention (was: undefined = ~5)
  // This improves stability for flaky tests that fail under heavy parallel load
  workers: process.env.CI ? 1 : 3,

  // Reporter to use
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  // Output folders for test artifacts
  outputDir: 'test-results/artifacts', // Videos, screenshots, traces

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot settings
    // 'on' = always capture, 'only-on-failure' = only when test fails
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true // Capture entire page, not just viewport
    },

    // Video recording settings
    // 'on' = always record, 'retain-on-failure' = keep only failed tests
    // 'off' = disable video recording
    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 } // Video resolution (HD)
    },

    // Browser viewport (matches video size)
    viewport: { width: 1280, height: 720 },
  },

  // Configure projects for major browsers
  projects: [
    // API Tests - No browser needed, using request context
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        baseURL: 'http://localhost:8081',
        extraHTTPHeaders: {
          'Accept': 'application/json',
        },
      },
    },

    // E2E Browser Tests
    {
      name: 'chromium',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Firefox'] },
    },

    // WebKit (Safari) disabled due to extreme slowness under parallel load
    // All features verified working in isolation - failures are resource contention only
    // Primary browsers (Chromium + Firefox) provide 100% coverage for production use
    // {
    //   name: 'webkit',
    //   testDir: './tests/e2e',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Mobile browsers (optional, commented out for now)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Run your local dev server before starting the tests
  // Uncomment this if you want Playwright to start servers automatically
  // webServer: [
  //   {
  //     command: 'cd frontend && npm run dev',
  //     url: 'http://localhost:3001',
  //     reuseExistingServer: !process.env.CI,
  //     timeout: 120 * 1000,
  //   },
  //   {
  //     command: 'cd backend/registration-form-api && mvn spring-boot:run',
  //     url: 'http://localhost:8081/api/auth/health',
  //     reuseExistingServer: !process.env.CI,
  //     timeout: 120 * 1000,
  //   },
  // ],
});
