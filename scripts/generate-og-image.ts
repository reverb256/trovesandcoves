/**
 * Generate Open Graph image from actual Hero component
 *
 * This captures your live Hero section as a screenshot
 * Perfect for keeping social previews in sync with your design
 *
 * Run: npm run generate:og-image
 */

import { chromium } from 'playwright';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

async function generateOgImage({
  width = OG_WIDTH,
  height = OG_HEIGHT,
  outputPath = 'client/public/og-image.jpg',
  baseUrl = 'http://localhost:5173',
}: {
  width?: number;
  height?: number;
  outputPath?: string;
  baseUrl?: string;
} = {}) {
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }, // Use larger viewport
    deviceScaleFactor: 2, // Retina quality
  });

  const page = await context.newPage();

  console.log(`📸 Navigating to ${baseUrl}...`);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  // Wait for fonts to load - this is crucial for correct rendering
  console.log('⏳ Waiting for fonts and content...');

  // Wait for document.fonts.ready
  await page.evaluate(() => {
    return document.fonts.ready.then(() => {
      // Additional delay to ensure fonts are fully applied
      return new Promise(resolve => setTimeout(resolve, 500));
    });
  });

  // Wait for React to hydrate and Hero to be visible
  await page.waitForSelector('section[aria-label="Welcome"]', {
    timeout: 10000,
  });

  // Wait for theme to be applied
  await page.waitForFunction(
    () => {
      const html = document.documentElement;
      return (
        html.classList.contains('light') || html.classList.contains('dark')
      );
    },
    { timeout: 5000 }
  );

  // Force light theme for consistent og:image
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');
  });

  // Wait for styles to settle after theme change
  await page.waitForTimeout(500);

  // Find the Hero section
  const hero = page.locator('section[aria-label="Welcome"]').first();

  if (!(await hero.count())) {
    throw new Error('Hero section not found!');
  }

  console.log('📸 Capturing Hero section...');

  // Get the bounding box of the Hero section
  const box = await hero.boundingBox();
  if (!box) {
    throw new Error('Could not get Hero bounding box!');
  }

  console.log(
    `📐 Hero section size: ${Math.round(box.width)}x${Math.round(box.height)}`
  );

  // Screenshot the Hero section (it will use the section's actual size)
  await hero.screenshot({
    path: outputPath,
    type: 'jpeg',
    quality: 90,
  });

  await browser.close();
  console.log(`✅ Generated ${outputPath}`);
}

// CLI entry point
const args = process.argv.slice(2);
const baseUrl = args.find(a => a.startsWith('--url='))?.split('=')[1];

if (import.meta.url === `file://${process.argv[1]}`) {
  generateOgImage({ baseUrl }).catch(err => {
    console.error('❌ Failed to generate og:image:', err);
    process.exit(1);
  });
}

export { generateOgImage };
