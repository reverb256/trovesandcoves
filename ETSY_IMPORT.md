# Etsy Product Import & Sync

Two ways to keep your Troves & Coves website synchronized with your Etsy shop:

1. **Automatic Sync (Recommended)**: Cloudflare Worker with scheduled sync
2. **Manual Import**: One-time import script for development

---

## Option 1: Automatic Cloudflare Sync (Recommended) ⭐

Automatically syncs your Etsy products to the website every 6 hours.

### Quick Start

```bash
# Set Cloudflare credentials
export CLOUDFLARE_API_TOKEN="your_api_token"
export CLOUDFLARE_ACCOUNT_ID="your_account_id"

# Deploy the sync worker
./scripts/deployment/deploy-etsy-sync.sh
```

### Features

- ✅ **Scheduled sync**: Every 6 hours (customizable)
- ✅ **Zero maintenance**: Products stay in sync automatically
- ✅ **Manual trigger**: Force sync anytime via POST `/sync`
- ✅ **Free tier**: Uses Cloudflare's free tier (100k requests/day)

See [ETSY_SYNC_README.md](./ETSY_SYNC_README.md) for full documentation.

---

## Option 2: Manual Import (Development)

1. **Edit `etsy-products.json`** with your Etsy product data
2. **Run the import script** to generate a seed file
3. **Restart the dev server** - products will appear automatically

## Product Data Format

Each product in `etsy-products.json` should have:

```json
{
  "title": "Product Name",
  "description": "Product description",
  "price": "88.00",
  "imageUrl": "https://i.etsystatic.com/...",
  "category": "Necklaces",
  "materials": ["Turquoise", "Wire"],
  "gemstones": ["Turquoise"],
  "inStock": true,
  "stockQuantity": 1,
  "sku": "ETSY-001"
}
```

## Getting Product Images from Etsy

1. Go to your Etsy shop listing
2. Right-click the product image → "Copy image address"
3. Paste into `etsy-products.json`

**Image URL format:** `https://i.etsystatic.com/XXXXX/r/il/XXXXX/XXXXX_XXXX_fullxfull.12345.jpg`

## Running the Import

```bash
# Generate seed file from etsy-products.json
npx tsx server/import-etsy-products.ts

# Restart dev server
npm run dev
```

## Current Products

Your shop currently has 10 listings:

- Handmade Turquoise Necklace ($88)
- Handwrapped Citrine Pearl Set ($260)
- Raw Citrine Necklace ($166)
- Lapis Lazuli collections ($78-108)
- Wire wrapped crystals ($78-111)

## Category Mapping

| Etsy Category | Site Category |
| ------------- | ------------- |
| Necklaces     | necklaces     |
| Bracelets     | bracelets     |
| Earrings      | earrings      |
| Rings         | rings         |

Add more in the `CATEGORY_MAP` in `import-etsy-products.ts` if needed.
