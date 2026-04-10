import { test } from '@playwright/test';

test.describe('Width Debug', () => {
  test('check grid column widths', async ({ page }) => {
    await page.goto('http://localhost:4322/');

    const widths = await page.evaluate(() => {
      const grid = document.querySelector('.grid.grid-cols-1');
      if (!grid) return { error: 'Grid not found' };

      const firstItem = grid.querySelector('a');
      const firstContainer = grid.querySelector('.relative.overflow-hidden');
      const gridWidth = grid.getBoundingClientRect().width;

      return {
        gridWidth: Math.round(gridWidth),
        itemWidth: firstItem
          ? Math.round(firstItem.getBoundingClientRect().width)
          : 0,
        containerWidth: firstContainer
          ? Math.round(firstContainer.getBoundingClientRect().width)
          : 0,
        containerPaddingTop: firstContainer
          ? parseInt(getComputedStyle(firstContainer).paddingTop)
          : 0,
        imgWidth: firstContainer
          ? Math.round(
              firstContainer.querySelector('img')?.getBoundingClientRect()
                .width || 0
            )
          : 0,
        imgHeight: firstContainer
          ? Math.round(
              firstContainer.querySelector('img')?.getBoundingClientRect()
                .height || 0
            )
          : 0,
      };
    });

    console.log('Grid dimensions:', JSON.stringify(widths, null, 2));
  });
});
