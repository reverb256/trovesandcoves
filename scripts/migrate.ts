#!/usr/bin/env node
/**
 * Database Migration Script
 *
 * This script creates the database schema using Drizzle ORM.
 *
 * Usage:
 *   DATABASE_URL=postgresql://... node scripts/migrate.ts
 *
 * Environment Variables:
 *   DATABASE_URL - PostgreSQL connection string (required)
 */

import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '../server/db-storage';

async function main() {
  console.log('🔧 Running database migrations...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set.');
    console.error('Please set DATABASE_URL to run migrations.');
    console.error('\nExample:');
    console.error('  DATABASE_URL=postgresql://user:password@localhost:5432/trovesandcoves npm run migrate');
    process.exit(1);
  }

  try {
    console.log('📦 Migrating database schema...');

    // Run migrations
    await migrate(db, { migrationsFolder: 'drizzle' });

    console.log('✅ Migration completed successfully!');
    console.log('\n📊 Database schema created:');
    console.log('  - users');
    console.log('  - categories');
    console.log('  - products');
    console.log('  - cart_items');
    console.log('  - orders');
    console.log('  - order_items');
    console.log('  - contact_submissions');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
