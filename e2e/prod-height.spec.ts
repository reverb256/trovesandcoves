import { test } from '@playwright/test';

test.describe('Production Height Debug', () => {
  test('check production page height', async ({ page }) => {
    await page.goto('http://localhost:4323/');

    const heights = await page.evaluate(() => {
      const results: Array<{ tag: string; classes: string; height: number }> =
        [];

      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const height = rect.height;
        if (height > 500) {
          results.push({
            tag: el.tagName,
            classes: el.className,
            height: Math.round(height),
          });
        }
      });

      return results.sort((a, b) => b.height - a.height).slice(0, 10);
    });

    console.log('Production page tallest elements:');
    heights.forEach((h, i) => {
      console.log(`${i + 1}. ${h.tag} (${h.height}px): class="${h.classes}"`);
    });

    console.log(
      `Total page height: ${await page.evaluate(() => document.body.scrollHeight)}px`
    );
  });
});
