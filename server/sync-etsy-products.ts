/**
 * Etsy Shop Product Synchronizer
 * Scrapes products from Etsy and syncs with local storage
 * Creates, updates, and removes products dynamically
 */

import { chromium } from 'playwright';
import type { MemStorage } from './storage.js';

const ETSY_SHOP_URL = 'https://www.etsy.com/ca/shop/TrovesandCoves';

interface EtsyProduct {
  title: string;
  description: string;
  imageUrl: string;
  imageUrls: string[];
  listingUrl: string;
  price: string;
  materials: string[];
  gemstones: string[];
  stockQuantity: number;
  category?: string;
  weight?: string;
  inStock: boolean;
}

/**
 * Scrape detailed product information from an Etsy listing page
 */
async function scrapeProductDetails(page: any, listingUrl: string): Promise<Partial<EtsyProduct>> {
  console.log(`  🔍 Scraping details for ${listingUrl}...`);

  try {
    await page.goto(listingUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    const details = await page.evaluate(() => {
      // Extract description
      const descEl = document.querySelector('[data-product-description] p, .wt-text-body-01.wt-break-word');
      const description = descEl?.textContent?.trim() || '';

      // Extract materials
      const materials: string[] = [];
      const materialTags = document.querySelectorAll('[data-material-tag], a[href*="/materials/"]');
      materialTags.forEach(tag => {
        const material = tag.textContent?.trim();
        if (material && !materials.includes(material)) {
          materials.push(material);
        }
      });

      // Extract all images
      const imageUrls: string[] = [];
      const images = document.querySelectorAll('img[src*="etsystatic.com"]');
      images.forEach(img => {
        const imgEl = img as HTMLImageElement;
        let url = imgEl.getAttribute('data-src') ||
                  imgEl.src ||
                  imgEl.getAttribute('srcset')?.split(',').pop()?.trim().split(' ')[0];

        if (url && url.includes('etsystatic.com') && !url.includes('75x75') && !url.includes('100x100')) {
          // Convert to full resolution
          url = url.replace(/_\d+x\d+\./, '_fullxfull.').replace(/-\d+x\d+\./, '-fullxfull.');
          if (!imageUrls.includes(url)) {
            imageUrls.push(url);
          }
        }
      });

      // Extract stock/inventory
      const stockEl = document.querySelector('[data-in-stock-quantity], .wt-text-title-small');
      const stockText = stockEl?.textContent || '';
      const stockMatch = stockText.match(/(\d+)\s*(in stock|available)/i);
      const stockQuantity = stockMatch ? parseInt(stockMatch[1]) : 1;
      const inStock = !stockText.toLowerCase().includes('out of stock');

      // Extract weight if available
      const weightEl = document.querySelector('[data-weight], .wt-text-body-secondary:has-text("gram")');
      const weightText = weightEl?.textContent || '';
      const weightMatch = weightText.match(/(\d+(?:\.\d+)?)\s*grams?/i);
      const weight = weightMatch ? `${weightMatch[1]} grams` : undefined;

      // Try to determine category from title/description
      const title = document.querySelector('h1, [data-product-title]')?.textContent?.toLowerCase() || '';
      const descLower = description.toLowerCase();

      let category: string | undefined;
      if (title.includes('necklace') || descLower.includes('necklace')) {
        category = 'necklaces';
      } else if (title.includes('bracelet') || descLower.includes('bracelet')) {
        category = 'bracelets';
      } else if (title.includes('earring') || descLower.includes('earring')) {
        category = 'earrings';
      } else if (title.includes('ring') || descLower.includes('ring')) {
        category = 'rings';
      }

      return {
        description,
        materials,
        imageUrls: imageUrls.slice(0, 5), // Max 5 images
        stockQuantity,
        inStock,
        weight,
        category
      };
    });

    return details;
  } catch (error) {
    console.error(`    ⚠️  Error scraping details: ${error}`);
    return {};
  }
}

/**
 * Scrape all products from the main Etsy shop page
 */
async function scrapeShopProducts(page: any): Promise<EtsyProduct[]> {
  console.log(`📖 Navigating to ${ETSY_SHOP_URL}...`);

  await page.goto(ETSY_SHOP_URL, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  console.log('⏳ Waiting for page content...');
  await page.waitForTimeout(5000);

  // Scroll to load lazy images
  console.log('📜 Scrolling page to load all products...');
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1500);
  }

  // Extract basic product info from shop page
  console.log('🔍 Extracting products from shop page...\n');

  const products = await page.evaluate(() => {
    const results: any[] = [];

    const listingLinks = Array.from(document.querySelectorAll('a[href*="/listing/"]'));

    listingLinks.forEach((link) => {
      const anchor = link as HTMLAnchorElement;
      const href = anchor.href;

      // Extract listing ID from URL
      const listingIdMatch = href.match(/\/listing\/(\d+)/);
      if (!listingIdMatch) return;

      const listingId = listingIdMatch[1];

      // Skip duplicates
      if (results.some(p => p.listingUrl === href)) return;

      // Find image in this card
      const card = anchor.closest('.wt-listing-card, [data-listing-id], [data-Listing-id]');
      const img = card?.querySelector('img') || anchor.querySelector('img');

      if (!img) return;

      const imgEl = img as HTMLImageElement;

      // Get image URL
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

      // Get title
      const title = imgEl.alt ||
                    anchor.getAttribute('aria-label') ||
                    card?.querySelector('[data-listing-title]')?.textContent ||
                    `Product ${results.length + 1}`;

      // Get price
      const priceEl = card?.querySelector('[data-price], .wt-text-title-lg');
      const price = priceEl?.textContent?.trim() || '0.00';

      // Parse numeric price
      const priceMatch = price.match(/[\$€£]?([\d,]+\.?\d*)/);
      const numericPrice = priceMatch ? priceMatch[1].replace(',', '') : '0.00';

      // Determine stock status
      const outOfStock = card?.textContent?.toLowerCase().includes('out of stock') || false;

      results.push({
        listingUrl: href,
        listingId,
        title: title.trim(),
        imageUrl: imgUrl,
        imageUrls: [imgUrl],
        price: numericPrice,
        stockQuantity: outOfStock ? 0 : 10,
        inStock: !outOfStock,
        description: '',
        materials: [],
        gemstones: []
      });
    });

    return results;
  });

  console.log(`✅ Found ${products.length} products on shop page\n`);
  return products;
}

/**
 * Generate URL-safe slug from product title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

/**
 * Sync Etsy products with local storage
 */
export async function syncEtsyProducts(storage: MemStorage): Promise<{
  added: number;
  updated: number;
  removed: number;
  total: number;
}> {
  console.log('🔄 Starting Etsy product synchronization...\n');

  let browser;
  let added = 0;
  let updated = 0;
  let removed = 0;

  try {
    // Launch browser
    browser = await chromium.launch({
      channel: 'chrome',
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }).catch(async () => {
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

    // Step 1: Scrape all products from shop page
    const etsyProducts = await scrapeShopProducts(page);

    // Step 2: Fetch detailed info for each product (limit to first 10 for speed)
    console.log('🔍 Fetching detailed product information...\n');

    const productsWithDetails: EtsyProduct[] = [];
    const detailLimit = Math.min(etsyProducts.length, 10);

    for (let i = 0; i < detailLimit; i++) {
      const product = etsyProducts[i];
      console.log(`[${i + 1}/${detailLimit}] ${product.title}`);

      const details = await scrapeProductDetails(page, product.listingUrl);

      productsWithDetails.push({
        ...product,
        ...details,
        imageUrls: details.imageUrls?.length ? details.imageUrls : [product.imageUrl]
      });

      console.log('');
    }

    // Step 3: Sync with storage
    console.log('💾 Syncing with local storage...\n');

    const currentProducts = await storage.getProducts();
    const etsyListingUrls = new Set(productsWithDetails.map(p => p.listingUrl));

    // Update or add products
    for (const etsyProduct of productsWithDetails) {
      // Check if product exists by listing URL
      const existingProduct = currentProducts.find(p =>
        p.listingUrl === etsyProduct.listingUrl
      );

      // Generate product ID and slug
      const slug = generateSlug(etsyProduct.title);
      const productId = existingProduct?.id || Date.now() + Math.floor(Math.random() * 1000);

      // Get or create category
      const categoryName = etsyProduct.category || 'Crystal Jewelry';
      const categories = await storage.getCategories();
      const category = categories.find((c: any) => c.slug === slug);
      const categoryId = category?.id || null;

      const productData = {
        id: productId,
        name: etsyProduct.title,
        description: etsyProduct.description || `Handcrafted ${etsyProduct.title.toLowerCase()}`,
        price: etsyProduct.price,
        imageUrl: etsyProduct.imageUrl,
        imageUrls: etsyProduct.imageUrls,
        category: categoryId ? { id: categoryId, name: categoryName, slug, description: '' } : null,
        categoryId: categoryId,
        slug,
        materials: etsyProduct.materials.length ? etsyProduct.materials : ['14k gold-plated', 'genuine crystals'],
        gemstones: etsyProduct.gemstones,
        weight: etsyProduct.weight,
        stockQuantity: etsyProduct.stockQuantity,
        inStock: etsyProduct.inStock,
        featured: true,
        listingUrl: etsyProduct.listingUrl,
        createdAt: existingProduct?.createdAt ? (typeof existingProduct.createdAt === 'string' ? new Date(existingProduct.createdAt) : existingProduct.createdAt) : new Date()
      };

      if (existingProduct) {
        // Update existing product
        await storage.updateProduct(productId, productData);
        updated++;
        console.log(`  ✓ Updated: ${etsyProduct.title}`);
      } else {
        // Add new product
        await storage.createProduct(productData);
        added++;
        console.log(`  + Added: ${etsyProduct.title}`);
      }
    }

    // Remove products that are no longer in Etsy
    const productsToRemove = currentProducts.filter(p =>
      p.listingUrl && !etsyListingUrls.has(p.listingUrl)
    );

    for (const product of productsToRemove) {
      await storage.deleteProduct(product.id);
      removed++;
      console.log(`  - Removed: ${product.name}`);
    }

    console.log('\n✅ Synchronization complete!');
    console.log(`   Added: ${added}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Removed: ${removed}`);
    const finalProducts = await storage.getProducts();
    console.log(`   Total products: ${finalProducts.length}`);

    return {
      added,
      updated,
      removed,
      total: finalProducts.length
    };

  } catch (error) {
    console.error('❌ Sync error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run if called directly
import { storage } from './storage.js';
syncEtsyProducts(storage).catch(console.error);
