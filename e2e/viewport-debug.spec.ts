import { test } from '@playwright/test';

test.describe('Viewport Debug', () => {
  test('check viewport and computed styles', async ({ page }) => {
    await page.goto('http://localhost:4323/');
    await page.setViewportSize({ width: 1280, height: 720 });

    const info = await page.evaluate(() => {
      const grid = document.querySelector('.grid.grid-cols-1');
      return {
        viewportWidth: window.innerWidth,
        computedGridDisplay: grid
          ? getComputedStyle(grid).display
          : 'not found',
        computedGridCols: grid
          ? getComputedStyle(grid).gridTemplateColumns
          : 'not found',
        gridClass: grid?.className || 'not found',
      };
    });

    console.log('Viewport info:', JSON.stringify(info, null, 2));

    // Now force a resize
    await page.setViewportSize({ width: 1400, height: 900 });

    const info2 = await page.evaluate(() => {
      const grid = document.querySelector('.grid.grid-cols-1');
      return {
        viewportWidth: window.innerWidth,
        computedGridCols: grid
          ? getComputedStyle(grid).gridTemplateColumns
          : 'not found',
      };
    });

    console.log('After resize to 1400px:', JSON.stringify(info2, null, 2));
  });
});
