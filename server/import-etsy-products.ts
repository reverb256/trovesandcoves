/**
 * Simple Etsy Product Import Script
 *
 * Usage:
 * 1. Copy your Etsy product data into etsy-products.json
 * 2. Run: npx tsx server/import-etsy-products.ts
 *
 * Etsy Product Data Format:
 * {
 *   "title": "Handmade Turquoise Necklace",
 *   "description": "Beautiful turquoise...",
 *   "price": "88.00",
 *   "imageUrl": "https://i.etsystatic.com/...",
 *   "category": "Necklaces",
 *   "materials": ["Turquoise", "Lapis Lazuli"],
 *   "gemstones": ["Turquoise"],
 *   "inStock": true,
 *   "sku": "ETSY-001"
 * }
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Product } from '@shared/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ETSY_PRODUCTS_FILE = path.join(__dirname, '../etsy-products.json');
const SEED_FILE = path.join(__dirname, 'seed-etsy-products.ts');

// Example Etsy product data from your shop
const EXAMPLE_ETSY_PRODUCTS = [
  {
    title: "Handmade Turquoise Necklace, Lapis Lazuli, Pink Pearl, Leaf Pendant",
    description: "Handmade turquoise necklace featuring lapis lazuli and pink pearl with a delicate leaf pendant. Crafted with intention to empower your energy.",
    price: "88.00",
    imageUrl: "https://i.etsystatic.com/44567123/r/il/abcdef1234/abcd_efghij56_klmn.jpg",
    category: "Necklaces",
    materials: ["Turquoise", "Lapis Lazuli", "Pink Pearl", "Gold Plated"],
    gemstones: ["Turquoise", "Lapis Lazuli"],
    inStock: true,
    stockQuantity: 1,
    sku: "ETSY-TURQ-001"
  },
  {
    title: "Handwrapped Citrine Pearl Necklace Set, Heavy, Genuine Crystals",
    description: "Luxurious handwrapped citrine and pearl necklace set. Heavy, genuine crystals crafted with intention to attract abundance and confidence.",
    price: "260.00",
    imageUrl: "https://i.etsystatic.com/44567123/r/il/abcdef1234/abcd_efghij56_klmn.jpg",
    category: "Necklaces",
    materials: ["Citrine", "Pearl", "14K Gold Plated", "Wire"],
    gemstones: ["Citrine", "Pearl"],
    inStock: true,
    stockQuantity: 1,
    sku: "ETSY-CITR-001"
  },
  {
    title: "Large Raw Citrine Necklace with Turquoise Accent | One of a Kind Gift",
    description: "One-of-a-kind raw citrine necklace with turquoise accent. A powerful piece for transformation and abundance.",
    price: "166.00",
    imageUrl: "https://i.etsystatic.com/44567123/r/il/abcdef1234/abcd_efghij56_klmn.jpg",
    category: "Necklaces",
    materials: ["Raw Citrine", "Turquoise", "14K Gold Plated"],
    gemstones: ["Citrine", "Turquoise"],
    inStock: true,
    stockQuantity: 1,
    sku: "ETSY-RAW-001"
  },
  {
    title: "Handmade Lapis Lazuli, Smoky Quartz, Jade & Lava Stone Crystal Necklace",
    description: "Grounding and protective necklace combining lapis lazuli, smoky quartz, jade, and lava stone crystals.",
    price: "108.00",
    imageUrl: "https://i.etsystatic.com/44567123/r/il/abcdef1234/abcd_efghij56_klmn.jpg",
    category: "Necklaces",
    materials: ["Lapis Lazuli", "Smoky Quartz", "Jade", "Lava Stone", "Leather"],
    gemstones: ["Lapis Lazuli", "Smoky Quartz", "Jade", "Lava Stone"],
    inStock: true,
    stockQuantity: 1,
    sku: "ETSY-GROUND-001"
  },
  {
    title: "Lapis Lazuli, Wire wrapped Necklace, leather, Spiritual, Royal",
    description: "Royal lapis lazuli wire wrapped necklace on brown leather. Enhances psychic abilities and provides spiritual protection.",
    price: "78.00",
    imageUrl: "https://i.etsystatic.com/44567123/r/il/abcdef1234/abcd_efghij56_klmn.jpg",
    category: "Necklaces",
    materials: ["Lapis Lazuli", "Wire", "Leather"],
    gemstones: ["Lapis Lazuli"],
    inStock: true,
    stockQuantity: 1,
    sku: "ETSY-LAPIS-001"
  },
  {
    title: "Wire Wrapped Rose Quartz Pendant, Brown Leather Necklace",
    description: "Beautiful rose quartz pendant wire wrapped on brown leather cord. Promotes self-love and emotional healing.",
    price: "80.00",
    imageUrl: "https://i.etsystatic.com/44567123/r/il/abcdef1234/abcd_efghij56_klmn.jpg",
    category: "Necklaces",
    materials: ["Rose Quartz", "Wire", "Leather"],
    gemstones: ["Rose Quartz"],
    inStock: true,
    stockQuantity: 1,
    sku: "ETSY-ROSE-001"
  },
  {
    title: "Raw Pyrite Heart Pendant Necklace, 14K Gold Plated, Reiki Infused",
    description: "Raw pyrite heart pendant on 14K gold plated chain. Reiki infused for wealth and good luck energy.",
    price: "111.00",
    imageUrl: "https://i.etsystatic.com/44567123/r/il/abcdef1234/abcd_efghij56_klmn.jpg",
    category: "Necklaces",
    materials: ["Pyrite", "14K Gold Plated", "Chain"],
    gemstones: ["Pyrite"],
    inStock: true,
    stockQuantity: 1,
    sku: "ETSY-PYRITE-001"
  },
  {
    title: "Upcycled Enamel Flower Pendant, 14k Gold Filled Chain Necklace",
    description: "Unique upcycled enamel flower pendant on 14k gold filled chain. Sustainable and beautiful.",
    price: "111.00",
    imageUrl: "https://i.etsystatic.com/44567123/r/il/abcdef1234/abcd_efghij56_klmn.jpg",
    category: "Necklaces",
    materials: ["Enamel Flower", "14K Gold Filled", "Chain"],
    gemstones: [],
    inStock: true,
    stockQuantity: 1,
    sku: "ETSY-ENAMEL-001"
  },
  {
    title: "Handmade Lapis Lazuli Necklace, Brown Leather Cord, Men's Jewelry",
    description: "Bold lapis lazuli necklace on brown leather cord. Perfect for men - enhances wisdom and truth.",
    price: "78.00",
    imageUrl: "https://i.etsystatic.com/44567123/r/il/abcdef1234/abcd_efghij56_klmn.jpg",
    category: "Necklaces",
    materials: ["Lapis Lazuli", "Leather"],
    gemstones: ["Lapis Lazuli"],
    inStock: true,
    stockQuantity: 1,
    sku: "ETSY-MENS-001"
  },
  {
    title: "Turquoise, Lapis Lazuli, Pearl strung, Hematite, healing crystals",
    description: "Powerful combination necklace with turquoise, lapis lazuli, pearls, and hematite. Supports social connections and spirit guide communication.",
    price: "88.00",
    imageUrl: "https://i.etsystatic.com/44567123/r/il/abcdef1234/abcd_efghij56_klmn.jpg",
    category: "Necklaces",
    materials: ["Turquoise", "Lapis Lazuli", "Pearl", "Hematite", "Wire"],
    gemstones: ["Turquoise", "Lapis Lazuli", "Hematite"],
    inStock: true,
    stockQuantity: 1,
    sku: "ETSY-SOCIAL-001"
  }
];

// Category mapping - add your Etsy categories here
const CATEGORY_MAP: Record<string, string> = {
  "Necklaces": "necklaces",
  "Bracelets": "bracelets",
  "Earrings": "earrings",
  "Rings": "rings"
};

function etsyProductToDbProduct(etsy: typeof EXAMPLE_ETSY_PRODUCTS[0], index: number): Product {
  const categoryId = Object.keys(CATEGORY_MAP).find(
    cat => etsy.category.includes(cat)
  );

  const now = new Date();
  return {
    id: 1000 + index, // Start from 1000 to avoid conflicts with existing products
    name: etsy.title,
    description: etsy.description,
    price: etsy.price,
    imageUrl: etsy.imageUrl,
    imageUrls: [etsy.imageUrl],
    category: categoryId ? (CATEGORY_MAP[categoryId] as any) : null,
    categoryId: categoryId ? (categoryId === "Necklaces" ? 1 : categoryId === "Bracelets" ? 2 : 1) : 1,
    materials: etsy.materials || [],
    gemstones: etsy.gemstones || [],
    inStock: etsy.inStock ?? true,
    stockQuantity: etsy.stockQuantity ?? 1,
    sku: etsy.sku || `ETSY-${index}`,
    isFeatured: index < 3, // First 3 items are featured
    createdAt: now
  };
}

async function generateSeedFile() {
  console.log('📦 Generating Etsy products seed file...\n');

  // Check if etsy-products.json exists
  if (fs.existsSync(ETSY_PRODUCTS_FILE)) {
    console.log('✅ Found etsy-products.json, using that data');
    const userData = JSON.parse(fs.readFileSync(ETSY_PRODUCTS_FILE, 'utf-8'));
    const products = userData.map((p: typeof EXAMPLE_ETSY_PRODUCTS[0], i: number) => etsyProductToDbProduct(p, i));

    const productsJson = JSON.stringify(products, null, 2);
    const seedContent = `
import type { Product } from '@shared/types';

export const ETSY_PRODUCTS: Product[] = ${productsJson} as unknown as Product[];
`;

    fs.writeFileSync(SEED_FILE, seedContent, 'utf-8');
    console.log(`\n✅ Generated ${products.length} products from etsy-products.json`);
  } else {
    console.log('⚠️  No etsy-products.json found, using example data\n');
    const products = EXAMPLE_ETSY_PRODUCTS.map((p, i) => etsyProductToDbProduct(p, i));

    const productsJson = JSON.stringify(products, null, 2);
    const seedContent = `
import type { Product } from '@shared/types';

export const ETSY_PRODUCTS: Product[] = ${productsJson} as unknown as Product[];
`;

    fs.writeFileSync(SEED_FILE, seedContent, 'utf-8');

    // Also create the template etsy-products.json
    fs.writeFileSync(
      ETSY_PRODUCTS_FILE,
      JSON.stringify(EXAMPLE_ETSY_PRODUCTS, null, 2),
      'utf-8'
    );

    console.log(`✅ Generated ${products.length} example products`);
    console.log(`\n📝 Created etsy-products.json template - edit with your real product data!`);
  }

  console.log(`\n✅ Seed file created: ${SEED_FILE}`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Edit etsy-products.json with your real Etsy product data`);
  console.log(`   2. Update server/storage.ts to import ETSY_PRODUCTS`);
  console.log(`   3. Restart the dev server`);
}

// Run the generator
generateSeedFile().catch(console.error);
