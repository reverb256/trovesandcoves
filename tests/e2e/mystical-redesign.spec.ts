import { test, expect } from '@playwright/test';

test.describe('Mystical Crystal Chamber Redesign', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000');
  });

  test('hero renders with mystical title and crystal cards', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const titleText = await h1.textContent();
    console.log('Hero title:', titleText?.substring(0, 50));

    const crystalCards = page.locator('.crystal-card');
    const count = await crystalCards.count();
    console.log('Crystal cards on home:', count);
    expect(count).toBeGreaterThan(0);
  });

  test('mystical turquoise color scheme is present', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for HSL turquoise values (174, 85%, 45%)
    const turquoiseElements = page.locator('[class*="174"]');
    const count = await turquoiseElements.count();
    console.log('Turquoise-accented elements:', count);
    expect(count).toBeGreaterThan(5);
  });

  test('products page shows crystal grid', async ({ page }) => {
    await page.goto('http://localhost:5000/products');
    await page.waitForLoadState('networkidle');

    const products = page.locator('.crystal-card');
    const count = await products.count();
    console.log('Products on listing page:', count);
    expect(count).toBeGreaterThan(0);
  });

  test('product detail has mystical elements', async ({ page }) => {
    await page.goto('http://localhost:5000/products/1');
    await page.waitForLoadState('networkidle');

    const addToCart = page.locator('button:has-text("Add to Cart")');
    await expect(addToCart).toBeVisible();

    const qtyButtons = page.locator('button:has-text("+"), button:has-text("-")');
    expect(await qtyButtons.count()).toBeGreaterThan(0);
  });

  test('footer Crystal Circle newsletter exists', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const crystalCircle = page.locator('text=Crystal Circle');
    await expect(crystalCircle).toBeVisible();
  });

  test('navigation cart has aria-label', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const cartLink = page.locator('a[href="/checkout"]');
    await expect(cartLink).toHaveAttribute('href', '/checkout');

    const cartButton = page.locator('button[aria-label="Shopping cart"]');
    await expect(cartButton).toBeVisible();
  });
});
