import { test } from '@playwright/test';

test.describe('Debug Screenshots', () => {
  test('capture homepage', async ({ page }) => {
    await page.goto('http://localhost:4322/');
    await page.screenshot({ path: 'debug-homepage.png', fullPage: true });
    console.log('Screenshot saved: debug-homepage.png');
  });

  test('capture products page', async ({ page }) => {
    await page.goto('http://localhost:4322/products');
    await page.screenshot({ path: 'debug-products.png', fullPage: true });
    console.log('Screenshot saved: debug-products.png');
  });

  test('capture product detail', async ({ page }) => {
    await page.goto('http://localhost:4322/product/1');
    await page.screenshot({ path: 'debug-product-detail.png', fullPage: true });
    console.log('Screenshot saved: debug-product-detail.png');
  });

  test('capture about page', async ({ page }) => {
    await page.goto('http://localhost:4322/about');
    await page.screenshot({ path: 'debug-about.png', fullPage: true });
    console.log('Screenshot saved: debug-about.png');
  });
});
