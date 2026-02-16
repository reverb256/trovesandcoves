/**
 * Ultra-lightweight Cloudflare Worker for Troves and Coves
 * Optimized for free tier: 100k requests/day, 10ms CPU, 128MB memory
 */

// Minimal global state to conserve memory
const rateLimits = new Map();
const RATE_LIMIT = 30;
const CACHE_TTL = { static: 86400, api: 3600 };

// Lightweight rate limiting
function checkRate(ip) {
  const count = rateLimits.get(ip) || 0;
  if (count > RATE_LIMIT) return false;
  rateLimits.set(ip, count + 1);
  if (rateLimits.size > 500) rateLimits.clear();
  return true;
}

// Static asset detection
function isStatic(path) {
  return /\.(css|js|png|jpg|svg|ico|woff2?)$/.test(path);
}

// Minimal API responses to save CPU
async function handleAPI(env, path) {
  const key = `api:${path}`;
  const cached = await env.CACHE.get(key);
  if (cached) return new Response(cached, { headers: { 'Content-Type': 'application/json' } });
  
  let data;
  if (path.includes('recommend')) {
    data = { items: ['Chakra Stone', 'Protection Amulet', 'Healing Set'] };
  } else if (path.includes('market')) {
    data = { trend: 'Crystal jewelry demand rising', growth: '15%' };
  } else {
    data = { status: 'optimized', version: 'mystical' };
  }
  
  const result = JSON.stringify(data);
  await env.CACHE.put(key, result, { expirationTtl: CACHE_TTL.api });
  return new Response(result, { headers: { 'Content-Type': 'application/json' } });
}

// Main worker
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    
    // CORS for all requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Rate limiting
    if (!checkRate(ip)) {
      return new Response('Rate limited', { status: 429, headers: corsHeaders });
    }

    try {
      let response;

      // Static assets with aggressive caching
      if (isStatic(url.pathname)) {
        response = await fetch(request);
        if (response.ok) {
          const headers = new Headers(response.headers);
          headers.set('Cache-Control', `public, max-age=${CACHE_TTL.static}`);
          Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
          return new Response(response.body, { status: response.status, headers });
        }
      }

      // API routes
      if (url.pathname.startsWith('/api/')) {
        response = await handleAPI(env, url.pathname);
      } else {
        // Pass through to origin
        response = await fetch(request);
      }

      // Add CORS to all responses
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      
      // Security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');

      return response;
    } catch {
      return new Response('Service unavailable', { status: 503, headers: corsHeaders });
    }
  }
};