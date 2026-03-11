import { test, expect } from '@playwright/test';

test.describe('Brand Redesign', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero renders with brand title and product cards', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const titleText = await h1.textContent();
    console.log('Hero title:', titleText?.substring(0, 50));

    // Check for brand elements
    await expect(page.locator('text=Handcrafted Crystal Jewelry')).toBeVisible();
    await expect(page.locator('text=Made in Canada')).toBeVisible();
  });

  test('turquoise color scheme is present', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for HSL turquoise values (174, 85%, 45%)
    const turquoiseElements = page.locator('[class*="174"]');
    const count = await turquoiseElements.count();
    console.log('Turquoise-accented elements:', count);
    expect(count).toBeGreaterThan(5);
  });

  test('products page shows product grid', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    const productLinks = page.locator('a[href^="/products/"]');
    const count = await productLinks.count();
    console.log('Products on listing page:', count);
    expect(count).toBeGreaterThan(0);
  });

  test('product detail has interactive elements', async ({ page }) => {
    await page.goto('/products/1');
    await page.waitForLoadState('networkidle');

    const addToCart = page.locator('button:has-text("Add to Cart")');
    await expect(addToCart).toBeVisible();

    const qtyButtons = page.locator('button:has-text("+"), button:has-text("-")');
    expect(await qtyButtons.count()).toBeGreaterThan(0);
  });

  test('footer has brand information', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    await expect(page.locator('text=Handcrafted in Winnipeg, Canada')).toBeVisible();
    await expect(page.locator('text=Handcrafted crystal jewelry')).toBeVisible();
  });

  test('navigation cart has aria-label', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const cartLink = page.locator('a[href="/checkout"]');
    await expect(cartLink).toHaveAttribute('href', '/checkout');

    const cartButton = page.locator('button[aria-label="Shopping cart"]');
    await expect(cartButton).toBeVisible();
  });
});
