# Astro Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the Troves & Coves crystal jewelry showcase site from React + Vite to Astro for improved performance, SEO, and simpler static site generation while preserving all existing functionality and design.

**Architecture:** Astro with React islands for interactive components (cart drawer, search, product filtering). Static pages will be pure Astro for optimal performance and SEO. The shadcn/ui component library will be preserved via the React integration. File-based routing replaces Wouter.

**Tech Stack:** Astro 4.x, React 18 (via @astrojs/react), Tailwind CSS (via @astrojs/tailwind), TypeScript, shadcn/ui components, Playwright (E2E testing)

---

## Migration Strategy Overview

### What Stays the Same

- **shadcn/ui components** - All 40+ Radix UI components work unchanged via React integration
- **Design system** - Tailwind CSS, Material You colors, brand config
- **Product data** - In-memory storage remains, can be loaded as JSON
- **E2E tests** - Playwright tests work against static output
- **GitHub Pages deployment** - Astro outputs static HTML

### What Changes

- **Routing**: Wouter (JS-based) → Astro (file-based)
- **Page structure**: React components → Astro pages with React islands
- **Build process**: Vite → Astro (still uses Vite under the hood)
- **Development server**: Express → Astro dev server
- **State management**: React Query → Direct data fetching + nanostate for cart
- **Root layout**: Vite index.html → Astro layouts

### Migration Phases

1. **Phase 1**: Project setup (new branch, Astro init)
2. **Phase 2**: Layout and routing migration
3. **Phase 3**: Component migration (static pages)
4. **Phase 4**: Interactive components (React islands)
5. **Phase 5**: Integration and polish (CI, tests, deployment)

---

## Phase 1: Project Setup

### Task 1.1: Create feature branch

**Files:**

- Create: None (git branch)

**Step 1: Create and checkout new branch**

```bash
git checkout -b feat/astro-migration
```

**Step 2: Verify branch**

```bash
git branch
```

Expected: `* feat/astro-migration` shown as current branch

**Step 3: Commit (empty commit to mark branch start)**

```bash
git commit --allow-empty -m "feat: start Astro migration branch"
```

---

### Task 1.2: Initialize Astro project

**Files:**

- Create: `astro.config.ts`, `src/layouts/`, `src/pages/`
- Modify: `package.json`, `tsconfig.json`, `vite.config.ts` → remove/replace

**Step 1: Install Astro and core integrations**

```bash
npx astro add --yes react tailwind
```

Expected: Astro CLI installs:

- `@astrojs/react@latest`
- `@astrojs/tailwind@latest`
- `astro@latest`
- Updates `astro.config.mjs` (rename to `.ts`)

**Step 2: Rename config file and customize**

```bash
mv astro.config.mjs astro.config.ts
```

Edit `astro.config.ts`:

```typescript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://trovesandcoves.ca',
  base: '/trovesandcoves',
  output: 'static',

  integrations: [
    react({
      experimentalReactChildren: true, // For React Query compatibility
    }),
    tailwind({
      applyBaseStyles: false, // We have custom base styles
    }),
  ],

  vite: {
    build: {
      cssMinify: 'esbuild',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  },
});
```

**Step 3: Update TypeScript config**

Create new `tsconfig.json` (Astro-friendly):

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./../shared/*"],
      "@assets/*": ["./attached_assets/*"]
    }
  },
  "include": ["src/**/*.d.ts", "src/**/*.ts", "src/**/*.tsx", "src/**/*.astro"]
}
```

**Step 4: Commit**

```bash
git add astro.config.ts tsconfig.json package.json package-lock.json
git commit -m "feat: initialize Astro with React and Tailwind integrations"
```

---

### Task 1.3: Reorganize source structure

**Files:**

- Create: `src/`, `src/layouts/`, `src/pages/`, `src/components/`, `src/styles/`
- Move: `client/src/components/` → `src/components/`

**Step 1: Create new Astro source directories**

```bash
mkdir -p src/{layouts,pages,components,styles,hooks,lib}
```

**Step 2: Move React components**

```bash
# Move all components (they'll be reused as islands)
cp -r client/src/components/* src/components/

# Copy lib utilities
cp -r client/src/lib/* src/lib/

# Copy hooks
cp -r client/src/hooks/* src/hooks/
```

**Step 3: Copy shared directory reference**

Create `src/shared/` as a symlink or copy:

```bash
cp -r shared/* src/shared/
```

**Step 4: Update import paths in moved files**

```bash
# Run a find-replace to update imports
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's|@/lib|../../lib|g' {} +
```

**Step 5: Commit**

```bash
git add src/
git commit -m "feat: reorganize source structure for Astro"
```

---

### Task 1.4: Migrate Tailwind configuration

**Files:**

- Modify: `tailwind.config.ts`

**Step 1: Update Tailwind config for Astro**

Edit `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Material You surface colors
        'surface-50': '#faf8f3',
        'surface-100': '#f5f0e8',
        'surface-200': '#e8e0d5',
        // Brand colors
        troves: '#3A8E8B',
        coves: '#C9A24A',
      },
      fontFamily: {
        libre: ['Libre Baskerville', 'serif'],
        alex: ['Alex Brush', 'cursive'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

**Step 2: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: update Tailwind config for Astro content paths"
```

---

## Phase 2: Layout and Routing

### Task 2.1: Create base Astro layout

**Files:**

- Create: `src/layouts/BaseLayout.astro`
- Modify: `index.html` → remove (replaced by layout)

**Step 1: Create the base layout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { Toaster } from '../components/ui/toast';

interface Props {
  title?: string;
  description?: string;
  image?: string;
}

const {
  title = 'Troves & Coves | Handcrafted Crystal Jewelry',
  description = 'Handcrafted crystal jewelry from Winnipeg. 14k gold-plated chains, natural crystals, statement pieces.',
  image = '/trovesandcoves/og-image.jpg'
} = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/trovesandcoves/favicon.svg" />
    <meta name="generator" content={Astro.generator} />

    <!-- SEO -->
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={new URL(Astro.url.pathname, Astro.site)} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(image, Astro.site)} />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Libre+Baskerville:wght@400;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-surface-50 text-on-surface">
    <Header />
    <main id="main-content">
      <slot />
    </main>
    <Footer />
    <CartDrawer client:load />
    <Toaster client:load />
  </body>
</html>

<style is:global>
  /* Base styles from index.css */
  @layer base {
    * {
      @apply border-border;
    }
    body {
      @apply bg-surface-50 text-on-surface font-montserrat;
    }
  }

  /* Smooth scroll behavior */
  html {
    scroll-behavior: smooth;
  }
</style>
```

**Step 2: Move global styles**

```bash
# Copy or move the existing styles
cp index.css src/styles/globals.css
```

**Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro src/styles/globals.css
git commit -m "feat: create base Astro layout with SEO meta tags"
```

---

### Task 2.2: Create homepage (first Astro page)

**Files:**

- Create: `src/pages/index.astro`
- Reference: `client/src/pages/Home.tsx`

**Step 1: Create the homepage**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero, { loader as heroLoader } from '../components/Hero';
import FeaturesBar from '../components/FeaturesBar';
import ProductGrid from '../components/ProductGrid';

// Load product data for static generation
const products = await heroLoader();
---

<BaseLayout>
  <section id="hero">
    <Hero products={products} client:visible />
  </section>

  <FeaturesBar client:load />

  <section id="products" class="py-16 px-4">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-libre text-troves text-center mb-8">
        Featured Collection
      </h2>
      <ProductGrid products={products} client:visible />
    </div>
  </section>
</BaseLayout>
```

**Step 2: Test locally**

```bash
npm run dev
```

Expected: Site runs on `http://localhost:4321`

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: create Astro homepage"
```

---

### Task 2.3: Create Products page

**Files:**

- Create: `src/pages/products/index.astro`
- Reference: `client/src/pages/Products.tsx`

**Step 1: Create products listing page**

Create `src/pages/products/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getAllProducts } from '../../lib/api';
import ProductList from '../../components/ProductList';
import SearchBar from '../../components/SearchBar';

const products = await getAllProducts();
---

<BaseLayout title="Products | Troves & Coves">
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <h1 class="text-4xl font-libre text-troves mb-4">
        Our Collection
      </h1>
      <SearchBar client:load />
    </header>

    <ProductList products={products} client:visible />
  </div>
</BaseLayout>
```

**Step 2: Commit**

```bash
git add src/pages/products/index.astro
git commit -m "feat: create products listing page"
```

---

### Task 2.4: Create ProductDetail page (dynamic routing)

**Files:**

- Create: `src/pages/products/[slug].astro`
- Reference: `client/src/pages/ProductDetail.tsx`

**Step 1: Create dynamic product page**

Create `src/pages/products/[slug].astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getProduct, getAllProducts } from '../../lib/api';
import ProductDetail from '../../components/ProductDetail';
import NotFound from '../NotFound.astro';

export async function getStaticPaths() {
  const products = await getAllProducts();
  return products.map((product) => ({
    params: { slug: product.slug },
    props: { product },
  }));
}

const { slug } = Astro.params;
const product = await getProduct(slug);

if (!product) {
  return Astro.redirect('/404');
}
---

<BaseLayout title={`${product.name} | Troves & Coves`}>
  <ProductDetail product={product} client:visible />
</BaseLayout>
```

**Step 2: Commit**

```bash
git add src/pages/products/[slug].astro
git commit -m "feat: create dynamic product detail page with static generation"
```

---

### Task 2.5: Create static content pages

**Files:**

- Create: `src/pages/about.astro`, `src/pages/contact.astro`, `src/pages/size-guide.astro`, etc.

**Step 1: Create About page**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About | Troves & Coves">
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-libre text-troves mb-8">
      About Troves & Coves
    </h1>

    <div class="prose prose-lg max-w-none">
      <!-- Static content from original About component -->
      <p class="text-lg mb-4">
        Troves & Coves brings you handcrafted crystal jewelry,
        made with intention in Winnipeg, Canada.
      </p>
      <!-- ... rest of About content ... -->
    </div>
  </div>
</BaseLayout>
```

**Step 2: Create remaining static pages**

Create `src/pages/contact.astro`:

- Static contact form (React island for form handling)

Create `src/pages/size-guide.astro`:

- Static size guide content

Create `src/pages/jewelry-care.astro`:

- Static jewelry care instructions

Create `src/pages/warranty.astro`:

- Static warranty information

Create `src/pages/returns.astro`:

- Static returns policy

Create `src/pages/financing.astro`:

- Static financing information

Create `src/pages/privacy.astro`:

- Static privacy policy

**Step 3: Commit**

```bash
git add src/pages/
git commit -m "feat: create static content pages (about, contact, policies)"
```

---

### Task 2.6: Create 404 page

**Files:**

- Create: `src/pages/404.astro`

**Step 1: Create 404 page**

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import NotFound from '../components/NotFound';
---

<BaseLayout title="Page Not Found | Troves & Coves">
  <NotFound client:load />
</BaseLayout>
```

**Step 2: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: create 404 page"
```

---

## Phase 3: Component Migration

### Task 3.1: Migrate Header component

**Files:**

- Modify: `src/components/Header.tsx`
- Add: `client:load` directive for interactive elements

**Step 1: Review Header for interactivity**

The Header has:

- Mobile menu toggle (needs interactivity)
- Navigation links (static)

**Step 2: Update Header to work as island**

Edit `src/components/Header.tsx`:

- Add `client:load` to mobile menu only
- Keep nav links static

```tsx
// Header.tsx - minimal changes, mostly works as-is
// Just ensure all imports are correct
```

**Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: adapt Header component for Astro islands"
```

---

### Task 3.2: Migrate Footer component

**Files:**

- Modify: `src/components/Footer.tsx`

**Step 1: Review Footer**

Footer is mostly static - can be pure Astro.

**Step 2: Convert to Astro component**

Create `src/components/Footer.astro`:

```astro
---
const currentYear = new Date().getFullYear();
---

<footer class="bg-surface-100 border-t border-surface-200">
  <div class="container mx-auto px-4 py-8">
    <div class="grid md:grid-cols-3 gap-8">
      <!-- Brand -->
      <div>
        <h3 class="font-libre text-troves text-xl mb-4">
          Troves & Coves
        </h3>
        <p class="text-sm text-on-surface-variant">
          Handcrafted crystal jewelry from Winnipeg, Canada.
        </p>
      </div>

      <!-- Quick Links -->
      <div>
        <h4 class="font-semibold mb-4">Quick Links</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/trovesandcoves/about" class="hover:text-troves">About</a></li>
          <li><a href="/trovesandcoves/products" class="hover:text-troves">Products</a></li>
          <li><a href="/trovesandcoves/contact" class="hover:text-troves">Contact</a></li>
        </ul>
      </div>

      <!-- Legal -->
      <div>
        <h4 class="font-semibold mb-4">Legal</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/trovesandcoves/privacy" class="hover:text-troves">Privacy Policy</a></li>
          <li><a href="/trovesandcoves/returns" class="hover:text-troves">Returns</a></li>
          <li><a href="/trovesandcoves/warranty" class="hover:text-troves">Warranty</a></li>
        </ul>
      </div>
    </div>

    <div class="border-t border-surface-200 mt-8 pt-4 text-center text-sm text-on-surface-variant">
      <p>&copy; {currentYear} Troves & Coves. All rights reserved.</p>
    </div>
  </div>
</footer>
```

**Step 3: Update BaseLayout to use Astro Footer**

Edit `src/layouts/BaseLayout.astro`:

```astro
---
import Footer from '../components/Footer.astro';  // Change to .astro
---

<!-- In body -->
<Footer />
```

**Step 4: Commit**

```bash
git add src/components/Footer.astro src/layouts/BaseLayout.astro
git commit -m "feat: convert Footer to static Astro component"
```

---

### Task 3.3: Migrate Hero component

**Files:**

- Modify: `src/components/Hero.tsx`

**Step 1: Add data loader for static generation**

Edit `src/components/Hero.tsx`:

```tsx
// Add loader function for Astro
export async function loader() {
  // Fetch featured products
  const products = await getFeaturedProducts();
  return products;
}

interface HeroProps {
  products?: Product[];
}

export function Hero({ products = [] }: HeroProps) {
  // ... existing component code
}
```

**Step 2: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: adapt Hero component with data loader"
```

---

### Task 3.4: Migrate ProductCard component

**Files:**

- Modify: `src/components/ProductCard.tsx`

**Step 1: Ensure ProductCard is memoized**

```tsx
import { memo } from 'react';

export const ProductCard = memo(function ProductCard({
  product,
}: ProductCardProps) {
  // ... existing code
});
```

**Step 2: Commit**

```bash
git add src/components/ProductCard.tsx
git commit -m "feat: ensure ProductCard is optimized for React islands"
```

---

### Task 3.5: Migrate CartDrawer component

**Files:**

- Modify: `src/components/CartDrawer.tsx`

**Step 1: CartDrawer needs full React interactivity**

Ensure `client:load` is used in layout:

```astro
<CartDrawer client:load />
```

**Step 2: Refactor to use Astro-compatible state**

The cart state should use nanostate or similar for better SSR compatibility.

**Step 3: Commit**

```bash
git add src/components/CartDrawer.tsx
git commit -m "feat: adapt CartDrawer for Astro islands"
```

---

### Task 3.6: Migrate SearchBar component

**Files:**

- Modify: `src/components/SearchBar.tsx`

**Step 1: Add client directive**

Search needs `client:visible` for lazy hydration.

**Step 2: Commit**

```bash
git add src/components/SearchBar.tsx
git commit -m "feat: adapt SearchBar for Astro islands"
```

---

## Phase 4: Data Layer

### Task 4.1: Create data API layer

**Files:**

- Create: `src/lib/api.ts`
- Reference: `client/src/apiClient.ts`, `server/storage.ts`

**Step 1: Create data fetching utilities**

Create `src/lib/api.ts`:

```typescript
import type { Product } from '@shared/types';

// Import product data (could be from JSON or TS file)
import { products } from '../../server/authentic-products';

export async function getAllProducts(): Promise<Product[]> {
  return products;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.filter(p => p.featured);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find(p => p.slug === slug);
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  return products.filter(p => p.category === category);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase();
  return products.filter(
    p =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
  );
}
```

**Step 2: Commit**

```bash
git add src/lib/api.ts
git commit -m "feat: create data API layer for static generation"
```

---

### Task 4.2: Migrate cart state management

**Files:**

- Modify: `src/hooks/useCart.ts`, `src/lib/store.ts`

**Step 1: Simplify cart for Astro**

Cart can remain as React state since it's client-only.

**Step 2: Commit**

```bash
git add src/hooks/useCart.ts src/lib/store.ts
git commit -m "feat: adapt cart state for Astro islands"
```

---

## Phase 5: Integration and Polish

### Task 5.1: Update package.json scripts

**Files:**

- Modify: `package.json`

**Step 1: Replace Vite scripts with Astro scripts**

Edit `package.json` scripts section:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext .ts,.tsx,.astro",
    "format": "prettier --write ."
  }
}
```

**Step 2: Commit**

```bash
git add package.json
git commit -m "feat: update npm scripts for Astro"
```

---

### Task 5.2: Update GitHub Actions workflow

**Files:**

- Modify: `.github/workflows/deploy.yml`

**Step 1: Update build job**

Edit `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [prod]
  workflow_dispatch:

concurrency:
  group: 'pages'
  cancel-in-progress: true

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Astro site
        run: npm run build

      - name: Install Playwright browsers
        run: npx playwright install chromium

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: update CI workflow for Astro build"
```

---

### Task 5.3: Update E2E tests for Astro output

**Files:**

- Modify: `tests/e2e/*.spec.ts`

**Step 1: Update base URL in Playwright config**

Edit `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run preview',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 2: Run tests to verify**

```bash
npm run build && npm run test:e2e
```

**Step 3: Commit**

```bash
git add playwright.config.ts tests/e2e/
git commit -m "feat: update E2E tests for Astro"
```

---

### Task 5.4: Create sitemap generation

**Files:**

- Create: `scripts/generate-sitemap.ts`

**Step 1: Create sitemap generator**

Create `scripts/generate-sitemap.ts`:

```typescript
import fs from 'fs';
import { getAllProducts } from '../src/lib/api';

const SITE_URL = 'https://trovesandcoves.ca/trovesandcoves';

const staticPages = [
  '',
  '/about',
  '/contact',
  '/products',
  '/size-guide',
  '/jewelry-care',
  '/warranty',
  '/returns',
  '/financing',
  '/privacy',
];

async function generateSitemap() {
  const products = await getAllProducts();

  const urls = [
    ...staticPages.map(p => `${SITE_URL}${p}`),
    ...products.map(p => `${SITE_URL}/products/${p.slug}`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>`;

  fs.writeFileSync('dist/sitemap.xml', sitemap);
  console.log('Sitemap generated!');
}

generateSitemap();
```

**Step 2: Update build script**

Edit `package.json`:

```json
{
  "scripts": {
    "build": "astro check && astro build && tsx scripts/generate-sitemap.ts"
  }
}
```

**Step 3: Commit**

```bash
git add scripts/generate-sitemap.ts package.json
git commit -m "feat: add sitemap generation"
```

---

### Task 5.5: Cleanup old files

**Files:**

- Remove: `client/`, `server/`, `vite.config.ts`, `index.html`

**Step 1: Remove deprecated directories**

```bash
# Remove old client directory
rm -rf client/

# Remove server directory (no longer needed for static site)
rm -rf server/

# Remove old config files
rm vite.config.ts index.html

# Keep shared/ for types and config
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: remove deprecated React+Vite files"
```

---

### Task 5.6: Create robots.txt

**Files:**

- Create: `public/robots.txt`

**Step 1: Create robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://trovesandcoves.ca/trovesandcoves/sitemap.xml
```

**Step 2: Commit**

```bash
git add public/robots.txt
git commit -m "feat: add robots.txt"
```

---

### Task 5.7: Final testing and validation

**Files:**

- Test: All pages, components, E2E tests

**Step 1: Run full test suite**

```bash
npm run check        # TypeScript
npm run lint         # ESLint
npm run test         # Vitest
npm run build        # Astro build
npm run test:e2e     # Playwright
```

**Step 2: Manual smoke test**

```bash
npm run preview
```

Visit `http://localhost:4321` and verify:

- Homepage loads correctly
- Navigation works
- Products page loads
- Individual product pages load
- Cart drawer opens/closes
- Search works
- All static pages render

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Astro migration - ready for merge"
```

---

## Post-Migration Checklist

After completing all tasks, verify:

- [ ] All pages render correctly in development
- [ ] Production build completes without errors
- [ ] E2E tests pass against built site
- [ ] GitHub Actions workflow runs successfully
- [ ] Site deploys correctly to GitHub Pages
- [ ] All interactive features work (cart, search, navigation)
- [ ] Design is preserved (fonts, colors, spacing)
- [ ] SEO meta tags are present on all pages
- [ ] Performance is improved (Lighthouse score check)
- [ ] Accessibility is maintained (a11y tests pass)

---

## Rollback Plan

If issues arise:

1. Delete the feat/astro-migration branch
2. Check out main: `git checkout main`
3. No production impact (migration happens on feature branch)

---

## Migration Benefits

After migration, the site will have:

- **Better SEO**: Server-rendered HTML with meta tags
- **Faster initial load**: Zero JavaScript by default (only loads for islands)
- **Smaller bundle sizes**: Code splitting by default
- **Simpler routing**: File-based instead of JS router
- **Better DX**: Faster build times, clearer project structure
- **Future-ready**: Easy to add React Server Components when available
