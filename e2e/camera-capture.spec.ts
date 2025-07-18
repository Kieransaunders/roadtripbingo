import { test, expect } from '@playwright/test';

test.describe('Camera Capture Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForSelector('[data-testid="app-container"]', { timeout: 10000 });
  });

  test('should show consent dialog before camera access', async ({ page }) => {
    // Navigate to game screen (assuming there's a way to get there)
    await page.getByTestId('start-game-button').click();
    
    // Wait for game to load
    await page.waitForSelector('[data-testid="game-grid"]', { timeout: 10000 });
    
    // Click on a tile that should trigger camera
    await page.getByTestId('game-tile-0').click();
    
    // Should show consent dialog
    await expect(page.getByText('Consent Required')).toBeVisible();
    await expect(page.getByText('By sharing this image, you consent to it being posted on our Instagram')).toBeVisible();
    await expect(page.getByText('I Understand')).toBeVisible();
    await expect(page.getByText('Cancel')).toBeVisible();
  });

  test('should close camera when consent is denied', async ({ page }) => {
    // Navigate to game screen
    await page.getByTestId('start-game-button').click();
    await page.waitForSelector('[data-testid="game-grid"]', { timeout: 10000 });
    
    // Click on a tile that should trigger camera
    await page.getByTestId('game-tile-0').click();
    
    // Wait for consent dialog
    await expect(page.getByText('Consent Required')).toBeVisible();
    
    // Deny consent
    await page.getByText('Cancel').click();
    
    // Should return to game screen
    await expect(page.getByTestId('game-grid')).toBeVisible();
    await expect(page.getByText('Consent Required')).not.toBeVisible();
  });

  test('should show camera interface when consent is given', async ({ page }) => {
    // Mock camera permissions
    await page.context().grantPermissions(['camera']);
    
    // Navigate to game screen
    await page.getByTestId('start-game-button').click();
    await page.waitForSelector('[data-testid="game-grid"]', { timeout: 10000 });
    
    // Click on a tile that should trigger camera
    await page.getByTestId('game-tile-0').click();
    
    // Wait for consent dialog
    await expect(page.getByText('Consent Required')).toBeVisible();
    
    // Give consent
    await page.getByText('I Understand').click();
    
    // Should show camera interface
    await expect(page.getByTestId('camera-view')).toBeVisible();
    await expect(page.getByText('📸 Snap the Splat!')).toBeVisible();
    await expect(page.getByText('Cancel')).toBeVisible();
    await expect(page.getByText('Flip')).toBeVisible();
  });

  test('should handle camera controls correctly', async ({ page }) => {
    // Mock camera permissions
    await page.context().grantPermissions(['camera']);
    
    // Navigate to camera (assuming we can get there)
    await page.getByTestId('start-game-button').click();
    await page.waitForSelector('[data-testid="game-grid"]', { timeout: 10000 });
    await page.getByTestId('game-tile-0').click();
    
    // Give consent
    await page.getByText('I Understand').click();
    
    // Wait for camera interface
    await expect(page.getByTestId('camera-view')).toBeVisible();
    
    // Test cancel button
    await page.getByText('Cancel').click();
    await expect(page.getByTestId('game-grid')).toBeVisible();
    
    // Go back to camera
    await page.getByTestId('game-tile-0').click();
    await page.getByText('I Understand').click();
    
    // Test flip button (should still show camera)
    await page.getByText('Flip').click();
    await expect(page.getByTestId('camera-view')).toBeVisible();
  });

  test('should handle photo capture flow', async ({ page }) => {
    // Mock camera permissions
    await page.context().grantPermissions(['camera']);
    
    // Mock successful photo upload
    await page.route('**/api/upload', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ 
          success: true, 
          url: 'https://cloudinary.com/test.jpg',
          post_id: 'test-post-123'
        })
      });
    });
    
    // Navigate to camera
    await page.getByTestId('start-game-button').click();
    await page.waitForSelector('[data-testid="game-grid"]', { timeout: 10000 });
    await page.getByTestId('game-tile-0').click();
    
    // Give consent
    await page.getByText('I Understand').click();
    
    // Wait for camera interface
    await expect(page.getByTestId('camera-view')).toBeVisible();
    
    // Take photo
    await page.getByText('📸 Snap the Splat!').click();
    
    // Should show uploading state
    await expect(page.getByText('Uploading...')).toBeVisible();
    
    // Should show success message
    await expect(page.getByText('Success! 🎉')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Photo uploaded and posted to @deadaheadroadkill!')).toBeVisible();
  });

  test('should handle photo upload errors gracefully', async ({ page }) => {
    // Mock camera permissions
    await page.context().grantPermissions(['camera']);
    
    // Mock failed photo upload
    await page.route('**/api/upload', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Upload failed' })
      });
    });
    
    // Navigate to camera
    await page.getByTestId('start-game-button').click();
    await page.waitForSelector('[data-testid="game-grid"]', { timeout: 10000 });
    await page.getByTestId('game-tile-0').click();
    
    // Give consent
    await page.getByText('I Understand').click();
    
    // Wait for camera interface
    await expect(page.getByTestId('camera-view')).toBeVisible();
    
    // Take photo
    await page.getByText('📸 Snap the Splat!').click();
    
    // Should show uploading state
    await expect(page.getByText('Uploading...')).toBeVisible();
    
    // Should show error message
    await expect(page.getByText('Upload Failed 😞')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Try Again')).toBeVisible();
    await expect(page.getByText('Cancel')).toBeVisible();
  });

  test('should respect consent choice across camera sessions', async ({ page }) => {
    // Mock camera permissions
    await page.context().grantPermissions(['camera']);
    
    // Navigate to camera and give consent
    await page.getByTestId('start-game-button').click();
    await page.waitForSelector('[data-testid="game-grid"]', { timeout: 10000 });
    await page.getByTestId('game-tile-0').click();
    
    // Give consent
    await page.getByText('I Understand').click();
    
    // Wait for camera and go back
    await expect(page.getByTestId('camera-view')).toBeVisible();
    await page.getByText('Cancel').click();
    
    // Try to access camera again - should not show consent dialog
    await page.getByTestId('game-tile-1').click();
    
    // Should go straight to camera without consent dialog
    await expect(page.getByTestId('camera-view')).toBeVisible();
    await expect(page.getByText('Consent Required')).not.toBeVisible();
  });

  test('should handle camera permission denied gracefully', async ({ page }) => {
    // Don't grant camera permissions
    
    // Navigate to camera
    await page.getByTestId('start-game-button').click();
    await page.waitForSelector('[data-testid="game-grid"]', { timeout: 10000 });
    await page.getByTestId('game-tile-0').click();
    
    // Give consent
    await page.getByText('I Understand').click();
    
    // Should show permission request
    await expect(page.getByText('We need your permission to show the camera')).toBeVisible();
    await expect(page.getByText('Grant Permission')).toBeVisible();
  });
});
