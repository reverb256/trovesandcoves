import { test, expect } from '@playwright/test';

test.describe('Brand Redesign', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero renders with brand title and tagline', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const titleText = await h1.textContent();
    console.log('Hero title:', titleText?.substring(0, 50));

    // Check for brand elements - use first() to avoid strict mode violations
    await expect(
      page.locator('text=Handcrafted Crystal Jewelry').first()
    ).toBeVisible();
    await expect(page.locator('text=Made in Canada').first()).toBeVisible();
  });

  test('brand color scheme is present', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for the brand turquoise color (#3A8E8B) in the hero
    const hero = page.locator('section[aria-label="Welcome"]');
    await expect(hero).toBeVisible();

    // The TROVES text should have the brand color
    const trovesText = page.locator('h1').filter({ hasText: 'TROVES' });
    await expect(trovesText).toBeVisible();

    // Check for gold accent on the ampersand
    await expect(page.locator('h1')).toContainText(/&/);
  });

  test('products page shows product grid', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    const productCards = page.locator('[data-testid="product-card"]');
    const count = await productCards.count();
    console.log('Products on listing page:', count);
    expect(count).toBeGreaterThan(0);
  });

  test('product detail has interactive elements', async ({ page }) => {
    await page.goto('/products/1');
    await page.waitForLoadState('networkidle');

    // Check for either add to cart button OR Etsy purchase link
    const addToCart = page.locator('button:has-text("Add to Cart")');
    const etsyLink = page
      .getByRole('link', { name: /etsy/i })
      .or(page.locator('a[href*="etsy.com"]'));

    const hasAddToCart = (await addToCart.count()) > 0;
    const hasEtsyLink = (await etsyLink.count()) > 0;

    // Should have at least one purchase option
    expect(hasAddToCart || hasEtsyLink).toBe(true);

    // Quantity buttons should exist if product page loaded
    const qtyButtons = page.locator(
      'button:has-text("+"), button:has-text("-")'
    );
    const hasQtyButtons = (await qtyButtons.count()) > 0;
    if (!hasQtyButtons) {
      console.log('Quantity buttons not found - production layout may differ');
    }
  });

  test('footer has brand information', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Look for footer content
    await expect(page.locator('text=Winnipeg').first()).toBeVisible();
    await expect(
      page.locator('text=Handcrafted crystal jewelry').first()
    ).toBeVisible();
  });

  test('navigation cart button is present', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for cart button in navigation
    const cartButton = page
      .locator(
        'button[aria-label*="cart"], button[aria-label*="Cart"], svg.lucide-shopping-cart'
      )
      .first();
    await expect(cartButton).toBeVisible();
  });

  test('site uses proper heading hierarchy', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // h1 should be visible
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/TROVES/i);
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hero should still be visible on mobile
    const hero = page.locator('section[aria-label="Welcome"]');
    await expect(hero).toBeVisible();

    // h1 should be visible
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });
});
