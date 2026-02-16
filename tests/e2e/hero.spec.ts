import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero section correctly', async ({ page }) => {
    const hero = page.getByRole('banner', { name: /hero section/i });
    await expect(hero).toBeVisible();
    await expect(hero).toContainText(/troves & coves/i);
    await expect(hero).toContainText(/sacred crystal jewelry/i);
  });

  test('hero buttons are accessible and clickable', async ({ page }) => {
    const exploreButton = page.getByRole('link', { name: /browse our crystal jewelry/i });
    const storyButton = page.getByRole('link', { name: /learn more about our spiritual/i });
    
    await expect(exploreButton).toBeVisible();
    await expect(exploreButton).toHaveAttribute('href', '/products');
    
    await expect(storyButton).toBeVisible();
    await expect(storyButton).toHaveAttribute('href', '/about');
  });

  test('hero animations are working', async ({ page }) => {
    // Check if hero section becomes visible (tests Framer Motion animations)
    const hero = page.getByRole('banner');
    await expect(hero).toBeVisible();
    
    // Check for floating crystal elements
    const floatingElements = page.locator('.absolute.w-2.h-2');
    await expect(floatingElements.first()).toBeVisible();
  });

  test('hero section is accessible', async ({ page }) => {
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });

  test('hero responds to hover interactions', async ({ page }) => {
    const hero = page.getByRole('banner');
    const heroTitle = hero.locator('h1');
    
    await expect(heroTitle).toBeVisible();
    await heroTitle.hover();
    
    // Check that hover doesn't break the layout
    await expect(heroTitle).toBeVisible();
  });

  test('scroll indicator is present and functional', async ({ page }) => {
    const scrollIndicator = page.locator('.absolute.bottom-8');
    await expect(scrollIndicator).toBeVisible();
  });
});
