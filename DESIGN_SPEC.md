# Troves & Coves Design Specification

**Last Updated:** March 11, 2026
**Status:** Active - Site is live at trovesandcoves.ca
**Primary Source:** Robin's Luxury Refinement Guide

---

## Brand Positioning

### Troves & Coves Is

**Luxury Artisan Jewelry**

- Intentional crystal pieces
- Curated boutique brand
- Handmade but elevated
- Authentic handmade luxury
- Edgy artisan energy
- Real materials with real intention

### Troves & Coves Is NOT

❌ Craft show jewelry
❌ Etsy-style crystal shop
❌ Mystical / spiritual supply store
❌ New-age / metaphysical store

**The pieces are strong. The presentation must match their value.**

---

## Color Palette (Robin's Exact Specifications)

### Primary Luxury Palette

| Color Name       | Hex       | Usage                                        |
| ---------------- | --------- | -------------------------------------------- |
| Background       | `#FFFFFF` | Main site background (pure white, not cream) |
| Primary Text     | `#1F1F1F` | Main text (soft black/charcoal)              |
| Secondary Text   | `#5F5F5F` | Muted grey for supporting text               |
| Accent Turquoise | `#3A8E8B` | Signature turquoise (luxury version)         |
| Gold Accent      | `#C9A24A` | Refined gold for highlights only             |

### Usage Principles

**Gold Should Be Used Sparingly**

- Too much gold looks cheap
- Use for refined luxury details, borders, subtle highlights
- Premium emphasis only - not loud
- Less gold = more luxury feel

**Overall Direction**

- Luxury, clean, airy, feminine, intentional, high-end
- Avoid looking too bright, childish, or overly mystical
- Let the pieces speak for themselves

### Theme Variables (CSS)

```css
:root,
:root[data-theme='light'] {
  /* Robin's luxury palette */
  --accent-vibrant: 176 42% 39%; /* #3A8E8B - luxury turquoise */
  --gold-medium: 42 74% 54%; /* #C9A24A - refined gold */
  --bg-primary: 0 0% 100%; /* #FFFFFF - pure white */
  --text-primary: 0 0% 12%; /* #1F1F1F - soft black */
  --text-secondary: 0 0% 37%; /* #5F5F5F - muted grey */
}

:root[data-theme='dark'] {
  --accent-vibrant: 176 42% 49%; /* Slightly brighter for dark mode */
  --gold-medium: 42 74% 54%;
  --bg-primary: 215 20% 12%;
  --text-primary: 215 15% 95%;
  --text-secondary: 215 10% 82%;
}
```

---

## Typography

### Font Families (Keep Current Trio)

| Purpose       | Font                  | Weight     | Style               |
| ------------- | --------------------- | ---------- | ------------------- |
| Headlines     | **Libre Baskerville** | 700 (Bold) | Elegant, editorial  |
| Accent/Script | **Alex Brush**        | Regular    | Decorative, cursive |
| Body/UI       | **Montserrat**        | 400-600    | Clean, readable     |

### Typography Principles

**Headlines Should Feel:**

- Elegant and editorial
- Luxurious without being ornate
- Strong and confident

**Body Text Should Be:**

- Clean and readable
- Professional and understated
- Let the jewelry shine

### Typography Hierarchy

```
HERO TITLE (TROVES)
├── Font: Libre Baskerville
├── Weight: 700 (Bold)
├── Color: #3A8E8B (luxury turquoise)
├── Transform: Uppercase
└── Size: 4xl → 6xl (responsive)

& SYMBOL
├── Font: Alex Brush
├── Color: #C9A24A (refined gold)
└── Size: 3xl → 5xl

HERO TITLE (Coves)
├── Font: Alex Brush
├── Color: #C9A24A (refined gold)
└── Size: 4xl → 6xl

TAGLINE/SUBTITLE
├── Font: Montserrat
├── Color: #5F5F5F (muted grey)
├── Weight: 400
└── Text: "Handcrafted Crystal Jewelry"

BODY TEXT
├── Font: Montserrat
├── Color: #1F1F1F (soft black)
└── Weight: 400-500

PRICES
├── Font: Libre Baskerville
├── Color: #C9A24A (refined gold)
└── Weight: 700 (Bold)
```

---

## Copy Standards

### Hero Section

**Structure (Simple, Clean, Elevated):**

```
TROVES & COVES

Handcrafted Crystal Jewelry
Made in Canada

[Shop the Collection]
```

**That's it.**

- Minimal text
- Large image
- Elegant spacing
- Let the pieces speak

### Product Descriptions

**Avoid Heavy Metaphysical Language:**
❌ "psychic protection energy crystal vibration talisman"

**Keep Descriptions Short and Refined:**
✅ "Lapis Lazuli Necklace
14k Gold Filled

A deep blue stone traditionally associated with wisdom and inner clarity."

### Tagline

**Primary:** "Handcrafted Crystal Jewelry"
**Subtitle:** "Made in Canada"

### About the Brand

**Example Copy:**

```
Troves & Coves creates one-of-a-kind crystal jewelry using genuine
stones and high quality metals.

Each piece is handcrafted in Canada and designed to feel powerful,
grounded, and timeless.
```

### Uniqueness Statement

**Display Prominently:**
"Each piece uniquely one of a kind"

---

## Collection Structure

### Remove "Mystical Collection"

This wording pushes the brand into new-age crystal shop identity.

### Replace With Minimal Luxury Names

**Recommended:**

- Signature Pieces
- One of a Kind
- Crystal Editions
- The Collection
- Troves
- Limited Pieces

**Or Keep It Simpler:**

- Necklaces
- Bracelets

**Luxury brands keep categories minimal.**

### Recommended Shop Structure

```
Shop

• Necklaces
• Bracelets
• One of a Kind (optional)

Later expansion options:
• Limited Editions
```

**Don't overwhelm visitors with many categories.**

---

## Care Instructions

**Label:** "Care:" (not "Care Instructions")

**Copy:**

```
• Avoid water, perfumes, and lotions.
• Wipe with a dry jewelry cloth
```

---

## Homepage Structure

### 1. Hero Section

**Large image of jewelry**

```
TROVES & COVES

Handcrafted Crystal Jewelry
Made in Canada

[Shop Collection]
```

### 2. Featured Pieces

**Display 3 to 6 products only**

- Focus on your strongest pieces
- Let photography shine

### 3. About the Brand

```
Troves & Coves creates one-of-a-kind crystal jewelry using genuine
stones and high quality metals.

Each piece is handcrafted in Canada and designed to feel powerful,
grounded, and timeless.
```

### 4. Shop Section

```
Shop Necklaces
Shop Bracelets

Optional later:
One of a Kind
```

---

## Key Luxury Brand Principles

**Luxury Websites Remove Noise**

✓ Fewer words
✓ Fewer categories
✓ More white space
✓ Stronger photography
✓ Cleaner typography

**Let the pieces speak for themselves.**

---

## Component Patterns

### Hero Section

```
┌─────────────────────────────────────────────┐
│                                             │
│         [Large Jewelry Image]               │
│                                             │
│  TROVES & COVES                             │
│  Handcrafted Crystal Jewelry                 │
│  Made in Canada                             │
│                                             │
│                    [Shop Collection]        │
└─────────────────────────────────────────────┘
```

### Product Card

```
┌─────────────────────────────┐
│  [Product Image]            │
│  💎 Featured Badge          │
│                             │
│  Product Name               │
│  Materials                  │
│  Gemstones (Alex Brush)     │
│                             │
│  Price (#C9A24A)    [Cart]  │
│              (#3A8E8B btn)  │
└─────────────────────────────┘
```

---

## Architecture Overview

### Current Implementation (Static Serverless)

**Frontend:** GitHub Pages

- Pure static React build (Vite)
- No server-side rendering required
- Client-side routing via Wouter
- GitHub Actions for deployment

**Backend:** Serverless API (Vercel/Cloudflare Workers)

- Product catalog API
- Shopping cart management
- Order processing
- Stripe payment integration
- Contact form handling

**Database:** In-memory storage (MemStorage)

- Seeded product data
- Session-based cart management
- No external database dependency

**Deployment:**

- Frontend: `https://trovesandcoves.ca` (GitHub Pages)
- API: Cloudflare Workers (optional for serverless functions)
- Repository: `github.com/reverb256/trovesandcoves`

---

## Responsive Breakpoints

```
Mobile:   < 768px   (base styles)
Tablet:   768px - 1024px  (md:)
Desktop:  > 1024px  (lg:)
Large:    > 1280px  (xl:)
```

---

## Dark Mode Support

**Theme Toggle:** Implemented via ThemeProvider context

**Implementation:**

- `useTheme()` hook available in all components
- LocalStorage persistence: `trovesandcoves-theme`
- Data attribute on `documentElement`: `data-theme="light|dark"`
- CSS variables switch between themes automatically

**Dark Mode Colors:**

- Deep slate backgrounds with turquoise aura
- Brighter turquoise accents for visibility
- Muted gold tones for elegance
- All components theme-aware

---

## Animation Timing

```css
/* Gentle luxury animations */
float: 6-10s ease-in-out infinite
glow-breathe: 4-6s ease-in-out infinite
pulse-glow: 2-3s ease-in-out infinite
transition: 300ms (standard hover states)
transition: 500ms (card hover states)
```

---

## Accessibility Notes

- Use Robin's exact colors (#3A8E8B, #C9A24A) for large text only
- Use WCAG-compliant dark variants for body text
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text
- All interactive elements must have visible hover/focus states
- ARIA labels on all icon-only buttons
- Skip navigation link implemented
- Semantic HTML elements throughout

---

## Implementation Status

### ✅ Completed Features

- [x] Color palette with CSS variables (luxury version)
- [x] Typography system with 3 fonts (Libre + Alex + Montserrat)
- [x] Hero component with brand identity
- [x] Product cards with proper styling
- [x] Dark mode support throughout
- [x] Responsive design (mobile → desktop)
- [x] Care instructions on product pages
- [x] SEO optimization (title tags, meta descriptions)
- [x] Schema.org structured data
- [x] Shopping cart functionality
- [x] Static deployment to GitHub Pages
- [x] Etsy product synchronizer

### 🔄 In Progress

- [ ] Transition background from #faf8f3 to #FFFFFF (pure white)
- [ ] Update accent turquoise from #4abfbf to #3A8E8B (luxury version)
- [ ] Update gold accent from #deb55b/#e1af2f to #C9A24A (unified gold)
- [ ] Simplify hero section to minimal structure
- [ ] Update category names (remove "Mystical Collection")
- [ ] Reduce metaphysical language in product descriptions

---

## File Structure

```
trovesandcoves/
├── client/                      # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.tsx           # Brand hero with tagline
│   │   │   ├── Header.tsx         # Navigation + theme toggle
│   │   │   ├── Footer.tsx         # Brand footer
│   │   │   ├── ProductCard.tsx    # Product display cards
│   │   │   ├── SEOHead.tsx        # SEO meta tags
│   │   │   ├── SchemaOrg.tsx      # Structured data
│   │   │   └── ThemeProvider.tsx   # Dark mode context
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Products.tsx        # Product catalog
│   │   │   ├── ProductDetail.tsx   # Individual product
│   │   │   ├── About.tsx           # Brand story
│   │   │   ├── Contact.tsx         # Contact form
│   │   │   └── Checkout.tsx        # Cart/checkout
│   │   ├── lib/
│   │   │   ├── theme.tsx            # Theme provider
│   │   │   └── store.tsx            # Cart state
│   │   └── index.css              # Global styles + theme variables
├── server/                      # Development server
│   ├── storage.ts                # In-memory product storage
│   ├── routes.ts                 # API endpoints
│   └── sync-etsy-products.ts     # Etsy synchronizer
├── shared/                     # Shared types
│   ├── types.ts                 # TypeScript interfaces
│   ├── brand-config.ts          # Brand constants
│   └── locked-design-language.ts  # Design tokens
├── public/                     # Static assets
│   └── manifest.json             # PWA manifest
└── docs/                       # Documentation
    ├── DESIGN_SPEC.md           # This file
    └── COMPLIANCE_REPORT.md      # Implementation tracking
```

---

## Environment Variables

```bash
# Frontend (Vite)
VITE_API_URL=http://localhost:5000           # Dev API URL
VITE_CLOUDFLARE_API=https://...           # Production API (optional)
VITE_GITHUB_PAGES_URL=https://trovesandcoves.ca
VITE_BASE_PATH=/                           # GitHub Pages base path

# Stripe (Public)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## Deployment

### Frontend (GitHub Pages)

```bash
npm run build                    # Build for production
npm run deploy:github-pages      # Deploy to GitHub Pages
```

### Backend (Optional - Serverless)

```bash
# Deploy to Cloudflare Workers
npm run deploy:workers

# Or Vercel
vercel --prod
```

### Local Development

```bash
# Frontend (with HMR)
npm run dev

# Backend (Express dev server)
npm run dev
```

---

## Compliance Checklist

### Brand Identity

- [ ] Background is pure white (#FFFFFF) not cream
- [ ] All turquoise accents use #3A8E8B (luxury version)
- [ ] All gold elements use #C9A24A (unified refined gold)
- [ ] Libre Baskerville used for brand text
- [ ] Alex Brush used for script/accent text
- [ ] Montserrat used for body/UI text

### Copy Standards

- [ ] Hero tagline: "Handcrafted Crystal Jewelry"
- [ ] Care instructions: "Care:" + exact copy
- [ ] Hero section is minimal (3-4 lines max)
- [ ] "Each piece uniquely one of a kind" prominent
- [ ] No "Mystical Collection" category name
- [ ] Product descriptions are refined, not overly spiritual

### Technical Standards

- [ ] All pages have unique title tags
- [ ] All pages have meta descriptions
- [ ] Product pages have schema markup
- [ ] Dark mode works on all pages
- [ ] Mobile responsive on all pages
- [ ] Care instructions on all product pages

---

## File References

- Hero Component: `client/src/components/Hero.tsx`
- Header Component: `client/src/components/Header.tsx`
- Product Card: `client/src/components/ProductCard.tsx`
- Product Detail: `client/src/pages/ProductDetail.tsx`
- About: `client/src/pages/About.tsx`
- Footer: `client/src/components/Footer.tsx`
- Theme CSS: `client/src/index.css`
- Brand Config: `shared/brand-config.ts`
- Design Language: `shared/locked-design-language.ts`

---

**Version:** 3.0 (Luxury Refinement)
**Status:** Live - Transitioning to Luxury Brand
**URL:** https://trovesandcoves.ca
**Last Review:** March 11, 2026
**Primary Source:** Robin's Luxury Refinement Guide
