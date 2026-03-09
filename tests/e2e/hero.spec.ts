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
    await expect(hero).toContainText(/handcrafted crystal jewellery/i);
    await expect(hero).toContainText(/winnipeg's sacred crystal sanctuary/i);
  });

  test('hero buttons are accessible and clickable', async ({ page }) => {
    const exploreButton = page.getByRole('link', { name: /shop crystal necklaces/i });
    const storyButton = page.getByRole('link', { name: /our story/i });
    const guidanceButton = page.getByRole('link', { name: /get crystal guidance/i });

    await expect(exploreButton).toBeVisible();
    await expect(exploreButton).toHaveAttribute('href', '/products');

    await expect(storyButton).toBeVisible();
    await expect(storyButton).toHaveAttribute('href', '/about');

    await expect(guidanceButton).toBeVisible();
    await expect(guidanceButton).toHaveAttribute('href', '/contact');
  });

  test('hero animations are working', async ({ page }) => {
    // Check if hero section becomes visible
    const hero = page.getByRole('banner');
    await expect(hero).toBeVisible();

    // Check for floating diamond elements (blue turquoise diamonds)
    const floatingDiamonds = page.locator('.rotate-45');
    await expect(floatingDiamonds.first()).toBeVisible();

    // Check for decorative sparkles
    const sparkles = page.locator('text=✦');
    await expect(sparkles.first()).toBeVisible();
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
    await expect(scrollIndicator).toContainText('DISCOVER');
  });

  test('feature labels are displayed', async ({ page }) => {
    const hero = page.getByRole('banner');

    // Check for feature labels with icons
    await expect(hero).toContainText('Sacred Wire-Wrapping');
    await expect(hero).toContainText('Genuine Earth Crystals');
    await expect(hero).toContainText('Metaphysical Healing');
  });
});
