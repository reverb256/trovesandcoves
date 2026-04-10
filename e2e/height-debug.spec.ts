import { test } from '@playwright/test';

test.describe('Height Debug', () => {
  test('find tallest elements', async ({ page }) => {
    await page.goto('http://localhost:4322/');

    const heights = await page.evaluate(() => {
      const results: Array<{
        tag: string;
        classes: string;
        height: number;
        id: string;
      }> = [];

      // Check all elements with significant height
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const height = rect.height;
        if (height > 500) {
          results.push({
            tag: el.tagName,
            classes: el.className,
            height: Math.round(height),
            id: el.id,
          });
        }
      });

      // Sort by height descending
      return results.sort((a, b) => b.height - a.height).slice(0, 20);
    });

    console.log('Tallest elements:');
    heights.forEach((h, i) => {
      console.log(
        `${i + 1}. ${h.tag} (${h.height}px): class="${h.classes}" id="${h.id}"`
      );
    });

    // Check body and main specifically
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const mainHeight = await page.evaluate(() => {
      const main = document.querySelector('main');
      return main ? main.scrollHeight : 0;
    });

    console.log(`Body height: ${bodyHeight}px`);
    console.log(`Main height: ${mainHeight}px`);
  });
});
