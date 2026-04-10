# CLAUDE.md - Project-Specific Guidance

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

**Troves & Coves** — A production e-commerce showcase for handcrafted crystal jewelry.

- **Stack:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Hosting:** GitHub Pages
- **Live Site:** https://trovesandcoves.ca
- **Deployment:** Automatic on push to `prod` branch

## Quick Commands

```bash
# Development
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build

# Quality
npm run check        # TypeScript type checking
npm run lint         # ESLint
npm run test         # Vitest + Playwright

# Deployment
git checkout prod && git cherry-pick <commit> && git push origin prod
```

## Branch Strategy

```
feat/*  →  main  →  prod  →  live
(work)   (test)   (deploy) (site)
```

- **`feat/*`** — Feature branches, can break
- **`main`** — Integration branch, CI tests run here
- **`prod`** — Protected production branch, deploys to GitHub Pages

**CRITICAL:** The `prod` branch is **protected**:

- No merge commits
- No force-push
- Use `git cherry-pick` to move commits from `main`

## Code Style Patterns

### Component Structure

```tsx
// Imports: external libs → internal components → types → utils
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

// Interface definitions
interface ProductCardProps {
  product: Product;
}

// Component function
export function ProductCard({ product }: ProductCardProps) {
  // Hooks (state, effects, context)
  const [isLoading, setIsLoading] = useState(false);

  // Event handlers
  const handleClick = () => {
    // ...
  };

  // Render
  return <div className="...">{/* JSX */}</div>;
}
```

### Theme Access

Use CSS variables via inline styles for theme colors:

```tsx
style={{ color: 'hsl(var(--text-primary))' }}
style={{ backgroundColor: 'hsl(var(--bg-card))' }}
```

Available theme variables are in `client/src/lib/theme.tsx`.

### Routing

Uses **Wouter** (not React Router):

```tsx
import { Link, Route } from 'wouter';

// Navigation
<Link href="/products">Shop</Link>

// Routes
<Route path="/product/:id" component={ProductDetail} />
```

### State Management

- **Cart:** Zustand store at `client/src/lib/store.tsx`
- **Theme:** React Context at `client/src/lib/theme.tsx`

### Forms

React Hook Form + Zod:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

const form = useForm({ resolver: zodResolver(schema) });
```

## Common Pitfalls

### ❌ Don't Do

```tsx
// Don't use hardcoded colors
<div style={{ color: '#333' }}>

// Don't use class-based routing
import { Link } from 'react-router-dom';

// Don't mutate Zustand state directly
useCart.setState({ items: [...] });

// Don't forget alt text on images
<img src="..." />
```

### ✅ Do

```tsx
// Use theme variables
<div style={{ color: 'hsl(var(--text-primary))' }}>

// Use Wouter for routing
import { Link } from 'wouter';

// Use store actions
const addToCart = useCart(state => state.addToCart);

// Always include alt text
<img src="..." alt="Description of image" />
```

## File Locations

| What              | Where                        |
| ----------------- | ---------------------------- |
| Products data     | `client/src/lib/products.ts` |
| Theme variables   | `client/src/lib/theme.tsx`   |
| Cart store        | `client/src/lib/store.tsx`   |
| Route definitions | `client/src/App.tsx`         |
| UI components     | `client/src/components/ui/`  |
| Page components   | `client/src/pages/`          |

## Before Deploying

1. **Run checks:** `npm run check && npm run lint`
2. **Test locally:** `npm run test`
3. **Verify:** No console errors, all routes work
4. **Cherry-pick to prod:** `git checkout prod && git cherry-pick <sha>`
5. **Push:** `git push origin prod`

## Deployment Troubleshooting

| Problem             | Solution                            |
| ------------------- | ----------------------------------- |
| Build fails         | Check `scripts/` has required files |
| Changes not visible | Run cache purge workflow            |
| Routes 404ing       | Verify `404.html` in build output   |

## Testing Locally

```bash
# E2E tests with Playwright
npx playwright test

# Unit tests with Vitest
npm run test

# Type checking
npm run check
```

## Related Documentation

- `README.md` — Project overview, workflow, architecture decisions
- `package.json` — Dependencies and scripts
- `.github/workflows/` — CI/CD configuration
