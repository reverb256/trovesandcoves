import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Troves & Coves/);
  });

  test('has navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header a[href="/"]')).toHaveCount(1);
    await expect(page.locator('header a[href="/products"]')).toBeVisible();
  });

  test('displays featured products', async ({ page }) => {
    await page.goto('/');
    const products = page.locator('main a[href^="/product/"]');
    await expect(products).toHaveCount(7); // 7 featured products
  });
});

test.describe('Products Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveTitle(/Shop All Products/);
  });

  test('displays all products', async ({ page }) => {
    await page.goto('/products');
    const products = page.locator('a[href^="/product/"]');
    await expect(products).toHaveCount(11); // 11 total products
  });
});

test.describe('Product Detail Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/product/1');
    await expect(page).toHaveTitle(/Lepidolite/);
  });

  test('has breadcrumb navigation', async ({ page }) => {
    await page.goto('/product/1');
    await expect(
      page.locator('main a[href="/products"]').first()
    ).toBeVisible();
  });

  test('displays product information', async ({ page }) => {
    await page.goto('/product/1');
    await expect(page.locator('main h1')).toContainText('Lepidolite');
    await expect(page.locator('main >> text=$90')).toBeVisible();
  });

  test('has purchase links', async ({ page }) => {
    await page.goto('/product/1');
    const etsyLink = page.locator('main a[href*="etsy.com"]');
    await expect(etsyLink).toBeVisible();
    await expect(etsyLink).toContainText('Purchase on Etsy');
  });
});

test.describe('About Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/About Us/);
  });

  test('displays brand story', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('main h2:has-text("Our Story")')).toBeVisible();
    await expect(page.locator('text=Troves & Coves was founded')).toBeVisible();
  });
});

test.describe('Contact Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle(/Contact Us/);
  });

  test('has contact form', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('has social media links', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('main a[href*="instagram.com"]')).toBeVisible();
    await expect(page.locator('main a[href*="facebook.com"]')).toBeVisible();
    await expect(page.locator('main a[href*="etsy.com"]')).toBeVisible();
  });
});

test.describe('404 Page', () => {
  test('displays for non-existent pages', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
  });

  test('has navigation back to home', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.locator('a[href="/"]')).toBeVisible();
    await expect(page.locator('a[href="/products"]')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('can navigate from home to products', async ({ page }) => {
    await page.goto('/');
    await page.click('header a[href="/products"]');
    await expect(page).toHaveURL(/\/products/);
    await expect(
      page.locator('main h2:has-text("Shop All Products")')
    ).toBeVisible();
  });

  test('can navigate from products to product detail', async ({ page }) => {
    await page.goto('/products');
    await page.click('main a[href="/product/1"]');
    await expect(page).toHaveURL(/\/product\/1/);
    await expect(page.locator('main h1')).toContainText('Lepidolite');
  });

  test('can navigate from product detail back to products', async ({
    page,
  }) => {
    await page.goto('/product/1');
    await page.click('main a[href="/products"]');
    await expect(page).toHaveURL(/\/products/);
  });
});

test.describe('Responsive Design', () => {
  test('homepage is mobile-friendly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    // Check that the page renders without horizontal scroll
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    const viewportWidth = page.viewportSize()?.width || 375;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });
});
