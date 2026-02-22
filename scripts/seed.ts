#!/usr/bin/env node
/**
 * Database Seeding Script
 *
 * This script populates the database with initial data for development and production.
 *
 * Usage:
 *   DATABASE_URL=postgresql://... npm run seed
 *
 * Environment Variables:
 *   DATABASE_URL - PostgreSQL connection string (required)
 */

import { db } from '../server/db-storage';
import * as schema from '../shared/schema';
import { eq } from 'drizzle-orm';

const mockCategories = [
  {
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Beautiful crystal necklaces handcrafted with intention and love',
    imageUrl: '/images/categories/necklaces.jpg',
  },
  {
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Energizing crystal bracelets for everyday wear',
    imageUrl: '/images/categories/bracelets.jpg',
  },
  {
    name: 'Rings',
    slug: 'rings',
    description: 'Crystal rings to balance your energy',
    imageUrl: '/images/categories/rings.jpg',
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    description: 'Healing crystal earrings for style and wellness',
    imageUrl: '/images/categories/earrings.jpg',
  },
  {
    name: 'Pendants',
    slug: 'pendants',
    description: 'Crystal pendants for focus and meditation',
    imageUrl: '/images/categories/pendants.jpg',
  },
  {
    name: 'Sets',
    slug: 'sets',
    description: 'Coordinating crystal jewelry sets',
    imageUrl: '/images/categories/sets.jpg',
  },
];

const mockProducts = [
  {
    name: 'Amethyst Tranquility Necklace',
    sku: 'TC-NECK-001',
    description: 'A calming amethyst pendant on sterling silver chain. Amethyst promotes peace, spiritual growth, and stress relief.',
    price: '89.00',
    stockQuantity: 15,
    weight: '12.00',
    materials: ['Sterling Silver', 'Amethyst'],
    gemstones: ['Amethyst'],
    isActive: true,
    isFeatured: true,
    categorySlug: 'necklaces',
    imageUrls: ['/images/products/amethyst-necklace-1.jpg', '/images/products/amethyst-necklace-2.jpg'],
    careInstructions: 'Clean with soft cloth. Avoid harsh chemicals. Remove before swimming or bathing.',
    imageUrl: '/images/products/amethyst-necklace-1.jpg',
  },
  {
    name: 'Rose Quartz Love Bracelet',
    sku: 'TC-BRACE-001',
    description: 'Gentle rose quartz beaded bracelet. Rose quartz is the stone of unconditional love and infinite peace.',
    price: '45.00',
    stockQuantity: 25,
    weight: '8.00',
    materials: ['Rose Quartz', 'Elastic Cord'],
    gemstones: ['Rose Quartz'],
    isActive: true,
    isFeatured: true,
    categorySlug: 'bracelets',
    imageUrls: ['/images/products/rose-quartz-bracelet-1.jpg'],
    careInstructions: 'Avoid water exposure. Clean with soft dry cloth.',
    imageUrl: '/images/products/rose-quartz-bracelet-1.jpg',
  },
  {
    name: 'Black Tourmaline Protection Ring',
    sku: 'TC-RING-001',
    description: 'Protective black tourmaline ring. Tourmaline is known for grounding and protection against negative energy.',
    price: '125.00',
    stockQuantity: 10,
    weight: '6.00',
    materials: ['Sterling Silver', 'Black Tourmaline'],
    gemstones: ['Black Tourmaline'],
    isActive: true,
    isFeatured: true,
    categorySlug: 'rings',
    imageUrls: ['/images/products/tourmaline-ring-1.jpg', '/images/products/tourmaline-ring-2.jpg'],
    careInstructions: 'Remove before washing hands. Polish regularly with silver cloth.',
    imageUrl: '/images/products/tourmaline-ring-1.jpg',
  },
  {
    name: 'Citrine Abundance Earrings',
    sku: 'TC-EARR-001',
    description: 'Joyful citrine drop earrings. Citrine attracts abundance, prosperity, and positive energy.',
    price: '55.00',
    stockQuantity: 20,
    weight: '5.00',
    materials: ['Gold Vermeil', 'Citrine'],
    gemstones: ['Citrine'],
    isActive: true,
    isFeatured: true,
    categorySlug: 'earrings',
    imageUrls: ['/images/products/citrine-earrings-1.jpg'],
    careInstructions: 'Keep away from harsh chemicals. Store in soft pouch when not wearing.',
    imageUrl: '/images/products/citrine-earrings-1.jpg',
  },
  {
    name: 'Clear Quartz Amplifier Pendant',
    sku: 'TC-PEND-001',
    description: 'Powerful clear quartz point pendant. Clear quartz amplifies the energy of other crystals and intentions.',
    price: '65.00',
    stockQuantity: 30,
    weight: '15.00',
    materials: ['Clear Quartz', 'Sterling Silver Bail'],
    gemstones: ['Clear Quartz'],
    isActive: true,
    isFeatured: true,
    categorySlug: 'pendants',
    imageUrls: ['/images/products/quartz-pendant-1.jpg', '/images/products/quartz-pendant-2.jpg'],
    careInstructions: 'Cleanse under running water and recharge in moonlight weekly.',
    imageUrl: '/images/products/quartz-pendant-1.jpg',
  },
  {
    name: 'Lapis Lazuli Wisdom Set',
    sku: 'TC-SET-001',
    description: 'Matching lapis lazuli necklace and bracelet set. Lapis lazuli enhances wisdom, truth, and self-expression.',
    price: '165.00',
    stockQuantity: 8,
    weight: '22.00',
    materials: ['Lapis Lazuli', 'Sterling Silver'],
    gemstones: ['Lapis Lazuli'],
    isActive: true,
    isFeatured: false,
    categorySlug: 'sets',
    imageUrls: ['/images/products/lapis-set-1.jpg'],
    careInstructions: 'Polish regularly with soft cloth. Avoid water and harsh chemicals.',
    imageUrl: '/images/products/lapis-set-1.jpg',
  },
];

async function seedCategories() {
  console.log('📁 Seeding categories...');

  for (const category of mockCategories) {
    try {
      await db.insert(schema.categories).values(category).onConflictDoNothing();
      console.log(`  ✓ ${category.name}`);
    } catch (error) {
      console.error(`  ✗ Failed to seed category: ${category.name}`, error);
    }
  }
}

async function seedProducts() {
  console.log('📦 Seeding products...');

  // Get category IDs
  const categories = await db.select().from(schema.categories);

  for (const product of mockProducts) {
    try {
      // Find category by slug
      const category = categories.find(c => c.slug === product.categorySlug);
      if (!category) {
        console.error(`  ✗ Failed to find category for product: ${product.name}`);
        continue;
      }

      // Remove categorySlug and add categoryId
      const { categorySlug, ...productData } = product;

      await db.insert(schema.products).values({
        ...productData,
        categoryId: category.id,
      }).onConflictDoNothing();

      console.log(`  ✓ ${product.name}`);
    } catch (error) {
      console.error(`  ✗ Failed to seed product: ${product.name}`, error);
    }
  }
}

async function main() {
  console.log('🌱 Seeding database with initial data...\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set.');
    console.error('Please set DATABASE_URL to run seed script.');
    console.error('\nExample:');
    console.error('  DATABASE_URL=postgresql://user:password@localhost:5432/trovesandcoves npm run seed');
    process.exit(1);
  }

  try {
    await seedCategories();
    console.log();
    await seedProducts();

    console.log('\n✅ Seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`  - ${mockCategories.length} categories`);
    console.log(`  - ${mockProducts.length} products`);
    console.log(`\n💡 Tip: Run 'npm run db:push' first if you haven't created the database schema yet.`);

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
