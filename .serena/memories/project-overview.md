# Troves & Coves - Project Overview

## What This Project Is

A **crystal jewelry showcase site** - NOT a full e-commerce platform (yet).

### Current Features (What Works)
- Static React frontend with ~25 custom components
- shadcn/ui component library for base UI
- In-memory product data storage (MemStorage in server/storage.ts)
- Basic cart functionality using localStorage + session backup
- Etsy integration for purchases (no direct payments)
- Material You-inspired design system with cream color scheme
- Responsive design with Tailwind CSS
- PWA support with offline capability
- GitHub Pages deployment

### What Does NOT Exist (Yet)
- ❌ No database (PostgreSQL schema exists but is UNUSED)
- ❌ No payment processing (Stripe integration is stub code only)
- ❌ No user authentication
- ❌ No admin dashboard with real functionality
- ❌ No real backend (server/ is for development only with in-memory storage)

## Architecture

### Development Mode
- **Frontend**: Vite dev server on port 5173
- **Backend**: Express.js on port 5000 (with in-memory storage)
- Hot Module Replacement for both

### Production Mode
- **Frontend**: GitHub Pages (static build)
- **API**: Cloudflare Workers (optional, serverless)
- Vite base path: `/trovesandcoves/` for GitHub Pages

## Key Design Decisions

1. **Storage Abstraction**: `server/storage.ts` defines `IStorage` interface
   - `MemStorage`: In-memory with seeded crystal jewelry data (DEFAULT)
   - `db-storage.ts` exists but is NOT connected

2. **Routing**: Uses Wouter (lightweight React router)
   - Base path: `/trovesandcoves` for GitHub Pages compatibility

3. **State Management**: 
   - React Context (CartProvider in lib/store.ts)
   - React Query (@tanstack/react-query) for server state
   - localStorage for cart persistence

4. **Path Aliases** (configured in tsconfig.json and vite.config.ts):
   - `@/*` → `./client/src/*`
   - `@shared/*` → `./shared/*`
   - `@assets/*` → `./attached_assets/*`

## Important Notes

- This is a proof-of-concept showcase site
- Many features in old documentation are NOT implemented
- See ROADMAP.md for planned improvements
- See TECHNICAL_DEBT.md for known issues
