# Troves & Coves

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![Live Site](https://img.shields.io/badge/site-trovesandcoves.ca-teal.svg)](https://trovesandcoves.ca)

A modern crystal jewelry showcase platform featuring handcrafted pieces made in Winnipeg, Canada. Built with React, TypeScript, and Material You-inspired design.

---

## Table of Contents

- [What This Is](#what-this-is)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Design System](#design-system)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Roadmap](#roadmap)

---

## What This Is

Troves & Coves is a **static showcase site** for handcrafted crystal jewelry featuring:

- **Beautiful Product Catalog** - Browse necklaces, bracelets, and crystal jewelry
- **Material You Design** - Inspired by Google's design language with a warm cream color scheme
- **SEO Optimized** - Unique page titles, meta descriptions, and structured data (Breadcrumb schema)
- **Responsive** - Mobile-first design that works on all devices
- **Fast** - Static site with PWA support for offline capability
- **Etsy Integration** - Customers purchase through the Etsy storefront

### Current Features

| Feature | Status |
|---------|--------|
| Product catalog with categories | ✅ |
| Product search and filtering | ✅ |
| Cart functionality (localStorage) | ✅ |
| SEO meta tags and structured data | ✅ |
| Responsive design | ✅ |
| Etsy purchase integration | ✅ |
| PWA with service worker | ✅ |
| Auto-generated sitemap | ✅ |

### Not Implemented (Yet)

To be transparent about what this is **not**:

- ❌ No database (uses in-memory storage with seeded data)
- ❌ No payment processing (redirects to Etsy)
- ❌ No user authentication
- ❌ No admin dashboard

See [ROADMAP.md](ROADMAP.md) for planned future enhancements.

---

## Quick Start

### Prerequisites

- **Node.js** 18+ or 20+
- **npm** 8+ or **pnpm** / **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/reverb256/trovesandcoves.git
cd trovesandcoves

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at:
- **Frontend**: `http://localhost:5173`
- **API**: `http://localhost:5000` (development only)

### Environment Variables (Optional)

Create a `.env` file for optional configuration:

```bash
# GA4 Measurement ID (for analytics)
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Development API URL (default: http://localhost:5000)
VITE_API_URL=http://localhost:5000

# Production API URL (if using Cloudflare Workers)
VITE_CLOUDFLARE_API=https://api.trovesandcoves.ca
```

---

## Project Structure

```
trovesandcoves/
├── client/                    # React frontend (Vite root)
│   ├── src/
│   │   ├── components/       # React components (~30 custom components)
│   │   │   ├── ui/          # shadcn/ui base components
│   │   │   ├── Hero.tsx     # Hero section
│   │   │   ├── ProductCard.tsx
│   │   │   ├── SEOHead.tsx  # SEO meta tag component
│   │   │   └── ...
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   └── ...
│   │   ├── lib/             # Utilities
│   │   │   ├── pageMetadata.ts  # SEO metadata config
│   │   │   └── ...
│   │   ├── hooks/           # Custom React hooks
│   │   └── main.tsx         # React entry point
│   └── index.html           # HTML template
├── server/                   # Express.js backend (dev only)
│   ├── index.ts             # Server with Vite HMR
│   ├── routes.ts            # API routes
│   ├── storage.ts           # In-memory product data
│   └── security/            # Security middleware
├── shared/                   # Shared TypeScript code
│   ├── types.ts             # Type definitions
│   ├── brand-config.ts      # Brand/design tokens
│   └── locked-design-language.ts  # Design system constants
├── scripts/                  # Build and utility scripts
│   ├── postbuild-copy.cjs   # Post-build processing
│   └── generate-sitemap.ts  # Dynamic sitemap generator
├── docs/                     # Documentation
│   ├── api/                 # API documentation
│   ├── deployment/          # Deployment guides
│   ├── development/         # Development guides
│   ├── guides/              # Feature guides
│   ├── plans/               # Implementation plans
│   └── reports/             # Completion reports
├── tests/                    # Test files
│   ├── e2e/                 # Playwright E2E tests
│   └── unit/                # Vitest unit tests
├── CLAUDE.md                 # AI assistant development guide
├── ROADMAP.md               # Feature roadmap
├── TECHNICAL_DEBT.md        # Known issues
└── README.md                # This file
```

---

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (frontend + API) |
| `npm run build` | Build for production with sitemap |
| `npm run preview` | Preview production build locally |
| `npm run check` | TypeScript type checking |
| `npm run test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

### Path Aliases

Configured in both `tsconfig.json` and `vite.config.ts`:

```typescript
"@/*"           → "./client/src/*"
"@shared/*"     → "./shared/*"
"@assets/*"     → "./attached_assets/*"
```

### Type Safety

This project uses **strict TypeScript** mode:
- `strict: true` - All strict type checking enabled
- `noImplicitAny: true` - No implicit any types
- `strictNullChecks: true` - Strict null checking

Always run `npm run check` before committing changes.

---

## Design System

### Color Palette (Material You-inspired)

```css
/* Primary - Turquoise */
--accent-vibrant: #3A8E8B;
--accent-soft: #5BA8A5;
--accent-bright: #2D7A77;

/* Secondary - Gold */
--gold-medium: #C9A2A2;
--gold-soft: #D9B8B8;

/* Neutral - Warm/Cream */
--bg-primary: #FAFAF9;
--bg-secondary: #F5F5F4;
--text-primary: #1C1917;
--text-secondary: #57534E;
```

### Typography

- **Headings**: Libre Baskerville (serif)
- **Body**: Montserrat (sans-serif)
- **Accent**: Alex Brush (cursive, for decorative text)

### Components

- **Base Components**: shadcn/ui (Radix UI primitives)
- **Custom Components**: Application-specific components in `client/src/components/`
- **Styling**: Tailwind CSS with custom design tokens

---

## Deployment

### Current Deployment

- **Live Site**: [https://trovesandcoves.ca](https://trovesandcoves.ca)
- **Platform**: GitHub Pages with custom domain
- **Build**: Automatic via GitHub Actions on push to `main`

### Manual Deployment

```bash
# Build for production
npm run build

# The build process:
# 1. Runs Vite build
# 2. Copies output to dist/public
# 3. Generates sitemap.xml
# 4. Creates CNAME and 404.html
```

### CI/CD Pipeline

Pushing to `main` branch triggers:
1. **Build**: Vite production build
2. **Sitemap**: Dynamic sitemap generation
3. **Deploy**: Automatic deployment to GitHub Pages

### Sitemap

The sitemap is automatically generated with:
- All static pages (home, about, contact, etc.)
- Product pages (19 products)
- Category pages (3 categories)
- Image sitemap for product images

View at: `https://trovesandcoves.ca/sitemap.xml`

---

## Documentation

| Document | Description |
|----------|-------------|
| [ROADMAP.md](ROADMAP.md) | Planned features and implementation phases |
| [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md) | Known issues and improvement areas |
| [CLAUDE.md](CLAUDE.md) | AI assistant development guide |
| [Design System](THEME_SYSTEM.md) | Material You-inspired design tokens |
| [API Docs](docs/api/README.md) | API endpoint documentation |
| [Development Guide](docs/development/README.md) | Local development setup |
| [Deployment Guide](docs/deployment/README.md) | Deployment instructions |
| [SEO Reports](docs/reports/) | SEO implementation reports |

### Implementation Plans

See `docs/plans/` for detailed implementation plans:
- SEO Foundation (completed)
- Analytics & Tracking
- Conversion Features
- Social Proof Features
- Testing & Quality Assurance

---

## SEO Implementation

### Phase 1 (Completed) ✅

1. **Centralized Metadata** - Unique titles and descriptions for all pages
2. **Breadcrumb Schema** - Schema.org structured data for rich snippets
3. **H1 Optimization** - Target keywords in headings
4. **Dynamic Sitemap** - Auto-generated with all pages and products

### Meta Tag Example

```tsx
<SEOHead path="/products" />
```

Automatically generates:
```html
<title>Shop Crystal Jewelry | Handcrafted in Winnipeg | Troves & Coves</title>
<meta name="description" content="Browse our collection of handcrafted crystal jewelry..." />
```

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and test locally
npm run dev

# Run tests and type check
npm run check
npm run test
npm run lint

# Commit changes
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Links

- **Live Demo**: [trovesandcoves.ca](https://trovesandcoves.ca)
- **GitHub**: [github.com/reverb256/trovesandcoves](https://github.com/reverb256/trovesandcoves)
- **Etsy Store**: [Shop on Etsy](https://www.etsy.com/shop/trovesandcoves)

---

## Support

For support, email [support@trovesandcoves.ca](mailto:support@trovesandcoves.ca) or create an issue in this repository.

---

*Built with ❤️ in Winnipeg, Manitoba, Canada*
