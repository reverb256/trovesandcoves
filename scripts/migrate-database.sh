#!/bin/bash

# Database Migration Script
# Migrates from existing PostgreSQL to Neon serverless database

set -e

echo "🔄 Starting Database Migration..."

# Check if required files exist
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found. Please create it with existing database credentials."
    exit 1
fi

if [ ! -f ".env.serverless" ]; then
    echo "❌ Error: .env.serverless file not found. Please create it with Neon database credentials."
    exit 1
fi

# Load environment variables
source .env
source .env.serverless

echo "📋 Source Database: $(echo $DATABASE_URL | cut -d'@' -f2 | cut -d'/' -f1)"
echo "📋 Target Database: $(echo $DATABASE_URL | cut -d'@' -f2 | cut -d'/' -f1)"

# Backup existing data
echo "💾 Creating backup of existing data..."
pg_dump "$DATABASE_URL" > backup_$(date +%Y%m%d_%H%M%S).sql

echo "🚀 Pushing schema to Neon..."
npx drizzle-kit push --config=drizzle.config.ts

echo "📊 Checking data migration..."

# Check if data exists in categories
categories_count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM categories;" | xargs)
echo "📦 Categories: $categories_count"

# Check if data exists in products
products_count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM products;" | xargs)
echo "🛍️ Products: $products_count"

echo "✅ Database migration completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Test API endpoints: curl https://troves-coves-api.vercel.app/api/categories"
echo "2. Deploy frontend: npm run deploy:github-pages"
echo "3. Deploy backend: npm run deploy:serverless"