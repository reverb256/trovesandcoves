# Troves & Coves

**Handcrafted Crystal Jewelry | Made in Winnipeg, Canada**

[![Live Site](https://img.shields.io/badge/Visit-trovesandcoves.ca-teal.svg)](https://trovesandcoves.ca)
[![Portfolio](https://img.shields.io/badge/By-reverb256-purple.svg)](https://reverb256.ca)
[![Etsy](https://img.shields.io/badge/Shop-Etsy-orange.svg)](https://www.etsy.com/ca/shop/TrovesandCoves)

---

## Quick Start

**🌐 Website:** [trovesandcoves.ca](https://trovesandcoves.ca) | **🛍️ Etsy:** [Shop on Etsy](https://www.etsy.com/ca/shop/TrovesandCoves) | **📧 Email:** [info@trovesandcoves.ca](mailto:info@trovesandcoves.ca)

---

## Developer Documentation

### Overview

This is a **production e-commerce showcase** for Troves & Coves, a Winnipeg-based handcrafted crystal jewelry business. The site is built as a static React application deployed to GitHub Pages.

```
┌─────────────────────────────────────────────────────────────────┐
│                        WORKFLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌──────────┐  │
│  │  FEAT   │ ───▶│  MAIN   │ ───▶│  PROD   │ ───▶│  LIVE    │  │
│  │ Branch  │     │ Branch  │     │ Branch  │     │   Site   │  │
│  └─────────┘     └─────────┘     └─────────┘     └──────────┘  │
│       │              │               │                            │
│       ▼              ▼               ▼                            │
│   Feature work    Tests pass     Protected                      │
│   experiments     CI/CD runs     No merge commits               │
│   can break       Lint checks    Cherry-pick only               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Branch Strategy

| Branch   | Purpose             | Protection    | Deployment             |
| -------- | ------------------- | ------------- | ---------------------- |
| `feat/*` | Feature development | None          | No                     |
| `main`   | Integration branch  | None          | No                     |
| `prod`   | Production source   | **Protected** | **Yes** (GitHub Pages) |

**Workflow Rules:**

1. Create feature branches from `main`: `git checkout -b feat/thing main`
2. Develop and test locally
3. Push to `main` when ready: `git checkout main && git merge feat/thing`
4. CI runs tests on `main` push
5. **For production:** Cherry-pick commits to `prod` (protected branch)

**Why cherry-pick?** The `prod` branch is protected with:

- ❌ No merge commits
- ❌ No force-push
- ✅ Only fast-forward or cherry-pick

This keeps production history linear and traceable.

### Tech Stack

```
Frontend Framework:  React 18 + TypeScript
Build Tool:          Vite 5
Styling:            Tailwind CSS + CSS variables for theming
Component Library:  shadcn/ui (Radix UI primitives)
Icons:              lucide-react
Routing:            Wouter (lightweight alternative to React Router)
State Management:   Zustand (cart) + React Context (theme)
Forms:              React Hook Form + Zod validation
Animations:         Framer Motion
PWA:                VitePWA (service worker, manifest)
Testing:            Vitest + Playwright
Hosting:            GitHub Pages
Design Inspiration: Vellees.com (premium jewelry experience)
```

### Project Structure

```
trovesandcoves/
├── client/                          # React application source
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── ui/                # shadcn/ui primitives
│   │   │   ├── Header.tsx         # Site navigation
│   │   │   ├── Footer.tsx         # Site footer
│   │   │   ├── ProductCard.tsx    # Premium product display
│   │   │   └── ...
│   │   ├── pages/                 # Route components
│   │   │   ├── ProductDetail.tsx  # Premium product page
│   │   │   ├── Home.tsx           # Enhanced homepage
│   │   │   └── ...
│   │   ├── lib/                   # Utilities (API, store, theme)
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── index.css              # Premium CSS utilities
│   │   └── main.tsx               # App entry point
│   ├── public/                    # Static assets
│   └── index.html                 # HTML template
├── scripts/                       # Build/deployment scripts
│   ├── postbuild-copy.cjs         # Creates CNAME, 404.html
│   └── generate-sitemap.ts        # SEO sitemap generation
├── docs/                          # Documentation
│   ├── premium-product-experience.md  # Premium features guide
│   └── ...
├── .github/workflows/             # CI/CD
│   ├── deploy.yml                 # Deploy to GitHub Pages
│   ├── main.yml                   # Test on main branch
│   └── purge-cache.yml            # Cloudflare cache purge
├── package.json                   # Dependencies
├── vite.config.ts                 # Vite configuration
└── tailwind.config.js             # Tailwind configuration
```

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Run type checking
npm run check

# Run linter
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

**Automatic:**

1. Push to `prod` branch → triggers GitHub Actions
2. Build runs: `npm run build`
3. Output uploaded to GitHub Pages
4. Live at https://trovesandcoves.ca

**Manual cache purge:**

```bash
gh workflow run purge-cache.yml
```

### Key Architectural Decisions

| Decision                      | Rationale                                                            |
| ----------------------------- | -------------------------------------------------------------------- |
| **Static React over SSR**     | Simple hosting (GitHub Pages), fast edge caching, no server costs    |
| **Wouter over React Router**  | Smaller bundle, hooks-based API, sufficient for simple routing       |
| **Zustand over Redux**        | Minimal boilerplate, great for simple cart state                     |
| **shadcn/ui**                 | Copy-paste components, full control over styling, no npm bloat       |
| **CSS Variables for theming** | Runtime theme switching without rebuild, system preference detection |
| **Client-side cart only**     | Checkout through Etsy — no payment processing, no backend needed     |
| **VitePWA**                   | Simple PWA setup, automatic service worker generation                |

### Accountability Structure

**Before Making Changes:**

1. **Read this file** — Understand the workflow and branch strategy
2. **Check existing patterns** — Look at similar components before creating new ones
3. **Test locally** — Run `npm run dev` and verify your changes work
4. **Run checks** — `npm run check && npm run lint && npm run test`

**Commit Guidelines:**

```
<type>: <description>

Types: feat, fix, chore, docs, refactor, perf, test

Examples:
- feat: add product search functionality
- fix: resolve mobile navigation bug
- chore: update dependencies
- docs: add deployment instructions
```

**Code Review Checklist:**

- [ ] No console errors or warnings
- [ ] No broken links (test navigation)
- [ ] Mobile responsive (test at 375px, 768px, 1024px)
- [ ] Theme toggle works (light/dark)
- [ ] Dark mode mystical glow effect visible
- [ ] Premium product features functional
- [ ] Cart functionality intact
- [ ] No new console errors
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run check`)
- [ ] All tests pass (`npm run test`)

**Breaking the Production Site:**

If you break production:

1. **Immediately** revert the offending commit
2. **Document** what went wrong
3. **Fix** on a feature branch
4. **Test** thoroughly before re-deploying

### Common Tasks

**Add a new product:**
Edit `client/src/lib/products.ts` — products are statically defined.

**Change colors/styles:**
Modify `client/src/lib/theme.tsx` for theme variables, or component-specific CSS.

**Update SEO:**
Edit `client/src/components/SEOHead.tsx` for meta tags, `scripts/generate-sitemap.ts` for sitemap.

**Add a new page:**

1. Create component in `client/src/pages/`
2. Add route in `client/src/App.tsx`

### Troubleshooting

| Issue                          | Solution                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| Build fails on prod            | Check `scripts/` directory — required: `postbuild-copy.cjs`, `generate-sitemap.ts` |
| Changes not visible            | Purge cache: `gh workflow run purge-cache.yml`                                     |
| Route returns 404              | Check `404.html` exists in build output (created by `postbuild-copy.cjs`)          |
| Theme not persisting           | Check localStorage is enabled in browser                                           |
| Images not loading             | Verify paths are in `client/public/` and referenced correctly                      |
| Dark mode glow missing         | Check CSS utilities loaded in `client/src/index.css` (premium product experience)  |
| Crystal properties not showing | Verify product has `gemstones` field with valid stone names                        |
| Benefits section not visible   | Check `benefits-section` CSS class is applied                                      |

### Premium Product Experience

The site features a premium, Vellees-inspired product experience with:

- **Large hero imagery** (1000x1000px) with zoom cursor
- **Dark mode mystical glow** effect on product images
- **Benefits/Intentions section** with elegant icons
- **Crystal Energy properties** (auto-generated from gemstones)
- **Enhanced storytelling** sections
- **Premium spacing** and whitespace
- **Improved typography** hierarchy

See `docs/premium-product-experience.md` for detailed documentation.

### Documentation Files

- `CLAUDE.md` — Project-specific guidance for AI agents
- `CHANGELOG.md` — Version history and release notes
- `docs/premium-product-experience.md` — Premium features guide
- `.github/workflows/` — CI/CD configuration
- `scripts/` — Build and deployment utilities

---

## Customer-Facing Information

### About Troves & Coves

Every piece is:

- **Handmade** with attention to detail
- **Crafted in Canada** (Winnipeg, Manitoba)
- **Made with authentic crystals** — ethically sourced
- **Designed for meaning** — each stone has its own energy

### Materials

- 14k gold-plated wire and components
- Natural quartz, amethyst, obsidian, and more
- Nickel-free and skin-friendly
- Durable construction meant to last

### Social Media

- **Facebook:** [Troves & Coves](https://www.facebook.com/TrovesAndCoves)
- **Instagram:** [@troves_and_coves](https://instagram.com/troves_and_coves)
- **Linktree:** [linktr.ee/TrovesAndCoves](https://linktr.ee/TrovesAndCoves)

---

© 2026 Troves & Coves. All rights reserved.
