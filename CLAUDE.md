# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Actually Is

This is a **crystal jewelry showcase site** deployed on GitHub Pages. It has:
- Static React frontend with ~25 custom components
- shadcn/ui component library
- In-memory product data storage (MemStorage in server/storage.ts)
- Basic cart functionality using localStorage
- Etsy integration for purchases
- Material You-inspired design system
- **Strict TypeScript enabled** - type safety is enforced
- Error Boundary for graceful error handling

## Recent Improvements (2026-03-08)

The following improvements were made to address code quality and performance:

### TypeScript Enhancements
- ✅ **Strict mode enabled** - `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`
- ✅ All `any` types replaced with proper types
- ✅ Type-safe error handling using `unknown` instead of `any`

### Performance Optimizations
- ✅ **React.memo** added to ProductCard and MobileProductCard components
- ✅ Atomic session management to prevent race conditions
- ✅ Bundle analysis added to build process (run `npm run build:analyze`)

### Code Quality
- ✅ **Error Boundary** component wraps the entire app for graceful error handling
- ✅ Environment variable for API URL (`VITE_CLOUDFLARE_API`)
- ✅ Dead code removed (unused migration scripts, AI validation remnants)

### What Was Removed
- Database migration scripts (migrate.ts, seed.ts, migrate-database.sh)
- One-time audit scripts (image-deduplication-audit.js)
- Express-validator dependencies (unused after AI feature removal)
- Replit-specific cartographer plugin (not needed for GitHub Pages)

## Development Commands

```bash
# Start development server (Express with Vite frontend)
npm run dev

# Build for production
npm run build

# Build with bundle analysis
npm run build:analyze

# Type checking (strict mode enabled)
npm run check

# Testing
npm run test               # Run Vitest unit tests
npm run test:e2e           # Run Playwright end-to-end tests

# Linting and formatting
npm run lint
npm run format
```

## Architecture

### Directory Layout

```
client/src/                # React frontend (Vite root is ./client)
├── components/           # React components
│   ├── ui/              # shadcn/ui base components
│   ├── ErrorBoundary.tsx # Error boundary component
│   ├── ProductCard.tsx   # Memoized product card
│   └── MobileOptimized.tsx # Mobile-optimized components
├── hooks/               # Custom React hooks
│   └── useCart.ts       # Type-safe cart hook
├── lib/                 # Utility libraries
│   ├── queryClient.ts   # API client with session management
│   ├── session-utils.ts # Shared session utilities
│   └── store.tsx        # Cart state management
└── main.tsx             # React entry point (wrapped in ErrorBoundary)

server/                   # Express.js backend (development only)
├── index.ts             # Server entry point
├── routes.ts            # API route definitions
├── storage.ts           # In-memory storage with seeded data
└── security/            # Security middleware

shared/                   # Shared TypeScript code
├── types.ts             # Type definitions (Product, Cart, etc.)
├── brand-config.ts      # Brand/design tokens
└── locked-design-language.ts  # Design system constants
```

### Key Patterns

1. **Storage Abstraction**: `server/storage.ts` defines `IStorage` interface
   - `MemStorage`: In-memory with seeded crystal jewelry data (DEFAULT)
   - No database implementation

2. **Path Aliases** (configured in `tsconfig.json` and `vite.config.ts`):
   - `@/*` → `./client/src/*`
   - `@shared/*` → `./shared/*`
   - `@assets/*` → `./attached_assets/*`

3. **Development vs Production**:
   - Development: Express server on port 5000 + Vite on port 5173
   - Production: GitHub Pages for frontend
   - API: Can route to Cloudflare Workers via `VITE_CLOUDFLARE_API`

## Environment Variables

Available environment variables (see `.env.example`):
- `VITE_API_URL` - Local development API URL (default: http://localhost:5000)
- `VITE_CLOUDFLARE_API` - Production API URL for Cloudflare Workers
- `VITE_BASE_PATH` - Base path for GitHub Pages (default: /trovesandcoves/)
- `VITE_GITHUB_PAGES_URL` - GitHub Pages URL

**Note:** Database and Stripe environment variables are NOT used. The app uses in-memory storage.

## TypeScript Configuration

Strict mode is enabled with the following compiler options:
- `strict: true` - All strict type checking options
- `noImplicitAny: true` - Error on implicit any types
- `strictNullChecks: true` - Strict null checking
- `noUnusedLocals: true` - Error on unused local variables
- `noUnusedParameters: true` - Error on unused parameters

## Design System

Material You-inspired with cream color scheme:
- `shared/locked-design-language.ts`: CSS classes and color constants
- `shared/brand-config.ts`: Brand configuration
- Tailwind classes: `bg-surface-50`, `text-on-surface-variant`, etc.

## Deployment

- Push to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`)
- Builds React app and deploys to GitHub Pages
- Vite base path: `/trovesandcoves/` for GitHub Pages

## Working on This Codebase

1. **TypeScript:** Always maintain strict type safety - no `any` types
2. **Performance:** Use React.memo for components rendered in lists
3. **Error Handling:** Wrap new features in try-catch with proper error types
4. **Testing:** Add tests for new components (Vitest for unit, Playwright for e2e)
5. **Database:** Don't add database code without discussing architecture first

See ROADMAP.md for planned improvements and TECHNICAL_DEBT.md for known issues.
