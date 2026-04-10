import { test } from '@playwright/test';

test.describe('Console Errors', () => {
  test('check homepage console', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('http://localhost:4322/');

    // Wait a bit for any delayed errors
    await page.waitForTimeout(2000);

    console.log(
      'Page height:',
      await page.evaluate(() => document.body.scrollHeight)
    );
    console.log('Console errors:', errors);

    // Count how many elements with certain classes exist
    const heroCount = await page.locator('.page-section-hero').count();
    const productCards = await page.locator('a[href^="/product/"]').count();

    console.log('Hero sections:', heroCount);
    console.log('Product cards:', productCards);
  });
});
