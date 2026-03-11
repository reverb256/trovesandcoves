# Troves & Coves Design Specification

**Last Updated:** March 11, 2026
**Status:** Active - Site is live at trovesandcoves.ca

## Brand Identity

**Brand Voice:** Mystical, transformative, empowering, elegant

**Tagline:** "Handcrafted Crystal Jewelry"

**Core Transformation Message:**
```
Discover the power of transformation with our handcrafted crystal jewelry.

Each piece is designed to elevate your style and spirit, blending the elegance
of 14k gold-plated chains with the raw beauty of natural crystals.

Our statement necklaces and bracelets offer more than just luxury—they're
crafted with intention to empower your energy and enhance your unique presence.

Embrace bold femininity and masculine strength with our exquisite collection,
where every detail resonates with abundance and confidence.
```

**Uniqueness Statement:**
"Each piece uniquely one of a kind"

---

## Color Palette

### Primary Brand Colors (Robin's Exact Specifications)

| Color Name | Hex | HSLA | Usage |
|------------|-----|------|-------|
| Turquoise | `#4abfbf` | `hsla(174, 85%, 45%, 1)` | TROVES text, primary actions, links, accents |
| Gold 1 | `#deb55b` | `hsla(43, 95%, 55%, 1)` | & symbol, prices, icons, decorative elements |
| Gold 2 | `#e1af2f` | `hsla(38, 80%, 53%, 1)` | Coves text, gemstone labels |
| Linen | `#faf8f3` | N/A | Background (off-white/cream) |

### WCAG Compliant Variants

For small text and accessibility requirements:
- Dark turquoise: `#2c6f6f` (WCAG AA compliant for body text)
- Dark gold 1: `#b8943d` (WCAG AA compliant)
- Dark gold 2: `#a08022` (WCAG AA compliant)

### Theme Variables (CSS)

```css
:root, :root[data-theme='light'] {
  --accent-vibrant: 174 85% 51%;    /* #4abfbf */
  --gold-medium: 43 78% 60%;          /* #deb55b */
  --gold-coves: 38 80% 53%;           /* #e1af2f */
  --bg-primary: 40 20% 97%;            /* #faf8f3 */
  --text-primary: 0 0% 12%;           /* #1f1f1f */
  --text-secondary: 0 0% 37%;         /* #5f5f5f */
}

:root[data-theme='dark'] {
  --accent-vibrant: 174 100% 65%;   /* Brighter for dark mode */
  --gold-medium: 43 78% 55%;
  --bg-primary: 215 20% 12%;
  --text-primary: 215 15% 95%;
  --text-secondary: 215 10% 82%;
}
```

---

## Typography

### Font Families

| Purpose | Font | Weight | Style |
|---------|------|--------|-------|
| Brand/Titles | **Libre Baskerville** | 700 (Bold) | Uppercase, text-transform |
| Accent/Script | **Alex Brush** | Regular | Cursive, decorative |
| Body/UI | **Montserrat** | 400-600 | Sans-serif |

### Typography Hierarchy

```
HERO TITLE (TROVES)
├── Font: Libre Baskerville
├── Weight: 700 (Bold)
├── Color: hsl(var(--accent-vibrant))
├── Transform: Uppercase
└── Size: 4xl → 6xl (responsive)

& SYMBOL
├── Font: Alex Brush
├── Color: hsl(var(--gold-medium))
└── Size: 3xl → 5xl

HERO TITLE (Coves)
├── Font: Alex Brush
├── Color: hsl(var(--gold-coves))
└── Size: 4xl → 6xl

TAGLINE/SUBTITLE
├── Font: Montserrat
├── Color: hsl(var(--text-secondary))
├── Weight: 400
└── Text: "Handcrafted Crystal Jewelry"

BODY TEXT
├── Font: Montserrat
├── Color: hsl(var(--text-primary))
└── Weight: 400-500

PRICES
├── Font: Libre Baskerville
├── Color: hsl(var(--gold-medium))
└── Weight: 700 (Bold)

GEMSTONE LABELS
├── Font: Alex Brush
├── Color: hsl(var(--gold-coves))
└── Size: text-xl
```

---

## Care Instructions

**Label:** "Care:" (not "Care Instructions")

**Copy:**
```
• Avoid water, perfumes, and lotions.
• Wipe with a dry jewelry cloth
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

## Component Patterns

### Hero Section

```
┌─────────────────────────────────────────────┐
│         [Mystical Background Glows]         │
│  ┌──────────────┐                            │
│  │   💎         │  [Gem Icon: 128px]        │
│  │              │  Position: Center          │
│  │   TROVES &   │  Font: Libre + Alex Brush │
│  │   Coves      │  Color: #4abfbf, golds    │
│  └──────────────┘                            │
│                                              │
│  Handcrafted Crystal Jewelry                 │
│  Made in Canada                             │
│                                              │
│                    ▼                         │
└─────────────────────────────────────────────┘
```

### Product Card

```
┌─────────────────────────────┐
│  [Product Image]            │
│  💎 Featured Badge          │
│                             │
│  Category Badge             │
│  Product Name               │
│  Materials                  │
│  Gemstones (Alex Brush)     │
│                             │
│  Price (#deb55b)    [Cart]  │
│              (#4abfbf btn)  │
└─────────────────────────────┘
```

### Product Detail Page

```
┌─────────────────────────────────────────┐
│  [Breadcrumbs] Home → Shop → Product │
│                                           │
│  ┌──────────────┐  [Product Info]    │
│  │              │                   │
│  │ [Main Image]  │  Product Name      │
│  │              │  Description       │
│  │ [Thumbnails]  │  Materials         │
│  │              │  Gemstones         │
│  │              │  Price             │
│  └──────────────┘  [Add to Cart]     │
│                                           │
│  Care:                                   │
│  • Avoid water, perfumes, and lotions  │
│  • Wipe with a dry jewelry cloth        │
│                                           │
└─────────────────────────────────────────┘
```

### Features Bar

```
┌──────────────────────────────────────────────┐
│   Free Shipping Across Canada    🚚         │
│   Lifetime Warranty               🛡️         │
│   Ethically Sourced               💎         │
│                                              │
│  [Gold Glow Border]                         │
└──────────────────────────────────────────────┘
```

---

## Copy Guidelines

### Brand Voice

- **Mystical** - Use words like "transform," "energy," "intention," "crystal wisdom"
- **Empowering** - Focus on elevation, amplification, inner light
- **Elegant** - Sophisticated language, avoid slang
- **Authentic** - Emphasize handcrafted, one-of-a-kind, genuine

### Mandatory Copy Elements

**Hero Section (Hero.tsx):**
- Tagline: "Handcrafted Crystal Jewelry"
- Subtitle: "Made in Canada"

**Product Detail (ProductDetail.tsx):**
- Care section with label "Care:"
- Instructions:
  - "Avoid water, perfumes, and lotions."
  - "Wipe with a dry jewelry cloth"

**About Page (About.tsx):**
- Hero transformation message (full 4 paragraphs)
- "Each piece uniquely one of a kind" (prominent display)

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
/* Gentle mystical animations */
float: 6-10s ease-in-out infinite
glow-breathe: 4-6s ease-in-out infinite
pulse-glow: 2-3s ease-in-out infinite
transition: 300ms (standard hover states)
transition: 500ms (card hover states)
```

---

## Accessibility Notes

- Use Robin's exact colors (`#4abfbf`, `#deb55b`, `#e1af2f`) for large text only
- Use WCAG-compliant dark variants for body text
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text
- All interactive elements must have visible hover/focus states
- ARIA labels on all icon-only buttons
- Skip navigation link implemented
- Semantic HTML elements throughout

---

## Implementation Status

### ✅ Completed Features

- [x] Color palette with CSS variables
- [x] Typography system with 3 fonts
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

### 📝 Copy Elements Implemented

- [x] Hero tagline: "Handcrafted Crystal Jewelry"
- [x] "Made in Canada" subtitle
- [x] Product care instructions (exact copy)
- [x] SEO-optimized titles and descriptions
- [ ] About page transformation message (needs manual update)

### 🔄 In Progress

- [ ] About page hero section (transformation message)
- [ ] "Each piece uniquely one of a kind" prominent display
- [ ] Value proposition statements

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
    └── REFACTOR_SUMMARY.md      # Architecture guide
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
- [ ] All turquoise accents use `#4abfbf` (no variations)
- [ ] All gold elements use `#deb55b` (primary) or `#e1af2f` (secondary)
- [ ] Libre Baskerville used for brand text
- [ ] Alex Brush used for script/accent text
- [ ] Montserrat used for body/UI text

### Copy Standards
- [ ] Hero tagline: "Handcrafted Crystal Jewelry"
- [ ] Care instructions: "Care:" + exact copy
- [ ] About page: Full transformation message
- [ ] "Each piece uniquely one of a kind" prominent

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

**Version:** 2.0
**Status:** Live
**URL:** https://trovesandcoves.ca
**Last Review:** March 11, 2026
