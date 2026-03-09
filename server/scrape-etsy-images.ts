/**
 * Scrape product image URLs from Etsy shop using system Chromium
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ETSY_SHOP_URL = 'https://www.etsy.com/ca/shop/TrovesandCoves';
const OUTPUT_FILE = path.join(__dirname, '../etsy-product-images.json');

interface ProductImage {
  title: string;
  imageUrl: string;
  listingUrl: string;
  price?: string;
}

async function scrapeEtsyImages() {
  console.log('🔍 Starting Etsy shop scrape...\n');

  // Use system Chromium
  const browser = await chromium.launch({
    channel: 'chrome',  // Try chrome channel first
    headless: false,   // Try non-headless to bypass bot detection
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  }).catch(async () => {
    // Fallback to system chromium path
    return await chromium.launch({
      executablePath: '/run/current-system/sw/bin/chromium',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  try {
    console.log(`📖 Navigating to ${ETSY_SHOP_URL}...`);
    await page.goto(ETSY_SHOP_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait for content to load
    console.log('⏳ Waiting for page content...');
    await page.waitForTimeout(5000);

    // Try scrolling to load lazy images
    console.log('📜 Scrolling page...');
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(1000);
    }

    // Take screenshot
    const screenshotPath = path.join(__dirname, '../etsy-shop-debug.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);

    // Extract images - try multiple approaches
    console.log('🔍 Extracting product images...\n');

    const products = await page.evaluate(() => {
      const results: ProductImage[] = [];

      // Method 1: Find all listing cards by looking for links containing /listing/
      const listingLinks = Array.from(document.querySelectorAll('a[href*="/listing/"]'));

      listingLinks.forEach((link) => {
        const anchor = link as HTMLAnchorElement;
        const href = anchor.href;

        // Skip if we already have this listing
        if (results.some(p => p.listingUrl === href)) return;

        // Find image in this card
        const img = anchor.querySelector('img') ||
                    anchor.parentElement?.querySelector('img') ||
                    anchor.closest('.wt-listing-card, [data-Listing-id]')?.querySelector('img');

        if (!img) return;

        const imgEl = img as HTMLImageElement;

        // Get image URL - try multiple attributes
        let imgUrl = imgEl.getAttribute('data-src') ||
                     imgEl.getAttribute('srcset')?.split(',').pop()?.trim().split(' ')[0] ||
                     imgEl.src;

        if (!imgUrl || !imgUrl.includes('etsystatic.com')) return;

        // Convert to full resolution
        imgUrl = imgUrl
          .replace(/_\d+x\d+\./, '_fullxfull.')
          .replace(/-\d+x\d+\./, '-fullxfull.');

        // Skip tiny images
        if (imgUrl.includes('75x75') || imgUrl.includes('100x100')) return;

        // Get title from alt text or nearby element
        const title = imgEl.alt ||
                      anchor.getAttribute('aria-label') ||
                      anchor.querySelector('[data-listing-title]')?.textContent ||
                      `Product ${results.length + 1}`;

        // Get price if available
        const priceEl = anchor.closest('.wt-listing-card, [data-Listing-id]')?.querySelector('[data-price]');
        const price = priceEl?.textContent?.trim() || undefined;

        results.push({
          title: title.trim(),
          imageUrl: imgUrl,
          listingUrl: href,
          price
        });
      });

      return results.slice(0, 10);
    });

    console.log(`✅ Found ${products.length} products\n`);

    // Display results
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   Image: ${product.imageUrl}`);
      console.log(`   Link: ${product.listingUrl}`);
      if (product.price) console.log(`   Price: ${product.price}`);
      console.log('');
    });

    // Save to JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`💾 Saved to ${OUTPUT_FILE}`);

    return products;

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

scrapeEtsyImages().catch(console.error);
