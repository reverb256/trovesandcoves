# Etsy Product Sync for Cloudflare Workers

Automatically keeps your Troves & Coves website products synchronized with your Etsy shop.

## Architecture

```
┌─────────────────┐     cron (every 6h)      ┌──────────────────┐
│   Etsy Shop     │ ──────────────────────────> │  Etsy Sync Worker│
│ (trovesandcoves) │                            │  (Cloudflare)    │
└─────────────────┘                            └────────┬─────────┘
                                                      │
                                                      v
                                              ┌───────────────┐
                                              │ KV Storage     │
                                              │ ETSY_PRODUCTS  │
                                              └───────┬───────┘
                                                      │
                                                      v
┌─────────────────┐     reads from KV      ┌──────────────────┐
│   Frontend      │ <──────────────────────────│  Main Worker     │
│ (GitHub Pages)  │     fetches products     │  (API Proxy)     │
└─────────────────┘                            └──────────────────┘
```

## Components

### 1. Etsy Sync Worker (`cloudflare/etsy-sync-worker.js`)

- **Scheduled Task**: Runs automatically every 6 hours via Cloudflare Cron Triggers
- **Scrapes Etsy**: Fetches products from your Etsy shop page
- **Parses Product Data**: Extracts titles, images, prices, materials
- **Stores in KV**: Saves product data to Cloudflare KV storage
- **Manual Trigger**: Can be triggered manually via POST `/sync`

### 2. Main Worker Updates (`cloudflare-worker.js`)

- **Reads from ETSY_PRODUCTS KV**: Fetches synced products before falling back to defaults
- **Automatic Fallback**: Uses PRODUCTS_KV if Etsy sync hasn't run yet

### 3. Configuration (`cloudflare/wrangler-etsy-sync.toml`)

- Worker name: `troves-etsy-sync`
- Cron schedule: `0 */6 * * *` (every 6 hours)
- KV namespace: `ETSY_PRODUCTS`

## Deployment

### GitHub Secrets Configuration

Add these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

| Secret | Value | How to Get |
|--------|-------|-------------|
| `CLOUDFLARE_API_TOKEN` | Your API token | https://dash.cloudflare.com/profile/api-tokens (Scopes: Account > Worker Scripts > Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Your account ID | Cloudflare Dashboard sidebar |

### Automated Deployment (GitHub Actions)

The Etsy sync worker **deploys automatically** when you push to `main` branch via GitHub Actions (free tier).

```bash
# Just push your changes - GitHub Actions handles the rest
git add .
git commit -m "Update Etsy sync configuration"
git push main
```

### Manual Deployment (Local)

If you need to deploy manually:

```bash
# GitHub Secrets are NOT available locally
# You must set environment variables explicitly
export CLOUDFLARE_API_TOKEN="your_api_token"
export CLOUDFLARE_ACCOUNT_ID="your_account_id"

./scripts/deployment/deploy-etsy-sync.sh
```

### Verify Deployment

```bash
# Check sync status
curl https://troves-etsy-sync.YOUR_SUBDOMAIN.workers.dev/status

# Trigger manual sync
curl -X POST https://troves-etsy-sync.YOUR_SUBDOMAIN.workers.dev/sync

# Get synced products
curl https://troves-etsy-sync.YOUR_SUBDOMAIN.workers.dev/products
```

## API Endpoints

### Etsy Sync Worker

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sync` | POST | Manually trigger product sync |
| `/status` | GET | Get sync status and metadata |
| `/products` | GET | Get all synced products |

### Main Worker (Updated)

| Endpoint | Description | Source |
|----------|-------------|--------|
| `/api/products` | Get all products | ETSY_PRODUCTS KV → PRODUCTS_KV → defaults |
| `/api/products/featured` | Get featured products | ETSY_PRODUCTS KV → PRODUCTS_KV → defaults |

## Product Data Schema

```javascript
{
  id: 1000,                    // Unique ID (1000+ for Etsy products)
  name: "Product Name",
  description: "Product description",
  price: "88.00",
  imageUrl: "https://i.etsystatic.com/...",
  imageUrls: ["https://i.etsystatic.com/..."],
  category: "Necklaces",
  categoryId: 1,
  materials: ["Turquoise", "Wire"],
  gemstones: ["Turquoise"],
  inStock: true,
  stockQuantity: 1,
  sku: "ETSY-1234567890",
  isFeatured: true,              // First 3 products are featured
  etsyUrl: "https://www.etsy.com/...",
  lastSyncedAt: "2026-03-09T..."  // Sync timestamp
}
```

## Sync Schedule

The worker runs automatically:
- **Every 6 hours**: `0 */6 * * *` (12am, 6am, 12pm, 6pm UTC)
- **Manual sync**: POST to `/sync` endpoint anytime

## Customization

### Change Sync Frequency

Edit `cloudflare/wrangler-etsy-sync.toml`:

```toml
[triggers]
crons = ["0 */4 * * *"]  # Every 4 hours instead
```

### Change Etsy Shop URL

Edit `cloudflare/wrangler-etsy-sync.toml`:

```toml
[vars]
ETSY_SHOP_URL = "https://www.etsy.com/ca/shop/YOUR_SHOP_NAME"
```

### Add More Product Fields

Edit `cloudflare/etsy-sync-worker.js`:

```javascript
function parseEtsyProductsFromHtml(html) {
  // Add your custom parsing logic here
  products.push({
    // ... existing fields
    yourCustomField: extractCustomData(html),
  });
}
```

## Monitoring

### View Sync Logs

1. Go to Cloudflare Dashboard
2. Navigate to Workers & Pages
3. Select `troves-etsy-sync` worker
4. View Logs > Real-time logs

### Check KV Storage

```bash
# Using Wrangler CLI
wrangler kv:key list --namespace-id=YOUR_NAMESPACE_ID
wrangler kv:key get "products" --namespace-id=YOUR_NAMESPACE_ID
```

## Troubleshooting

### Sync returns 0 products

- **Cause**: Etsy page structure changed or blocked
- **Fix**: Check the HTML parsing patterns in `etsy-sync-worker.js`

### Products not showing on main site

- **Cause**: KV namespace binding not configured
- **Fix**: Verify `ETSY_PRODUCTS` binding in `cloudflare.toml`

### Cron trigger not working

- **Cause**: Worker not deployed with cron config
- **Fix**: Run `wrangler deploy --config cloudflare/wrangler-etsy-sync.toml`

## Local Development

To test the sync worker locally:

```bash
# Using Wrangler
wrangler dev --config cloudflare/wrangler-etsy-sync.toml

# Test endpoints
curl http://localhost:8787/status
curl -X POST http://localhost:8787/sync
```

## Cost

**100% FREE TIER** - No charges whatsoever.

### Cloudflare Free Tier Included
- **Workers**: 100,000 requests/day (you'll use ~100/day max)
- **KV Storage**: 1GB storage (you'll use ~1MB)
- **KV Reads**: 1GB/day (you'll use ~10MB)
- **Cron Triggers**: Included free

### GitHub Actions Free Tier Included
- **2,000 minutes/month** (you'll use ~5 minutes per deployment)
- **500MB storage** for artifacts

### Estimated Monthly Usage
- **Worker requests**: ~3,000 (well under 100,000 limit)
- **KV storage**: ~1MB (well under 1GB limit)
- **Sync operations**: ~120 (4 per day × 30 days)
- **GitHub Actions**: ~10-20 minutes per month

**Total Cost: $0/month** ✅

## Future Enhancements

- [ ] Add webhook support for instant Etsy updates
- [ ] Implement inventory tracking
- [ ] Add product category detection
- [ ] Support for multiple Etsy shops
- [ ] Image optimization via Cloudflare Images
