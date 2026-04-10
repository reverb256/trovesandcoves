# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-13
**Commit:** main branch
**Project:** trovesandcoves

## OVERVIEW

trovesandcoves - A static React showcase site for handcrafted crystal jewelry. Built with React + Vite + TypeScript, Material You-inspired design with warm cream color scheme. Deployed on GitHub Pages with Etsy integration for purchases.

## STRUCTURE

```
trovesandcoves/
├── client/         # React/Vite frontend (Vite root)
├── server/         # Express.js backend (development only)
├── shared/         # Shared TypeScript code and types
├── scripts/        # Build and utility scripts
└── docs/           # Documentation
```

## WHERE TO LOOK

| Task                    | Location                         | Notes                                   |
| ----------------------- | -------------------------------- | --------------------------------------- |
| **Frontend Components** | client/src/components/           | React components with shadcn/ui         |
| **Pages**               | client/src/pages/                | Route components (Home, Products, etc.) |
| **Product Data**        | server/storage.ts                | In-memory storage with seeded data      |
| **Type Definitions**    | shared/types.ts                  | Shared TypeScript types                 |
| **Design Tokens**       | shared/locked-design-language.ts | Material You-inspired design system     |
| **Brand Config**        | shared/brand-config.ts           | Brand colors and configuration          |
| **API Routes**          | server/routes.ts                 | Express API routes (dev only)           |

## CONVENTIONS

- **Material You Design**: Warm cream color scheme with robin's turquoise accent
- **TypeScript Strict**: Full type safety enforcement (strict mode enabled)
- **React + Vite**: Modern build tool with HMR in development
- **shadcn/ui**: Base UI components built on Radix UI
- **TailwindCSS**: Utility-first CSS with custom design tokens
- **Path Aliases**: `@/*` → client/src, `@shared/*` → shared

## ANTI-PATTERNS (THIS PROJECT)

- **NO** database code - uses in-memory storage (MemStorage)
- **NO** API calls in production - static site with optional Cloudflare Worker
- **NO** user authentication - not implemented yet
- **NEVER** modify locked-design-language.ts without understanding design system
- **NO** hardcoded product data in components - use storage layer

## UNIQUE STYLES

- **Material You-inspired**: Google's design language with warm, muted tones
- **Cream Color Scheme**: Primary background is #FAFAF9 with robin's turquoise (#3A8E8B) accents
- **Typography**: Libre Baskerville (headings), Montserrat (body), Alex Brush (decorative)
- **Component Structure**: Atomic design with shadcn/ui as base
- **Etsy Integration**: Purchase buttons redirect to Etsy listings

## COMMANDS

### Nix devenv workflow (preferred)

```bash
devenv shell             # Enter the development shell (or use direnv for auto-loading)
devenv up                # Start dev server process
devenv test              # Run git-hooks + enterTest
devenv info              # Show environment info

# Shortcuts (available inside devenv shell):
build                    # Build for production
preview                  # Preview production build
check                    # TypeScript type checking
lint                     # Run ESLint
lint-fix                 # Run ESLint with auto-fix
fmt                      # Format code with Prettier
fmt-check                # Check formatting without writing
test                     # Run Vitest unit tests
test-e2e                 # Run Playwright end-to-end tests
test-all                 # Run unit + e2e tests
```

### npm scripts (still available)

```bash
npm run dev              # Start development server (Express + Vite)
npm run build            # Build for production (generates sitemap)
npm run preview          # Preview production build locally
npm run check            # TypeScript type checking
npm run test             # Run Vitest unit tests
npm run test:e2e         # Run Playwright end-to-end tests
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

## DEVELOPMENT VS PRODUCTION

- **Development**: Express server on port 5000 serves API, Vite on port 5173 for frontend
- **Production**: GitHub Pages hosts static frontend, no server needed
- **Data**: Uses in-memory storage with seeded crystal jewelry products
- **Cart**: localStorage-based cart with session management
- **Purchase**: Redirects to Etsy storefront

## NOTES

- This is a showcase site, not a full e-commerce platform
- Products are seeded from Etsy data (see etsy-products.json)
- Design system is Material You-inspired with warm, neutral tones
- Deployment is automatic via GitHub Actions on push to main
- Sitemap is auto-generated with all product pages
- SEO is optimized with unique meta tags per page
- PWA support with service worker for offline capability

## KEY FILES TO UNDERSTAND

- `client/src/main.tsx` - React entry point with ErrorBoundary
- `server/storage.ts` - In-memory product storage
- `shared/types.ts` - All TypeScript type definitions
- `vite.config.ts` - Build configuration with PWA plugin
- `.github/workflows/deploy.yml` - CI/CD for GitHub Pages

## SEE ALSO

- [CLAUDE.md](CLAUDE.md) - Detailed development guide
- [README.md](README.md) - Project overview and quick start
- [ROADMAP.md](ROADMAP.md) - Planned features and phases
- [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md) - Known issues
