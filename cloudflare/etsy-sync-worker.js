/**
 * Etsy Product Sync Worker for Cloudflare
 *
 * Syncs products from Troves & Coves Etsy shop to KV storage
 * Runs on scheduled cron triggers (every 6 hours)
 *
 * Environment variables needed:
 * - ETSY_SHOP_URL: Your Etsy shop URL
 * - KV namespace binding: ETSY_PRODUCTS
 */

export default {
  // Scheduled event handler (Cron trigger)
  async scheduled(event, env, ctx) {
    console.log('🔄 Starting Etsy product sync...');
    console.log(`Scheduled cron: ${event.cron}`);

    try {
      const result = await syncEtsyProducts(env);
      console.log(`✅ Sync complete: ${result.productCount} products`);

      // Store sync metadata
      await env.ETSY_PRODUCTS.put('sync:meta', JSON.stringify({
        lastSync: new Date().toISOString(),
        productCount: result.productCount,
        status: 'success'
      }));

    } catch (error) {
      console.error('❌ Sync failed:', error);

      // Store failure metadata
      await env.ETSY_PRODUCTS.put('sync:meta', JSON.stringify({
        lastSync: new Date().toISOString(),
        productCount: 0,
        status: 'error',
        error: error.message
      }));
    }
  },

  // HTTP fetch handler for manual sync triggering
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Manual sync trigger
    if (url.pathname === '/sync' && request.method === 'POST') {
      try {
        const result = await syncEtsyProducts(env);
        return new Response(JSON.stringify(result), {
          headers: corsHeaders,
          status: 200
        });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          headers: corsHeaders,
          status: 500
        });
      }
    }

    // Get sync status
    if (url.pathname === '/status' && request.method === 'GET') {
      const meta = await env.ETSY_PRODUCTS.get('sync:meta', { type: 'json' });
      const products = await env.ETSY_PRODUCTS.get('products', { type: 'json' }) || [];

      return new Response(JSON.stringify({
        meta,
        productCount: products.length
      }), {
        headers: corsHeaders
      });
    }

    // Get products
    if (url.pathname === '/products' && request.method === 'GET') {
      const products = await env.ETSY_PRODUCTS.get('products', { type: 'json' }) || [];
      return new Response(JSON.stringify(products), {
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      error: 'Endpoint not found',
      endpoints: ['/sync (POST)', '/status (GET)', '/products (GET)']
    }), {
      headers: corsHeaders,
      status: 404
    });
  }
};

/**
 * Sync products from Etsy to KV storage
 */
async function syncEtsyProducts(env) {
  const shopUrl = env.ETSY_SHOP_URL || 'https://www.etsy.com/ca/shop/TrovesandCoves';

  console.log(`📖 Fetching Etsy shop: ${shopUrl}`);

  // Fetch the Etsy shop page
  const response = await fetch(shopUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-CA,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`Etsy shop fetch failed: ${response.status}`);
  }

  const html = await response.text();

  // Parse products from HTML
  const products = parseEtsyProductsFromHtml(html);

  console.log(`✅ Parsed ${products.length} products from Etsy`);

  // Store products in KV
  await env.ETSY_PRODUCTS.put('products', JSON.stringify(products), {
    expirationTtl: 86400 * 7 // 7 days cache
  });

  return {
    success: true,
    productCount: products.length,
    syncedAt: new Date().toISOString()
  };
}

/**
 * Parse Etsy product data from HTML
 */
function parseEtsyProductsFromHtml(html) {
  const products = [];
  const seenUrls = new Set();

  // Extract product data using multiple patterns

  // Pattern 1: Find all listing URLs in the data
  const dataMatches = html.matchAll(/"listingUrl":"(https:\\\/\\\/www\.etsy\.com\/ca\/listing\/\d+[^"]*)"/g);

  for (const match of dataMatches) {
    if (products.length >= 15) break;

    let listingUrl = match[1].replace(/\\\u002F/g, '/').replace(/\\\//g, '/');

    // Skip duplicates
    if (seenUrls.has(listingUrl)) continue;
    seenUrls.add(listingUrl);

    // Extract listing ID
    const listingIdMatch = listingUrl.match(/\/listing\/(\d+)/);
    const listingId = listingIdMatch ? listingIdMatch[1] : Date.now().toString();

    // Find product title near this URL
    const title = extractTitleNearUrl(html, listingUrl) || `Product ${products.length + 1}`;

    // Extract image URL for this listing
    const imageUrl = extractImageUrlForListing(html, listingId);

    // Extract materials/gemstones from title
    const materials = extractMaterials(title);
    const gemstones = extractGemstones(title);

    // Extract price
    const price = extractPriceForListing(html, listingId);

    products.push({
      id: 1000 + products.length,
      name: cleanTitle(title),
      description: `Handcrafted ${cleanTitle(title).toLowerCase()}`,
      price: price || '88.00',
      imageUrl: imageUrl,
      imageUrls: [imageUrl],
      category: 'Necklaces',
      categoryId: 1,
      materials: materials,
      gemstones: gemstones,
      inStock: true,
      stockQuantity: 1,
      sku: `ETSY-${listingId}`,
      isFeatured: products.length < 3,
      etsyUrl: listingUrl,
      lastSyncedAt: new Date().toISOString()
    });
  }

  return products;
}

/**
 * Extract product title near a listing URL in HTML
 */
function extractTitleNearUrl(html, listingUrl) {
  // Look for title in structured data
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Try multiple patterns for title
  const patterns = [
    new RegExp(`"title":"([^"]*?)"[\\s\\S]{0,300}"listingUrl":"${escapeRegex(listingUrl).replace(/\//g, '\\\\/')}`, 'i'),
    new RegExp(`"name":"([^"]*?)"[\\s\\S]{0,500}"url":"${escapeRegex(listingUrl).replace(/\//g, '\\\\/')}`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return match[1].replace(/\\\u002F/g, '/').replace(/\\u0026/g, '&');
    }
  }

  return null;
}

/**
 * Extract image URL for a listing
 */
function extractImageUrlForListing(html, listingId) {
  // Look for fullxfull images
  const patterns = [
    /https:\/\/i\.etsystatic\.com\/\d+\/r\/il\/[a-z0-9]+\/\d+_fullxfull\.[a-z0-9]+\.jpg/gi,
    /https:\/\/i\.etsystatic\.com\/\d+\/c\/\d+\/\d+\/\d+\/\d+\/il\/[a-z0-9]+\/\d+_fullxfull\.[a-z0-9]+\.jpg/gi,
  ];

  // Find all etsystatic images
  const allImages = html.match(/https:\/\/i\.etsystatic\.com\/[^"'\s]+fullxfull[^"'\s]*\.jpg/gi) || [];

  // Filter for product images (not tiny ones)
  const productImages = allImages.filter(url =>
    !url.includes('75x75') &&
    !url.includes('100x100') &&
    !url.includes('avatar')
  );

  if (productImages.length > 0) {
    // Return unique images
    const uniqueImages = [...new Set(productImages)];
    return uniqueImages[products.length % uniqueImages.length] || uniqueImages[0];
  }

  return 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400';
}

/**
 * Extract price for a listing
 */
function extractPriceForListing(html, listingId) {
  const patterns = [
    /"price"[^}]*"currency_value":(\d+\.?\d*)/gi,
    /"value":(\d+\.?\d*)[^}]*"listing_id":/gi,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return '88.00';
}

/**
 * Extract materials from title
 */
function extractMaterials(title) {
  const materialKeywords = [
    'Turquoise', 'Lapis Lazuli', 'Citrine', 'Rose Quartz', 'Pyrite',
    'Amethyst', 'Jade', 'Smoky Quartz', 'Hematite', 'Pearl',
    'Wire', 'Leather', 'Gold Plated', 'Gold Filled', 'Enamel', 'Chain'
  ];

  const found = [];
  const upperTitle = title.toUpperCase();

  for (const material of materialKeywords) {
    if (upperTitle.includes(material.toUpperCase()) && !found.includes(material)) {
      found.push(material);
    }
  }

  return found.length > 0 ? found : ['Crystal', 'Wire'];
}

/**
 * Extract gemstones from title
 */
function extractGemstones(title) {
  const gemstoneKeywords = [
    'Turquoise', 'Lapis Lazuli', 'Citrine', 'Rose Quartz', 'Pyrite',
    'Amethyst', 'Jade', 'Smoky Quartz', 'Hematite', 'Onyx', 'Lava Stone'
  ];

  const found = [];
  const upperTitle = title.toUpperCase();

  for (const gemstone of gemstoneKeywords) {
    if (upperTitle.includes(gemstone.toUpperCase()) && !found.includes(gemstone)) {
      found.push(gemstone);
    }
  }

  return found;
}

/**
 * Clean up title text
 */
function cleanTitle(title) {
  if (!title) return 'Crystal Necklace';
  return title
    .replace(/\\\u002F/g, '/')
    .replace(/\\u0026/g, '&')
    .replace(/\\u2019/g, "'")
    .replace(/,/g, ',')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 100);
}
