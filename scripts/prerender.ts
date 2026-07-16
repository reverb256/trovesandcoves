/**
 * Prerender the Troves & Coves SPA to static HTML for every route.
 *
 * Why this exists:
 *   GitHub Pages is a static host with no SPA fallback for arbitrary deep links.
 *   The app uses client-side routing (Wouter). Without prerendering, deep links
 *   like /products or /product/3 return the SPA shell via 404.html (works in-browser
 *   but is fragile and bad for SEO/demos). This script renders each route in a real
 *   headless browser and writes a real index.html per route so every deep link is a
 *   first-class static file.
 *
 * How embedded data works:
 *   In production the app resolves product/category data from @shared/embedded-data
 *   (bundled) when window.location.hostname is trovesandcoves.ca / reverb256.github.io.
 *   For local prerender we serve on 127.0.0.1 (loopback) which the app also treats as
 *   embedded-production mode, so real product content is rendered. No backend needed.
 *
 * Usage (CI/deploy flow):
 *   npm run build && npm run prerender
 *   (prerender serves ./dist/public itself, no external server needed)
 */

import { chromium, type Page, type Browser } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist', 'public');
const PORT = Number(process.env.PRERENDER_PORT || 4178);
const HOST = '127.0.0.1'; // loopback => app uses embedded data; no HSTS upgrade
const ORIGIN = `http://${HOST}:${PORT}`;

// --- Routes to prerender (from client/src/App.tsx) -------------------------
const STATIC_ROUTES: string[] = [
  '/',
  '/showcase',
  '/products',
  '/checkout',
  '/order-confirmation',
  '/contact',
  '/about',
  '/size-guide',
  '/jewelry-care',
  '/crystal-guide',
  '/warranty',
  '/returns',
  '/financing',
  '/privacy-policy',
  '/style-guide',
];

// Category slugs (server/storage.ts seedData)
const CATEGORY_SLUGS = [
  'crystal-necklaces',
  'gemstone-necklaces',
  'leather-cord-pendants',
];

// Product ids: read from embedded data so we enumerate exactly what exists.
async function getProductIds(): Promise<number[]> {
  try {
    const mod = await import(path.resolve(ROOT, 'shared', 'embedded-data.ts'));
    const fn = (mod as any).getEmbeddedProducts as (() => any[]) | undefined;
    if (typeof fn === 'function') {
      const products = fn();
      return products.map((p: any) => Number(p.id)).filter((n: number) => Number.isFinite(n));
    }
  } catch (err) {
    console.warn('⚠️  Could not import embedded products, falling back to 1..30:', err);
  }
  return Array.from({ length: 30 }, (_, i) => i + 1);
}

function allRoutes(productIds: number[]): string[] {
  const routes = [...STATIC_ROUTES];
  for (const slug of CATEGORY_SLUGS) routes.push(`/products/${slug}`);
  for (const id of productIds) routes.push(`/product/${id}`);
  return routes;
}

// --- Minimal static file server (SPA-aware) --------------------------------
const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function contentTypeFor(p: string): string {
  return MIME[path.extname(p).toLowerCase()] || 'application/octet-stream';
}

function startServer(): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
        let filePath = path.join(DIST, urlPath);
        if (!filePath.startsWith(DIST)) {
          res.writeHead(403).end('Forbidden');
          return;
        }
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          // SPA fallback: serve the built index.html so the app boots
          filePath = path.join(DIST, 'index.html');
        }
        const body = fs.readFileSync(filePath);
        res.writeHead(200, {
          'Content-Type': contentTypeFor(filePath),
          'Cache-Control': 'no-cache',
        });
        res.end(body);
      } catch (err) {
        res.writeHead(500).end('Server error: ' + String(err));
      }
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

// --- Browser launch with retries (local binary can be flaky) ---------------
async function launchBrowser(): Promise<Browser> {
  const baseArgs = [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-first-run',
  ];
  const envBin = process.env.PRERENDER_CHROME_BIN;
  const maxAttempts = 3;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await chromium.launch(
        envBin
          ? { executablePath: envBin, args: baseArgs }
          : { args: baseArgs },
      );
    } catch (err) {
      lastErr = err;
      console.warn(`   ⚠️  browser launch attempt ${attempt}/${maxAttempts} failed: ${String(err).slice(0, 160)}`);
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw lastErr;
}

// --- Prerender a single route ---------------------------------------------
async function renderRoute(page: Page, route: string): Promise<string> {
  const target = ORIGIN + route;
  await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Wait for the app shell to hydrate and content to appear.
  await page.waitForFunction(
    () => {
      const root = document.getElementById('root');
      return !!root && (root.innerText?.trim().length ?? 0) > 40;
    },
    { timeout: 20000 },
  ).catch(() => {
    console.warn(`   ⚠️  content wait timed out for ${route} (writing what we have)`);
  });

  // Give animations/late mounts a moment to settle.
  await page.waitForTimeout(600);

  return await page.content();
}

function writeRoute(route: string, html: string): void {
  const outDir = route === '/' ? DIST : path.join(DIST, route.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
}

async function main(): Promise<void> {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('❌ dist/public/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  const productIds = await getProductIds();
  const routes = allRoutes(productIds);
  console.log(`🖨️  Prerendering ${routes.length} routes (${productIds.length} products) -> static HTML`);

  const server = await startServer();
  console.log(`📡 Static server on ${ORIGIN}`);

  const browser = await launchBrowser();
  const page = await browser.newPage();
  // Avoid external analytics/ads from stalling the render.
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (u.includes('plausible.io') || u.includes('googletagmanager') || u.includes('google-analytics')) {
      return route.abort();
    }
    return route.continue();
  });

  let ok = 0;
  let failed: string[] = [];
  for (const route of routes) {
    try {
      const html = await renderRoute(page, route);
      writeRoute(route, html);
      console.log(`   ✅ ${route || '/'}`);
      ok++;
    } catch (err) {
      console.error(`   ❌ ${route} -> ${String(err)}`);
      failed.push(route);
    }
  }

  // Render the 404 / NotFound page as the SPA fallback.
  try {
    const html = await renderRoute(page, '/__not_found_page__');
    fs.writeFileSync(path.join(DIST, '404.html'), html, 'utf-8');
    console.log('   ✅ /404.html (NotFound page)');
  } catch (err) {
    console.warn(`   ⚠️  404 page render failed: ${String(err)} (keeping existing 404.html)`);
  }

  await browser.close();
  server.close();

  console.log(`\n🚀 Prerender complete: ${ok}/${routes.length} routes written.`);
  if (failed.length) {
    console.error(`❌ Failed routes: ${failed.join(', ')}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Prerender crashed:', err);
  process.exit(1);
});
