import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 *
 * IMPORTANT: Default tests run AGAINST PRODUCTION (https://trovesandcoves.ca)
 *
 * This config supports two test suites:
 * 1. **Production Tests** (default) - Run against https://trovesandcoves.ca
 * 2. **Debug Tests** - Run against local dev server at http://localhost:5000
 *
 * COMMANDS:
 * - npm run test:e2e           → Runs all production tests (default, all browsers)
 * - npm run test:e2e:ui         → Same as above, with UI reporter
 * - npm run test:e2e:debug-tests → Runs debug tests against localhost:5000
 * - npm run test:e2e:debugger    → Opens Playwright inspector
 *
 * NOTE: Use production tests for CI/CD pipelines. Debug tests are for local development only.
 */
export default defineConfig({
  // Default test directory for production tests (runs against https://trovesandcoves.ca)
  testDir: './tests/e2e',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Shared settings for all the projects below. */
  use: {
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects */
  projects: [
    // ========== PRODUCTION TESTS ==========
    // These run against the live site at https://trovesandcoves.ca
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://trovesandcoves.ca',
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'https://trovesandcoves.ca',
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        baseURL: 'https://trovesandcoves.ca',
      },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        baseURL: 'https://trovesandcoves.ca',
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        baseURL: 'https://trovesandcoves.ca',
      },
    },

    // ========== DEBUG TESTS ==========
    // These run against local dev server and compare with production
    // Only run with: npm run test:e2e:debug
    {
      name: 'debug-local',
      testDir: './tests/e2e-debug',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5000',
      },
    },
  ],
});
