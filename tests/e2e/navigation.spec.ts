import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('main navigation links work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test Products navigation
    await page.getByRole('link', { name: /products/i }).first().click();
    await expect(page).toHaveURL(/.*\/products/);
    
    // Test About navigation
    await page.goto('/');
    await page.getByRole('link', { name: /about/i }).first().click();
    await expect(page).toHaveURL(/.*\/about/);
    
    // Test Contact navigation
    await page.goto('/');
    await page.getByRole('link', { name: /contact/i }).first().click();
    await expect(page).toHaveURL(/.*\/contact/);
  });

  test('hero section navigation buttons work', async ({ page }) => {
    await page.goto('/');

    // Test Shop Crystal Necklaces button
    const shopButton = page.getByRole('link', { name: /shop crystal necklaces/i });
    await shopButton.click();
    await expect(page).toHaveURL(/.*\/products/);

    // Go back and test Our Story button
    await page.goto('/');
    const storyButton = page.getByRole('link', { name: /our story/i });
    await storyButton.click();
    await expect(page).toHaveURL(/.*\/about/);
  });

  test('404 page handling', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.locator('h1')).toContainText(/not found/i);
  });

  test('back button functionality', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /products/i }).first().click();
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile navigation elements are accessible
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });
});
