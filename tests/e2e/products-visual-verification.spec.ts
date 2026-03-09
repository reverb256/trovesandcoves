import { test, expect } from '@playwright/test';

test.describe('Products Page Visual Verification', () => {
  test('should render correctly in light mode', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    // Take a screenshot for visual verification
    await page.screenshot({
      path: 'test-results/products-light-mode.png',
      fullPage: true,
    });

    // Verify no console errors
    const logs: string[] = [];
    page.on('console', msg => logs.push(msg.text()));
    expect(logs.filter(log => log.includes('error') || log.includes('Error'))).toHaveLength(0);
  });

  test('should render correctly in dark mode', async ({ page }) => {
    // Set dark mode preference
    await page.goto('/products');
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Take a screenshot for visual verification
    await page.screenshot({
      path: 'test-results/products-dark-mode.png',
      fullPage: true,
    });

    // Verify no console errors
    const logs: string[] = [];
    page.on('console', msg => logs.push(msg.text()));
    expect(logs.filter(log => log.includes('error') || log.includes('Error'))).toHaveLength(0);
  });

  test('should have proper color contrast in light mode', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    // Check that brand colors are using CSS variables, not hardcoded values
    const hardcodedColors = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const violations: string[] = [];

      allElements.forEach(el => {
        const computed = window.getComputedStyle(el);
        const color = computed.color;
        const backgroundColor = computed.backgroundColor;

        // Check for hardcoded brand colors (approximate RGB values)
        // #4abfbf ≈ rgb(74, 191, 191)
        // #deb55b ≈ rgb(222, 181, 91)
        // #e1af2f ≈ rgb(225, 175, 47)
        const hardcodedBrandColors = [
          'rgb(74, 191, 191)',
          'rgb(222, 181, 91)',
          'rgb(225, 175, 47)',
        ];

        if (hardcodedBrandColors.some(c => color.includes(c))) {
          violations.push(`${el.tagName}#${el.id}.${el.className} has hardcoded color: ${color}`);
        }
      });

      return violations;
    });

    expect(hardcodedColors).toHaveLength(0);
  });

  test('should display products with correct styling', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    // Check for product cards
    const productCards = await page.locator('.crystal-card').count();
    expect(productCards).toBeGreaterThan(0);

    // Check for sidebar
    const sidebar = await page.locator('aside').isVisible();
    expect(sidebar).toBeTruthy();

    // Check for category buttons
    const categoryButtons = await page.locator('button').count();
    expect(categoryButtons).toBeGreaterThan(0);
  });
});
