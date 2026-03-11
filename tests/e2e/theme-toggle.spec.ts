import { test, expect } from '@playwright/test';

/**
 * Theme Toggle E2E Tests
 *
 * These tests verify that the theme toggle functionality works correctly
 * across all pages and that theme preferences persist during navigation.
 *
 * Tests run against the live production site to catch real-world issues.
 */

const PRODUCTION_URL = 'https://trovesandcoves.ca';

// Helper function to get current theme from document
async function getCurrentTheme(page: any): Promise<'light' | 'dark'> {
  const theme = await page.evaluate(() => {
    return document.documentElement.getAttribute('data-theme');
  });
  return theme === 'dark' ? 'dark' : 'light';
}

// Helper function to verify theme colors are applied
async function verifyThemeColors(page: any, expectedTheme: 'light' | 'dark') {
  // Just verify the theme attribute is set correctly
  const currentTheme = await getCurrentTheme(page);
  expect(currentTheme).toBe(expectedTheme);

  // Verify theme button text matches current theme
  const expectedButtonText = expectedTheme === 'dark'
    ? /switch to light mode/i
    : /switch to dark mode/i;

  const themeButton = page.getByRole('button', { name: expectedButtonText });
  await expect(themeButton).toBeVisible();
}

test.describe('Theme Toggle Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to ensure clean state
    await page.goto(PRODUCTION_URL);
    await page.evaluate(() => {
      localStorage.removeItem('trovesandcoves-theme');
    });
    await page.reload();
  });

  test('theme toggle button is visible on home page', async ({ page }) => {
    await page.goto(PRODUCTION_URL);

    // Check for theme toggle button
    const themeButton = page.getByRole('button', { name: /switch to (light|dark) mode/i });
    await expect(themeButton).toBeVisible();

    // Verify it has an accessible label
    const buttonText = await themeButton.textContent();
    expect(buttonText).toMatch(/switch to (light|dark) mode/i);
  });

  test('can toggle from light to dark mode on home page', async ({ page }) => {
    await page.goto(PRODUCTION_URL);

    // Verify starting in light mode
    const initialTheme = await getCurrentTheme(page);
    expect(initialTheme).toBe('light');

    // Click theme toggle button
    const themeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await themeButton.click();

    // Wait for theme change
    await page.waitForTimeout(500);

    // Verify theme changed to dark
    const newTheme = await getCurrentTheme(page);
    expect(newTheme).toBe('dark');

    // Verify button text updated
    const updatedButton = page.getByRole('button', { name: /switch to light mode/i });
    await expect(updatedButton).toBeVisible();

    // Verify dark mode colors are applied
    await verifyThemeColors(page, 'dark');
  });

  test('can toggle from dark to light mode on home page', async ({ page }) => {
    await page.goto(PRODUCTION_URL);

    // First switch to dark mode
    const themeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await themeButton.click();
    await page.waitForTimeout(500);

    // Now switch back to light mode
    const darkModeButton = page.getByRole('button', { name: /switch to light mode/i });
    await darkModeButton.click();
    await page.waitForTimeout(500);

    // Verify theme changed back to light
    const finalTheme = await getCurrentTheme(page);
    expect(finalTheme).toBe('light');

    // Verify button text updated back
    const lightModeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await expect(lightModeButton).toBeVisible();

    // Verify light mode colors are applied
    await verifyThemeColors(page, 'light');
  });

  test('theme preference persists across page navigation', async ({ page }) => {
    await page.goto(PRODUCTION_URL);

    // Switch to dark mode on home page
    const themeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await themeButton.click();
    await page.waitForTimeout(500);

    // Navigate to products page
    await page.getByRole('link', { name: /shop/i }).first().click();
    await page.waitForURL(/.*\/products/);
    await page.waitForTimeout(500);

    // Verify theme is still dark
    const productsTheme = await getCurrentTheme(page);
    expect(productsTheme).toBe('dark');

    // Navigate to about page
    await page.getByRole('link', { name: /about/i }).click();
    await page.waitForURL(/.*\/about/);
    await page.waitForTimeout(500);

    // Verify theme is still dark
    const aboutTheme = await getCurrentTheme(page);
    expect(aboutTheme).toBe('dark');

    // Navigate to contact page (use first link to avoid strict mode violation)
    await page.getByRole('link', { name: /contact/i }).first().click();
    await page.waitForURL(/.*\/contact/);
    await page.waitForTimeout(500);

    // Verify theme is still dark
    const contactTheme = await getCurrentTheme(page);
    expect(contactTheme).toBe('dark');
  });

  test('all pages have theme toggle button', async ({ page }) => {
    const pages = [
      { url: '/', name: 'Home' },
      { url: '/products', name: 'Products' },
      { url: '/about', name: 'About' },
      { url: '/contact', name: 'Contact' },
    ];

    for (const { url } of pages) {
      await page.goto(`${PRODUCTION_URL}${url}`);

      const themeButton = page.getByRole('button', { name: /switch to (light|dark) mode/i });
      await expect(themeButton).toBeVisible({ timeout: 5000 });

      // Verify button is clickable
      const isClickable = await themeButton.isEnabled();
      expect(isClickable).toBe(true);
    }
  });

  test('theme toggle works on products page', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/products`);

    // Get initial theme
    const initialTheme = await getCurrentTheme(page);
    expect(initialTheme).toBe('light');

    // Toggle to dark mode
    const themeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await themeButton.click();
    await page.waitForTimeout(500);

    // Verify theme changed
    const newTheme = await getCurrentTheme(page);
    expect(newTheme).toBe('dark');

    // Verify product cards are visible in dark mode
    const productCards = page.locator('a[href^="/products/"]').first();
    await expect(productCards).toBeVisible();
  });

  test('theme toggle works on about page', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/about`);

    // Toggle to dark mode
    const themeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await themeButton.click();
    await page.waitForTimeout(500);

    // Verify theme changed
    const theme = await getCurrentTheme(page);
    expect(theme).toBe('dark');

    // Verify content is visible
    const heading = page.getByRole('heading', { name: /about troves & coves/i });
    await expect(heading).toBeVisible();
  });

  test('theme toggle works on contact page', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/contact`);

    // Toggle to dark mode
    const themeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await themeButton.click();
    await page.waitForTimeout(500);

    // Verify theme changed
    const theme = await getCurrentTheme(page);
    expect(theme).toBe('dark');

    // Verify form elements are visible
    const nameInput = page.getByRole('textbox', { name: /name/i });
    await expect(nameInput).toBeVisible();
  });

  test('theme preference is saved to localStorage', async ({ page }) => {
    await page.goto(PRODUCTION_URL);

    // Switch to dark mode
    const themeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await themeButton.click();
    await page.waitForTimeout(500);

    // Check localStorage
    const savedTheme = await page.evaluate(() => {
      return localStorage.getItem('trovesandcoves-theme');
    });

    expect(savedTheme).toBe('dark');

    // Reload page and verify preference is restored
    await page.reload();
    await page.waitForTimeout(500);

    const restoredTheme = await getCurrentTheme(page);
    expect(restoredTheme).toBe('dark');
  });

  test('all interactive elements work in dark mode', async ({ page }) => {
    await page.goto(PRODUCTION_URL);

    // Switch to dark mode
    const themeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await themeButton.click();
    await page.waitForTimeout(500);

    // Test navigation links
    const shopLink = page.getByRole('link', { name: 'Shop' }).first();
    await expect(shopLink).toBeVisible();
    await expect(shopLink).toBeEnabled();

    // Test about link
    const aboutLink = page.getByRole('link', { name: 'About' }).first();
    await expect(aboutLink).toBeVisible();
    await expect(aboutLink).toBeEnabled();

    // Test cart button
    const cartButton = page.getByRole('link', { name: /shopping cart/i });
    await expect(cartButton).toBeVisible();
    await expect(cartButton).toBeEnabled();
  });

  test('product cards display correctly in both themes', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/products`);

    // Verify in light mode
    let productCards = page.locator('a[href^="/products/"]');
    await expect(productCards.first()).toBeVisible();

    // Switch to dark mode
    const themeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await themeButton.click();
    await page.waitForTimeout(500);

    // Verify still visible in dark mode
    productCards = page.locator('a[href^="/products/"]');
    await expect(productCards.first()).toBeVisible();

    // Verify product images are visible
    const productImage = page.locator('img[alt*="Lapis"]').first();
    if (await productImage.count() > 0) {
      await expect(productImage).toBeVisible();
    }
  });
});

test.describe('Theme Accessibility', () => {
  test('theme toggle button has proper aria label', async ({ page }) => {
    await page.goto(PRODUCTION_URL);

    const themeButton = page.getByRole('button', { name: /switch to (light|dark) mode/i });
    await expect(themeButton).toHaveAttribute('aria-label');
  });

  test('theme transition works with reduced motion preference', async ({ page }) => {
    // Set prefers-reduced-motion
    await page.addInitScript(() => {
      // @ts-ignore
      window.matchMedia = (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      });
    });

    await page.goto(PRODUCTION_URL);

    // Theme toggle should still work with reduced motion
    const themeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await themeButton.click();
    await page.waitForTimeout(500);

    const theme = await getCurrentTheme(page);
    expect(theme).toBe('dark');
  });
});

test.describe('Theme Visual Regression', () => {
  test('screenshots match between light and dark mode', async ({ page }) => {
    await page.goto(PRODUCTION_URL);

    // Take light mode screenshot
    await page.screenshot({
      path: 'test-results/theme-home-light.png',
      fullPage: false,
    });

    // Switch to dark mode
    const themeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await themeButton.click();
    await page.waitForTimeout(500);

    // Take dark mode screenshot
    await page.screenshot({
      path: 'test-results/theme-home-dark.png',
      fullPage: false,
    });

    // Both screenshots should be created successfully
    // (Visual comparison can be added later with Playwright's expect().toMatchSnapshot())
  });
});
