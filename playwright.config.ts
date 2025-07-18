import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'e2e-results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:8081',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/setup.ts',
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 14'],
        viewport: { width: 390, height: 844 },
      },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Galaxy S9+'],
        viewport: { width: 412, height: 846 },
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run web',
    port: 8081,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
