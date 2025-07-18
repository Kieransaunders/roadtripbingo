import { test as setup } from '@playwright/test';

setup('basic setup', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Wait for the app to load
  await page.waitForSelector('[data-testid="app-container"]', { timeout: 10000 });
  
  // Log that setup is complete
  console.log('E2E setup complete');
});
