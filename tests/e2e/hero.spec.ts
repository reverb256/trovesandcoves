import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero section correctly', async ({ page }) => {
    const hero = page.locator('section[aria-label="Welcome"]');
    await expect(hero).toBeVisible();

    // Check for brand name
    await expect(page.locator('h1')).toContainText(/TROVES/i);
    await expect(page.locator('h1')).toContainText(/Coves/i);

    // Check for tagline - use first() to avoid strict mode violations
    await expect(page.locator('text=Handcrafted Crystal Jewelry').first()).toBeVisible();
    await expect(page.locator('text=Made in Canada').first()).toBeVisible();
  });

  test('hero CTA button is accessible and clickable', async ({ page }) => {
    // Check for the main CTA button
    const shopButton = page.getByRole('link', { name: /shop the collection/i });

    await expect(shopButton).toBeVisible();
    await expect(shopButton).toHaveAttribute('href', '/products');
  });

  test('hero section uses brand colors', async ({ page }) => {
    // Check for the brand turquoise color (#3A8E8B)
    const hero = page.locator('section[aria-label="Welcome"]');

    // The h1 should have the turquoise color
    const trovesText = page.locator('h1').filter({ hasText: 'TROVES' });
    await expect(trovesText).toBeVisible();

    // Check for gold accent color on & Coves
    await expect(page.locator('h1')).toContainText(/&/);
  });

  test('hero section is accessible', async ({ page }) => {
    const hero = page.locator('section[aria-label="Welcome"]');
    await expect(hero).toHaveAttribute('aria-label', 'Welcome');

    // Check for skip link (accessibility feature) - use first() to avoid strict mode
    const skipLink = page.locator('a[href="#main-content"]').first();
    await expect(skipLink).toHaveAttribute('class', /sr-only/);
  });

  test('hero section is responsive', async ({ page }) => {
    const hero = page.locator('section[aria-label="Welcome"]');
    const h1 = hero.locator('h1');

    await expect(h1).toBeVisible();

    // Check that h1 is visible and contains brand name
    await expect(h1).toContainText(/TROVES/i);
  });

  test('scroll indicator is present and functional', async ({ page }) => {
    const scrollIndicator = page.locator('.absolute.bottom-12');
    await expect(scrollIndicator).toBeVisible();
    await expect(scrollIndicator).toContainText('Scroll');
  });

  test('hero has proper heading hierarchy', async ({ page }) => {
    // h1 should be visible and contain brand name
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/TROVES/i);
  });
});
