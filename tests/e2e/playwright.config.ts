import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 0,
  /* Every spec resets the DB per-test (see tests/*.spec.ts beforeEach + dbReset.ts),
   * against one shared Postgres instance and one shared API process - concurrent
   * workers would race each other's DROP/CREATE DATABASE and corrupt in-flight
   * tests. Each CI job (see matrix in E2e.yml) already only runs one browser's
   * tests, so this keeps them serialized within that job. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /lighthouse\.spec\.ts/,
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /lighthouse\.spec\.ts/,
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: /lighthouse\.spec\.ts/,
    },

    /* Lighthouse audits only work against Chromium (CDP connection) and manage
     * their own browser context (see tests/lighthouse.spec.ts), so this project
     * intentionally does not use devices['Desktop Chrome'] / launchOptions. */
    {
      name: 'lighthouse',
      testMatch: /lighthouse\.spec\.ts/,
      // One test runs a full Lighthouse audit (~20-30s each) against 3
      // dashboard pages in sequence - past the default 30s test timeout.
      timeout: 2 * 60 * 1000,
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI, 
    cwd: path.join(__dirname, '../../client'),
    timeout: 120_000, 
  },
});
