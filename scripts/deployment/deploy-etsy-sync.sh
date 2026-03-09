#!/bin/bash
# Deploy Etsy Sync Worker to Cloudflare
#
# This worker syncs products from Etsy to KV storage on a schedule

set -e

echo "🔄 Deploying Etsy Sync Worker to Cloudflare..."
echo "=============================================="

# Check required environment variables
if [[ -z "$CLOUDFLARE_API_TOKEN" ]]; then
    echo "❌ Error: CLOUDFLARE_API_TOKEN is required"
    echo ""
    echo "📝 Set via GitHub Secrets:"
    echo "   1. Go to repo Settings > Secrets and variables > Actions"
    echo "   2. Click 'New repository secret'"
    echo "   3. Name: CLOUDFLARE_API_TOKEN"
    echo "   4. Get your token from: https://dash.cloudflare.com/profile/api-tokens"
    echo "   5. Required scopes: Account > Worker Scripts > Edit"
    exit 1
fi

if [[ -z "$CLOUDFLARE_ACCOUNT_ID" ]]; then
    echo "❌ Error: CLOUDFLARE_ACCOUNT_ID is required"
    echo ""
    echo "📝 Set via GitHub Secrets:"
    echo "   1. Go to repo Settings > Secrets and variables > Actions"
    echo "   2. Click 'New repository secret'"
    echo "   3. Name: CLOUDFLARE_ACCOUNT_ID"
    echo "   4. Find your Account ID in Cloudflare dashboard sidebar"
    exit 1
fi

echo "✅ Environment variables validated (from GitHub Secrets)"

# Install wrangler if not present
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

echo "🔐 Authenticating with Cloudflare..."
wrangler auth api-token

# Create KV namespace if it doesn't exist
echo "📦 Creating KV namespace for Etsy products..."
if ! wrangler kv:namespace list | grep -q "etsy_products"; then
    KV_OUTPUT=$(wrangler kv:namespace create "ETSY_PRODUCTS" --preview false)
    KV_ID=$(echo "$KV_OUTPUT" | grep "id" | cut -d'"' -f4)

    echo "✅ Created KV namespace: $KV_ID"

    # Update the wrangler config with the new namespace ID
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/id = \"etsy_products_namespace\"/id = \"$KV_ID\"/" cloudflare/wrangler-etsy-sync.toml
    else
        sed -i "s/id = \"etsy_products_namespace\"/id = \"$KV_ID\"/" cloudflare/wrangler-etsy-sync.toml
    fi
else
    echo "✅ KV namespace already exists"
fi

echo "🚀 Deploying Etsy Sync Worker..."
wrangler deploy --config cloudflare/wrangler-etsy-sync.toml

echo ""
echo "✅ Etsy Sync Worker deployed successfully!"
echo "=============================================="
echo ""
echo "📋 Worker Details:"
echo "   • Name: troves-etsy-sync"
echo "   • Schedule: Every 6 hours (cron: 0 */6 * * *)"
echo "   • Endpoints:"
echo "     - POST /sync  - Manual sync trigger"
echo "     - GET  /status - Sync status"
echo "     - GET  /products - Synced products"
echo ""
echo "🔧 Manual Sync:"
echo "   curl -X POST https://troves-etsy-sync.YOUR_SUBDOMAIN.workers.dev/sync"
echo ""
echo "📊 Check Status:"
echo "   curl https://troves-etsy-sync.YOUR_SUBDOMAIN.workers.dev/status"
echo ""
echo "⏰ Next Scheduled Sync: In less than 6 hours"
