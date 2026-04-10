# SEO Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix critical SEO issues blocking organic search traffic - duplicate title tags, missing meta descriptions, and breadcrumb schema.

**Architecture:** Enhance existing SEOHead component with page-specific titles/meta, add BreadcrumbSchema component for structured data.

**Tech Stack:** React, TypeScript, Wouter routing, Schema.org JSON-LD

---

## Task 1: Read and understand current SEOHead component

**Files:**

- Read: `client/src/components/SEOHead.tsx`
- Read: `client/src/components/SchemaOrg.tsx` (for reference)

**Step 1: Read current SEOHead implementation**

Run: `cat client/src/components/SEOHead.tsx`

Expected: See current component with basic title/meta structure

---

## Task 2: Create page metadata configuration

**Files:**

- Create: `client/src/lib/pageMetadata.ts`

**Step 1: Write the page metadata constants file**

```typescript
// client/src/lib/pageMetadata.ts

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
}

export const pageMetadata: Record<string, PageMetadata> = {
  '/': {
    title:
      'Troves & Coves - Handcrafted Crystal Jewelry | 14k Gold-Plated Statement Pieces',
    description:
      'Discover handcrafted crystal jewelry with timeless elegance. Shop unique crystal necklaces & bracelets crafted in Winnipeg, Canada.',
    keywords:
      'crystal jewelry, handcrafted jewelry, Winnipeg, 14k gold-plated, wire wrapped',
  },
  '/products': {
    title:
      'Shop Crystal Jewelry | Handcrafted Necklaces & Bracelets | Troves & Coves',
    description:
      'Browse our collection of handcrafted crystal jewelry. Wire-wrapped pendants, gemstone necklaces, and leather cord pendants.',
    keywords:
      'crystal necklaces, gemstone jewelry, leather cord pendants, handmade',
  },
  '/about': {
    title: 'About Troves & Coves | Handcrafted in Winnipeg, Canada',
    description:
      'Learn about Troves & Coves - handcrafted crystal jewelry made with love in Winnipeg, Manitoba. Each piece tells a story.',
    keywords: 'about, artisan jewelry, Winnipeg, Manitoba, handmade',
  },
  '/contact': {
    title: 'Contact Us | Custom Crystal Jewelry Orders | Troves & Coves',
    description:
      'Get in touch for custom crystal jewelry orders or questions. We love hearing from you.',
    keywords: 'contact, custom jewelry, orders, support',
  },
  '/checkout': {
    title: 'Checkout | Secure Payment | Troves & Coves',
    description:
      'Complete your crystal jewelry purchase. Secure checkout with multiple payment options.',
    keywords: 'checkout, payment, secure',
  },
  '/size-guide': {
    title: 'Size Guide | Find Your Perfect Fit | Troves & Coves',
    description:
      'Find your perfect fit with our comprehensive jewelry size guide. Necklace lengths, bracelet sizes, and more.',
    keywords: 'size guide, jewelry sizing, necklace length',
  },
  '/jewelry-care': {
    title: 'Jewelry Care Guide | Keep Your Crystals Beautiful | Troves & Coves',
    description:
      'Learn how to care for your handcrafted crystal jewelry. Cleaning tips, storage advice, and maintenance guidelines.',
    keywords: 'jewelry care, crystal cleaning, jewelry maintenance',
  },
  '/warranty': {
    title: 'Lifetime Warranty | Quality Guarantee | Troves & Coves',
    description:
      'Every piece of Troves & Coves jewelry comes with a lifetime warranty. Learn about our quality guarantee.',
    keywords: 'warranty, guarantee, quality',
  },
  '/returns': {
    title: 'Returns & Exchanges | Hassle-Free Policy | Troves & Coves',
    description:
      'Our hassle-free return and exchange policy. We want you to love your crystal jewelry.',
    keywords: 'returns, exchanges, policy, refund',
  },
  '/financing': {
    title: 'Flexible Payment Options | Shop Now Pay Later | Troves & Coves',
    description:
      'Flexible payment options for your crystal jewelry. Shop now and pay later with Sezzle or PayPal.',
    keywords: 'financing, payment plans, shop now pay later',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | How We Protect Your Data | Troves & Coves',
    description:
      'Your privacy matters. Learn how we protect your data and never sell your information.',
    keywords: 'privacy policy, data protection, GDPR',
  },
};

// Helper function to get metadata for a path
export function getPageMetadata(
  path: string,
  productName?: string
): PageMetadata {
  // Handle product detail pages
  if (productName && path.startsWith('/product/')) {
    return {
      title: `${productName} | Handcrafted Crystal Jewelry | Troves & Coves`,
      description: `Shop ${productName} - handcrafted with 14k gold-filled wire and genuine gemstones. Made in Winnipeg, Canada.`,
      keywords: `${productName}, crystal jewelry, handmade`,
    };
  }

  // Return matching page metadata or default
  return pageMetadata[path] || pageMetadata['/'];
}
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors (new file, no imports yet)

---

## Task 3: Update SEOHead component to use page metadata

**Files:**

- Modify: `client/src/components/SEOHead.tsx`

**Step 1: Read current SEOHead to understand structure**

Run: `cat client/src/components/SEOHead.tsx`

Note the current props interface and how title/meta are set

**Step 2: Add import for pageMetadata**

Add this import at the top of the file:

```typescript
import { getPageMetadata } from '@/lib/pageMetadata';
```

**Step 3: Update the component to use pageMetadata**

Find the existing title and meta description logic. Replace with:

```typescript
// Get page-specific metadata
const metadata = getPageMetadata(path, productName);
```

Then update the title tag to use `metadata.title`

**Step 4: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 5: Commit**

```bash
git add client/src/lib/pageMetadata.ts client/src/components/SEOHead.tsx
git commit -m "feat: add page-specific titles and meta descriptions

- Create centralized page metadata configuration
- Update SEOHead to use page-specific titles and descriptions
- Fixes duplicate title tag issue identified in SEO audit
"
```

---

## Task 4: Create BreadcrumbSchema component

**Files:**

- Create: `client/src/components/BreadcrumbSchema.tsx`

**Step 1: Write BreadcrumbSchema component**

```typescript
// client/src/components/BreadcrumbSchema.tsx
import { useMemo } from 'react';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://trovesandcoves.ca${item.path}`,
    })),
  }), [items]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add client/src/components/BreadcrumbSchema.tsx
git commit -m "feat: add BreadcrumbSchema component for SEO

- Implements Schema.org BreadcrumbList structured data
- Helps search engines understand site navigation structure
- Enables rich breadcrumb display in search results
"
```

---

## Task 5: Add BreadcrumbSchema to ProductDetail page

**Files:**

- Modify: `client/src/pages/ProductDetail.tsx`

**Step 1: Find breadcrumb items in ProductDetail**

Search for existing breadcrumb rendering (around line 110-120)

**Step 2: Add BreadcrumbSchema import**

```typescript
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
```

**Step 3: Add BreadcrumbSchema component before return**

Add this before the SEOHead component in the return statement:

```tsx
<BreadcrumbSchema items={breadcrumbItems} />
```

Where `breadcrumbItems` should match your existing breadcrumb data structure

**Step 4: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 5: Test in development**

Run: `npm run dev`

Visit: http://localhost:5173/product/1

Check browser DevTools → Application → Search for "BreadcrumbList"

**Step 6: Commit**

```bash
git add client/src/pages/ProductDetail.tsx
git commit -m "feat: add breadcrumb schema to product pages

- Adds BreadcrumbSchema component to ProductDetail page
- Improves SEO with structured navigation data
"
```

---

## Task 6: Add BreadcrumbSchema to Products page (categories)

**Files:**

- Modify: `client/src/pages/Products.tsx`

**Step 1: Import BreadcrumbSchema**

```typescript
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
```

**Step 2: Generate breadcrumb items based on current category**

Add this after the category definition:

```typescript
const breadcrumbItems = useMemo(() => {
  const items = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
  ];

  if (currentCategory) {
    items.push({
      name: currentCategory.name,
      path: `/products/${currentCategory.slug}`,
    });
  }

  if (searchQuery) {
    items.push({
      name: `Search: "${searchQuery}"`,
      path: window.location.pathname,
    });
  }

  return items;
}, [currentCategory, searchQuery]);
```

**Step 3: Add BreadcrumbSchema to component return**

Add before SEOHead in the return:

```tsx
<BreadcrumbSchema items={breadcrumbItems} />
```

**Step 4: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 5: Commit**

```bash
git add client/src/pages/Products.tsx
git commit -m "feat: add breadcrumb schema to products page

- Dynamically generates breadcrumbs based on category/search
- Adds structured data for better SEO
"
```

---

## Task 7: Update H1 tags with keywords

**Files:**

- Modify: `client/src/pages/Home.tsx`
- Modify: `client/src/pages/Products.tsx`

**Step 1: Update Home page H1**

Find the H1 in Home.tsx (around line 50-70)

Update to include keywords:

```tsx
<h1
  className="text-4xl md:text-6xl font-bold"
  style={{ fontFamily: '"Libre Baskerville", serif' }}
>
  Handcrafted Crystal Jewelry & 14k Gold-Plated Necklaces | Troves & Coves
</h1>
```

**Step 2: Update Products page H1**

Find the main H1 in Products.tsx

Update based on context:

```tsx
<h1 className="text-4xl md:text-6xl font-bold mb-6 flex flex-col md:flex-row items-center justify-center gap-3">
  {currentCategory ? (
    <>
      <span>{currentCategory.name}</span>
      <span className="text-sm md:text-base font-normal">
        | Handcrafted in Winnipeg
      </span>
    </>
  ) : searchQuery ? (
    <>
      <span>Search Results for</span>
      <span>"{searchQuery}"</span>
    </>
  ) : (
    <>
      <span>Shop Crystal Jewelry</span>
      <span>& Necklaces & Bracelets</span>
    </>
  )}
</h1>
```

**Step 3: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 4: Commit**

```bash
git add client/src/pages/Home.tsx client/src/pages/Products.tsx
git commit -m "seo: optimize H1 tags with target keywords

- Home page H1 now includes 'crystal jewelry' and 'gold-plated'
- Products page H1 includes location and category keywords
- Improves semantic SEO for target search terms
"
```

---

## Task 8: Add BreadcrumbSchema to remaining pages

**Files:**

- Modify: `client/src/pages/About.tsx`
- Modify: `client/src/pages/Contact.tsx`
- Modify: `client/src/pages/Checkout.tsx`

**Step 1: Update About page**

```typescript
// Add import
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

// Add before return
const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
];

// Add to JSX before SEOHead
<BreadcrumbSchema items={breadcrumbItems} />
```

**Step 2: Update Contact page**

```typescript
const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
];
```

**Step 3: Update Checkout page**

```typescript
const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/products' },
  { name: 'Checkout', path: '/checkout' },
];
```

**Step 4: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 5: Commit**

```bash
git add client/src/pages/About.tsx client/src/pages/Contact.tsx client/src/pages/Checkout.tsx
git commit -m "feat: add breadcrumb schema to static pages

- Adds BreadcrumbSchema to About, Contact, and Checkout pages
- Completes breadcrumb schema coverage for main user flows
"
```

---

## Task 9: Update .env.example with GA4 configuration

**Files:**

- Modify: `.env.example`

**Step 1: Add GA4 configuration to .env.example**

```bash
cat >> .env.example << 'EOF'

# Analytics
VITE_GA4_ID=G-XXXXXXXXXX
EOF
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add GA4 analytics to environment config"
```

---

## Task 10: Verify SEO improvements in development

**Files:**

- Test: Manual verification

**Step 1: Start development server**

Run: `npm run dev`

**Step 2: Verify title tags change per page**

Visit each URL and check `<title>` tag:

- http://localhost:5173/
- http://localhost:5173/products
- http://localhost:5173/about
- http://localhost:5173/contact

Expected: Each page has unique title

**Step 3: Verify meta descriptions**

For each page, check `<meta name="description">` tag in DevTools

Expected: Each page has unique description

**Step 4: Verify breadcrumb schema**

For each page, check DevTools → Console → Type:

```javascript
JSON.parse(
  document.querySelector('script[type="application/ld+json"]').textContent
);
```

Expected: BreadcrumbList schema present

**Step 5: Test product page breadcrumbs**

Visit: http://localhost:5173/product/1

Check breadcrumb schema includes: Home → Shop → Product Name

---

## Task 11: Run test suite to ensure no regressions

**Files:**

- Test: All tests

**Step 1: Run unit tests**

Run: `npm run test`

Expected: All tests pass

**Step 2: Run type check**

Run: `npm run check`

Expected: No errors

**Step 3: Run linter**

Run: `npm run lint`

Expected: No errors (or only warnings)

---

## Task 12: Build production bundle to verify

**Files:**

- Test: Production build

**Step 1: Run production build**

Run: `npm run build`

Expected: Build succeeds with no errors

**Step 2: Check generated sitemap**

Run: `cat dist/public/sitemap.xml`

Expected: XML sitemap generated successfully

---

## Task 13: Update sitemap generator for new pages

**Files:**

- Modify: `scripts/generate-sitemap.ts`

**Step 1: Read current sitemap generator**

Run: `head -50 scripts/generate-sitemap.ts`

Note the structure and existing static pages

**Step 2: Add any missing pages to staticPages array**

Ensure these pages are included:

- /financing
- /jewelry-care
- /warranty
- /returns
- /privacy-policy
- /size-guide

**Step 3: Run sitemap generation**

Run: `npm run generate-sitemap`

Expected: No errors, sitemap updated

**Step 4: Commit**

```bash
git add scripts/generate-sitemap.ts
git commit -m "fix: ensure all policy pages are in sitemap"
```

---

## Task 14: Final verification and documentation

**Files:**

- Create: `docs/plans/2026-03-13-seo-completion-report.md`

**Step 1: Create completion report**

```markdown
# SEO Foundation Completion Report

**Date:** 2026-03-13
**Phase:** SEO Foundation (Phase 1)

## Completed Tasks

### 1. Page-Specific Title Tags

- [x] Created pageMetadata configuration
- [x] Updated SEOHead component
- [x] All pages now have unique, keyword-rich titles

### 2. Meta Descriptions

- [x] Added unique descriptions for all main pages
- [x] Descriptions include relevant keywords and CTAs

### 3. Breadcrumb Schema

- [x] Created BreadcrumbSchema component
- [x] Added to ProductDetail page
- [x] Added to Products page (dynamic)
- [x] Added to About, Contact, Checkout pages

### 4. H1 Optimization

- [x] Home page H1 includes "crystal jewelry" keywords
- [x] Products page H1 includes location context

## Results

### Before

- All pages shared same title tag
- No breadcrumb schema
- Generic H1 tags

### After

- Unique titles for 11+ pages
- BreadcrumbList schema on all main pages
- Keyword-optimized H1 tags

## Expected Impact

- +30-50% organic traffic increase within 3 months
- Better search result appearance with rich snippets
- Improved keyword rankings for target terms
```

**Step 2: Commit report**

```bash
git add docs/plans/2026-03-13-seo-completion-report.md
git commit -m "docs: add SEO foundation completion report"
```

---

## Testing Checklist

Before marking this complete, verify:

- [ ] All pages have unique title tags (manual test)
- [ ] All pages have unique meta descriptions (manual test)
- [ ] Breadcrumb schema present on main pages (DevTools check)
- [ ] Product pages include product name in title
- [ ] Category pages include category name in title
- [ ] All tests pass: `npm run test`
- [ ] TypeScript check passes: `npm run check`
- [ ] Linting passes: `npm run lint`
- [ ] Production build succeeds: `npm run build`
- [ ] Sitemap generates correctly: `npm run generate-sitemap`

---

**Total Estimated Time:** 3-4 hours

**Dependencies:** None (can be done independently)
