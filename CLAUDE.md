# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Actually Is

This is a **crystal jewelry showcase site** - NOT a full e-commerce platform. It has:
- Static React frontend with ~25 custom components
- shadcn/ui component library
- In-memory product data storage (MemStorage in server/storage.ts)
- Basic cart functionality using localStorage
- Etsy integration for purchases
- Material You-inspired design system

## What Doesn't Exist (Yet)

The following are referenced in old documentation but are NOT implemented:
- ❌ No database (PostgreSQL schema exists but is unused)
- ❌ No payment processing (Stripe integration is stub code)
- ❌ No user authentication
- ❌ No admin dashboard with real functionality
- ❌ No AI features (all removed in commit be3cb65)
- ❌ No real backend (server/ is for development only with in-memory storage)

## Development Commands

```bash
# Start development server (Express with Vite frontend)
npm run dev

# Build for production
npm run build

# Type checking
npm run check

# Testing
npm run test               # Run Vitest unit tests
npm run test:e2e           # Run Playwright end-to-end tests

# Linting and formatting
npm run lint
npm run format

# Cloudflare Workers (if using serverless deployment)
npm run cf:dev
npm run deploy:all
```

## Architecture

### Directory Layout

```
src/                      # React frontend (Vite root is ./client)
├── components/           # React components
│   └── ui/              # shadcn/ui base components
├── main.tsx             # React entry point
└── App.tsx              # Main app component

server/                   # Express.js backend (development only)
├── index.ts             # Server entry point
├── routes.ts            # API route definitions
├── storage.ts           # In-memory storage with seeded data
└── security/            # Security middleware (mostly stubs)

shared/                   # Shared TypeScript code
├── schema.ts            # Drizzle ORM schema (currently UNUSED)
├── brand-config.ts      # Brand/design tokens
└── locked-design-language.ts  # Design system constants
```

### Key Patterns

1. **Storage Abstraction**: `server/storage.ts` defines `IStorage` interface
   - `MemStorage`: In-memory with seeded crystal jewelry data (DEFAULT)
   - No database implementation despite schema existing

2. **Path Aliases** (configured in `tsconfig.json` and `vite.config.ts`):
   - `@/*` → `./client/src/*`
   - `@shared/*` → `./shared/*`
   - `@assets/*` → `./attached_assets/*`

3. **Development vs Production**:
   - Development: Express server on port 5000 + Vite on port 5173
   - Production: GitHub Pages for frontend, Cloudflare Workers for API

## Database Schema (Currently Unused)

The schema in `shared/schema.ts` is defined with Drizzle ORM + Zod validation but is NOT connected to any database:
- users, categories, products, cartItems, orders, orderItems, contactSubmissions

When `DATABASE_URL` is not set (default), `MemStorage` provides seeded product data.

## Environment Variables

Optional environment variables (see `.env.example`):
- `DATABASE_URL` - Not currently used, would enable PostgreSQL storage
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` - Not currently used
- `VITE_API_URL` - For Cloudflare Workers API (if configured)

## Design System

Material You-inspired with cream color scheme:
- `shared/locked-design-language.ts`: CSS classes and color constants
- `shared/brand-config.ts`: Brand configuration
- Tailwind classes: `bg-surface-50`, `text-on-surface-variant`, etc.

## Security Notes

The `server/security/` directory contains OWASP/ISO27001 compliance code, but this is largely boilerplate/template and not actively enforced. Don't rely on it for real security without audit.

## Deployment

- Push to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`)
- Builds React app and deploys to GitHub Pages
- Vite base path: `/trovesandcoves/` for GitHub Pages
- Cloudflare Workers deployment optional

## Working on This Codebase

1. **Before making changes**: Understand this is a showcase site, not full e-commerce
2. **Adding features**: Check ROADMAP.md for planned work before starting
3. **Database**: Don't add database code without discussing architecture first
4. **Payment**: Don't add Stripe code without discussing payment flow
5. **Tests**: Add tests for new components (Vitest for unit, Playwright for e2e)

See ROADMAP.md for planned improvements and TECHNICAL_DEBT.md for known issues.
