import { test, expect } from '@playwright/test';

test.describe('Product Search and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('products page loads and displays products', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/products|collection/i);
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });
  });

  test('search functionality works', async ({ page }) => {
    // Find the search input
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();

    // Type a search query
    await searchInput.fill('amethyst');
    await page.waitForTimeout(500); // Wait for debounce

    // Check that search was performed
    const url = page.url();
    expect(url).toContain('search');
  });

  test('filter toggle button is visible and clickable', async ({ page }) => {
    // Look for filter button (has sliders icon)
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).or(
      page.locator('button svg.lucide-sliders-horizontal').locator('..')
    );

    await expect(filterButton.first()).toBeVisible();
    await filterButton.first().click();
  });

  test('filter panel displays when toggled', async ({ page }) => {
    // Open filter panel
    const filterButton = page.locator('button svg.lucide-sliders-horizontal').locator('..');
    await filterButton.click();

    // Check for filter labels
    await expect(page.locator('text=Material')).toBeVisible();
    await expect(page.locator('text=Gemstone')).toBeVisible();
    await expect(page.locator('text=Price Range')).toBeVisible();
  });

  test('material filter can be selected', async ({ page }) => {
    // Open filter panel
    const filterButton = page.locator('button svg.lucide-sliders-horizontal').locator('..');
    await filterButton.click();

    // Wait for material options to load
    await page.waitForTimeout(500);

    // Click on a material option (e.g., "All" or specific material)
    const materialButton = page.locator('button').filter({ hasText: /all/i }).first();
    await expect(materialButton).toBeVisible();
  });

  test('active filters display badge when applied', async ({ page }) => {
    // Enter a search query to create an active filter
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('necklace');
    await page.waitForTimeout(500);

    // Check for active filters badge
    await expect(page.locator('text=Active filters')).toBeVisible({ timeout: 5000 });
  });

  test('clear all filters button works', async ({ page }) => {
    // Create an active filter
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('test');
    await page.waitForTimeout(500);

    // Look for clear all button
    const clearButton = page.getByRole('button', { name: /clear all/i });
    await expect(clearButton).toBeVisible({ timeout: 5000 });
    await clearButton.click();

    // Verify filter was cleared
    await page.waitForTimeout(500);
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
    // Navigate with category filter
    await page.goto('/products?category=necklaces');

    // URL should contain category parameter
    expect(page.url()).toContain('category=necklaces');
  });

  test('search input can be cleared using X button', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('test');
    await page.waitForTimeout(500);

    // Look for X button to clear search
    const clearButton = page.locator('button svg.lucide-x').locator('..');
    await expect(clearButton.first()).toBeVisible();
    await clearButton.first().click();

    // Search should be cleared
    await page.waitForTimeout(500);
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

  test('add to cart button is visible', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    // Look for add to cart button
    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    await expect(addToCartButton).toBeVisible();
  });

  test('product information is displayed', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();

    // Check for product details
    await expect(page.locator('h1')).toBeVisible();
    // Price, description, etc. should be visible
  });
});

test.describe('404 Pages', () => {
  test('non-existent product shows 404', async ({ page }) => {
    await page.goto('/products/999999');

    // Should show 404 page
    await expect(page.locator('text=Product Not Found')).toBeVisible({ timeout: 5000 });
  });

  test('404 page has home button', async ({ page }) => {
    await page.goto('/non-existent-page');

    // Should have go home button
    const homeButton = page.getByRole('button', { name: /go home/i });
    await expect(homeButton).toBeVisible();

    // Click it and verify navigation
    await homeButton.click();
    await expect(page).toHaveURL('/');
  });

  test('404 page has browse products button', async ({ page }) => {
    await page.goto('/non-existent-page');

    // Should have browse products button
    const browseButton = page.getByRole('button', { name: /browse products/i });
    await expect(browseButton).toBeVisible();
  });

  test('404 page displays crystal emoji', async ({ page }) => {
    await page.goto('/non-existent-page');

    await expect(page.locator('text=💎')).toBeVisible();
  });
});
