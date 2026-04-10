/**
 * Dynamic Sitemap Generator
 *
 * This script generates sitemap.xml files dynamically based on:
 * - Static pages (home, about, contact, etc.)
 * - Product pages from storage.ts
 * - Category pages
 * - Legal pages (privacy, terms, etc.)
 *
 * Run this during build to ensure sitemap is always up-to-date.
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

// Configuration
const SITE_URL = 'https://trovesandcoves.ca';
const OUTPUT_DIR = join(process.cwd(), 'dist/public');

// Type definitions matching our storage
interface Product {
  id: string;
  name: string;
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority: number;
}

// Static pages with their priorities and change frequencies
const staticPages: SitemapEntry[] = [
  { url: '', priority: 1.0, changefreq: 'weekly' }, // Home
  { url: '/products', priority: 0.9, changefreq: 'daily' },
  { url: '/about', priority: 0.6, changefreq: 'monthly' },
  { url: '/contact', priority: 0.7, changefreq: 'monthly' },
  { url: '/checkout', priority: 0.8, changefreq: 'monthly' },
  { url: '/size-guide', priority: 0.5, changefreq: 'monthly' },
  { url: '/jewelry-care', priority: 0.5, changefreq: 'yearly' },
  { url: '/warranty', priority: 0.5, changefreq: 'yearly' },
  { url: '/returns', priority: 0.5, changefreq: 'yearly' },
  { url: '/financing', priority: 0.5, changefreq: 'yearly' },
  { url: '/privacy-policy', priority: 0.4, changefreq: 'yearly' },
];

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date | string | undefined): string {
  if (!date) return new Date().toISOString().split('T')[0];
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

// Helper function to generate XML for sitemap entry
function generateURLEntry(entry: SitemapEntry): string {
  const fullUrl = `${SITE_URL}${entry.url}`;
  const lastmod = entry.lastmod
    ? `    <lastmod>${entry.lastmod}</lastmod>\n`
    : '';
  const changefreq = entry.changefreq
    ? `    <changefreq>${entry.changefreq}</changefreq>\n`
    : '';
  const priority = `    <priority>${entry.priority.toFixed(1)}</priority>\n`;

  return `  <url>
    <loc>${fullUrl}</loc>
${lastmod}${changefreq}${priority}  </url>\n`;
}

// Helper function to generate product sitemap entries
function generateProductEntries(products: Product[]): string {
  return products
    .map(product => {
      const url = product.slug
        ? `/products/${product.slug}`
        : `/products/${product.id}`;
      const lastmod = formatDate(product.updatedAt || product.createdAt);
      const priority = 0.8;

      return generateURLEntry({
        url,
        lastmod,
        changefreq: 'weekly',
        priority,
      });
    })
    .join('');
}

// Helper function to generate category sitemap entries
function generateCategoryEntries(categories: Category[]): string {
  return categories
    .map(category => {
      const url = `/products/${category.slug}`;
      const priority = 0.7;

      return generateURLEntry({
        url,
        changefreq: 'weekly',
        priority,
      });
    })
    .join('');
}

// Main sitemap generation function
export async function generateSitemap(
  products: Product[],
  categories: Category[]
): Promise<string> {
  const entries: string[] = [];

  // Add XML declaration
  entries.push('<?xml version="1.0" encoding="UTF-8"?>');
  entries.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  // Add static pages
  staticPages.forEach(page => {
    entries.push(generateURLEntry(page));
  });

  // Add category pages
  entries.push(generateCategoryEntries(categories));

  // Add product pages
  entries.push(generateProductEntries(products));

  // Close urlset
  entries.push('</urlset>');

  return entries.join('\n');
}

// Helper to create sitemap index (for multiple sitemaps if needed)
export function generateSitemapIndex(sitemaps: string[]): string {
  const entries: string[] = [];

  entries.push('<?xml version="1.0" encoding="UTF-8"?>');
  entries.push(
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  );

  sitemaps.forEach(sitemap => {
    entries.push(`  <sitemap>
    <loc>${SITE_URL}/${sitemap}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
  </sitemap>`);
  });

  entries.push('</sitemapindex>');

  return entries.join('\n');
}

// CLI function to run the script
export async function run() {
  try {
    console.log('🗺️  Generating dynamic sitemap...');

    // Import products from storage
    // Note: MemStorage automatically seeds data in constructor
    const { MemStorage } = await import('../server/storage.ts');
    const storage = new MemStorage();

    // Get all products and categories
    const products = Array.from(await storage.getProducts());
    const categories = Array.from(await storage.getCategories());

    console.log(`   Found ${products.length} products`);
    console.log(`   Found ${categories.length} categories`);

    // Generate sitemap
    const sitemap = await generateSitemap(products, categories);

    // Write to output directory
    const outputPath = join(OUTPUT_DIR, 'sitemap.xml');
    writeFileSync(outputPath, sitemap, 'utf-8');

    console.log(`✅ Sitemap generated: ${outputPath}`);
    console.log(
      `   Total URLs: ${staticPages.length + categories.length + products.length}`
    );

    // Also generate a sitemap for images (if products have images)
    const imageSitemap = await generateImageSitemap(products);
    const imageSitemapPath = join(OUTPUT_DIR, 'sitemap-images.xml');
    writeFileSync(imageSitemapPath, imageSitemap, 'utf-8');
    console.log(`✅ Image sitemap generated: ${imageSitemapPath}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    throw error;
  }
}

// Helper to generate image sitemap
async function generateImageSitemap(products: Product[]): Promise<string> {
  const entries: string[] = [];

  entries.push('<?xml version="1.0" encoding="UTF-8"?>');
  entries.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  entries.push(
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
  );

  products.forEach(product => {
    const url = product.slug
      ? `/products/${product.slug}`
      : `/products/${product.id}`;

    // Note: You would need to add imageUrl to the Product type
    // For now, we'll just add the URL without images
    entries.push(`  <url>
    <loc>${SITE_URL}${url}</loc>
    <!-- Add image tags here when Product type includes imageUrl -->
  </url>`);
  });

  entries.push('</urlset>');

  return entries.join('\n');
}

// Run if called directly (ES module check)
const isMainModule =
  import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;

if (isMainModule) {
  run().catch(console.error);
}
