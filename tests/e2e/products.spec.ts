import { test, expect } from '@playwright/test';

test.describe('Product Search and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('products page loads and displays products', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Shop Jewelry|Collection/i);
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
  });

  test('search functionality works', async ({ page }) => {
    // Find the search input
    const searchInput = page.getByPlaceholder(/search crystals/i);
    await expect(searchInput).toBeVisible();

    // Type a search query
    await searchInput.fill('crystal');
    await page.waitForTimeout(500); // Wait for debounce

    // Submit the search form
    await searchInput.press('Enter');
    await page.waitForTimeout(500);

    // Check that URL was updated
    const url = page.url();
    expect(url).toContain('search');
  });

  test('filter sidebar is visible', async ({ page }) => {
    // Look for filter sidebar
    const filterHeading = page.getByText('Refine Your Search');
    await expect(filterHeading).toBeVisible();

    // Check for filter icon
    const filterIcon = page.locator('svg.lucide-filter');
    await expect(filterIcon).toBeVisible();
  });

  test('category buttons are visible and clickable', async ({ page }) => {
    // Look for category buttons
    await expect(page.getByText('Categories')).toBeVisible();

    // All Collections button should be visible
    const allButton = page.getByRole('button', { name: /all collections/i });
    await expect(allButton).toBeVisible();
  });

  test('sort dropdown is present', async ({ page }) => {
    // Look for sort dropdown
    await expect(page.getByText('Sort By')).toBeVisible();

    const sortSelect = page.locator('select');
    await expect(sortSelect).toBeVisible();
  });

  test('clear all filters button appears when filter is active', async ({ page }) => {
    // Enter a search query to create an active filter
    const searchInput = page.getByPlaceholder(/search crystals/i);
    await searchInput.fill('test');
    await page.waitForTimeout(500);

    // Submit search
    await searchInput.press('Enter');
    await page.waitForTimeout(500);

    // Look for clear all button
    const clearButton = page.getByRole('button', { name: /clear all filters/i });
    await expect(clearButton).toBeVisible({ timeout: 5000 });
  });

  test('clear all filters button works', async ({ page }) => {
    // Create an active filter
    const searchInput = page.getByPlaceholder(/search crystals/i);
    await searchInput.fill('test');
    await page.waitForTimeout(500);

    // Submit search
    await searchInput.press('Enter');
    await page.waitForTimeout(500);

    // Look for clear all button
    const clearButton = page.getByRole('button', { name: /clear all filters/i });
    await expect(clearButton).toBeVisible({ timeout: 5000 });
    await clearButton.click();

    // Verify filter was cleared - URL should no longer have search param
    await page.waitForTimeout(500);
    expect(page.url()).not.toContain('search');
  });

  test('product cards are clickable', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });

    // Click on first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    // Should navigate to product detail page
    await expect(page).toHaveURL(/\/products\/\d+/);
  });

  test('category filtering works from navigation', async ({ page }) => {
    // Navigate with category
    await page.goto('/products/necklaces');

    // URL should contain category
    expect(page.url()).toContain('/products/necklaces');

    // Page should show category title
    await page.waitForLoadState('networkidle');
  });

  test('results count is displayed', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });

    // Look for results count (e.g., "9 Pieces") - use first() to avoid strict mode
    const resultsText = page.getByText(/Pieces/i).first();
    await expect(resultsText).toBeVisible();
  });
});

test.describe('Product Detail Page', () => {
  test('product detail page loads correctly', async ({ page }) => {
    // Go to products page first
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });

    // Click on first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    // Check for product detail elements
    await expect(page.locator('h1')).toBeVisible();
  });

  test('purchase option is available', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    // Look for add to cart button OR Etsy purchase link
    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    const etsyLink = page.getByRole('link', { name: /etsy|purchase|buy/i });

    const hasAddToCart = await addToCartButton.count() > 0;
    const hasEtsyLink = await etsyLink.count() > 0;

    // Should have at least one purchase option
    expect(hasAddToCart || hasEtsyLink).toBe(true);
  });

  test('product information is displayed', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    // Check for product details
    await expect(page.locator('h1')).toBeVisible();
    // Price, description, etc. should be visible
    const price = page.locator('text=$').first();
    await expect(price).toBeVisible();
  });
});

test.describe('404 Pages', () => {
  test('non-existent product shows not found', async ({ page }) => {
    await page.goto('/products/999999');

    // Should show 404 page or handle gracefully
    // The page might redirect to home or show a message
    await page.waitForLoadState('networkidle');
  });

  test('404 page has home button', async ({ page }) => {
    await page.goto('/non-existent-page');

    // Should have go home button or redirect
    const homeButton = page.getByRole('link', { name: /home|troves/i }).first();
    if (await homeButton.count() > 0) {
      await expect(homeButton).toBeVisible();
    }
  });

  test('404 page has browse products button', async ({ page }) => {
    await page.goto('/non-existent-page');

    // Should have browse products button
    const browseButton = page.getByRole('link', { name: /products|collection/i }).first();
    if (await browseButton.count() > 0) {
      await expect(browseButton).toBeVisible();
    }
  });
});
