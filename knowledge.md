# Troves & Coves - Project Knowledge

## What This Is

Production e-commerce showcase for handcrafted crystal jewelry, deployed to GitHub Pages. Static React app with client-side cart that links out to Etsy for checkout.

**Live:** https://trovesandcoves.ca | **Shop:** https://www.etsy.com/ca/shop/TrovesandCoves

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS + CSS variables |
| Components | shadcn/ui (Radix UI) |
| Routing | **Wouter** (not React Router) |
| State | Zustand (cart) + React Context (theme) |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| PWA | VitePWA (service worker) |
| Testing | Vitest + Playwright |
| Hosting | GitHub Pages |

---

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server at localhost:5173
npm run build        # Production build (includes prerendering)
npm run preview      # Preview prod build
npm run check        # TypeScript type checking
npm run lint         # ESLint
npm run test         # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)
```

---

## Key File Locations

| What | Path |
|------|------|
| App entry | `client/src/main.tsx` |
| Routes | `client/src/App.tsx` |
| Products (embedded) | `shared/embedded-data.ts` |
| Products (server) | `server/authentic-products.ts` |
| Products (Etsy JSON) | `etsy-products.json` |
| Theme variables | `client/src/lib/theme.tsx` |
| Cart store | `client/src/lib/store.tsx` |
| UI components | `client/src/components/ui/` |
| Pages | `client/src/pages/` |
| Shared types | `shared/types.ts` |
| Brand config | `shared/brand-config.ts` |
| Build scripts | `scripts/` |
| CI/CD | `.github/workflows/` |

---

## Branch Strategy

```
feat/*  →  main  →  prod  →  live
(work)   (test)   (deploy) (site)
```

**CRITICAL:** `prod` branch is protected:
- No merge commits, no force-push
- Use `git cherry-pick` from main
- Push to prod triggers GitHub Pages deploy
- Deploy is gated on type-check + lint passing

---

## Conventions

### Theme Colors
Use CSS variables, NOT hardcoded colors:
```tsx
style={{ color: 'hsl(var(--text-primary))' }}
style={{ backgroundColor: 'hsl(var(--bg-card))' }}
```

### Routing
Use Wouter:
```tsx
import { Link, Route } from 'wouter';
<Link href="/products">Shop</Link>
```

### State
Zustand for cart actions:
```tsx
const addToCart = useCart(state => state.addToCart);
```

---

## Gotchas

- Products are **static** in `shared/embedded-data.ts` (not `client/src/lib/products.ts`)
- Cart is **client-side only** — checkout goes to Etsy
- Theme toggling uses localStorage
- All SPA routes are **prerendered** to static HTML at build time (`scripts/prerender.ts`)
- 404.html must exist in build output (created by `scripts/postbuild-copy.cjs`)
- Deploy workflow requires type-check + lint to pass before deploying
- If changes aren't visible after deploy, purge cache: `gh workflow run purge-cache.yml`

---

## Before Deploying

1. `npm run check && npm run lint`
2. `npm run test`
3. Cherry-pick to prod: `git checkout prod && git cherry-pick <sha>`
4. `git push origin prod`

---

## Documentation Files

- `README.md` — Project overview, workflow, architecture decisions
- `CLAUDE.md` — AI agent guidance
- `TIMELINE.md` — Complete git history timeline
- `.github/PULL_REQUEST_TEMPLATE.md` — PR checklist
- `.github/CODEOWNERS` — Code ownership rules
