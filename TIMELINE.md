# Troves & Coves - Git History Timeline

Complete chronological history of the project's development, deployment, and evolution.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `feat/*` | Feature development branch (experimental) |
| `main` | Integration branch (CI tests run here) |
| `prod` | Production branch (deploys to live site) |
| `gh-pages` | GitHub Pages deployment branch (auto-managed) |
| `add-cache-purge` | Feature branch for cache purge workflow |
| `feat/astro-migration` | Active Astro migration experiment |

---

## Phase 1: Foundation & Brand Establishment

*Early commits establishing the luxury brand positioning and core design system.*

| Date | Commit | Description |
|------|--------|-------------|
| - | `99ab943` | Remove mystical language from Etsy product sync |
| - | `811b18f` | Remove mystical language from Cloudflare worker fallback |
| - | `4301c09` | Restore missing closing brace in cloudflare-worker.js |
| - | `8a90725` | Make all cards and hero theme-aware for light/dark mode |
| - | `eb336cc` | Make Header and Footer theme-aware |
| - | `89f7982` | Make all pages theme-aware (dark/light mode coherence) |
| - | `3561c0b` | Ensure font color coherence in ProductDetail gemstone display |
| - | `26fcc18` | Complete theme awareness for all remaining pages |

**Key Decision:** Transition to full theme system supporting light/dark modes across all components.

---

## Phase 2: Brand Voice & Luxury Positioning

*Refinement of brand messaging to luxury market positioning.*

| Date | Commit | Description |
|------|--------|-------------|
| - | `5e44d0e` | Improve dark mode coherence with early theme initialization |
| - | `369eec3` | Add Etsy product synchronizer with dynamic page management |
| - | `b13771a` | Comprehensive SEO optimization for search visibility |
| - | `0456326` | **Transition to Robin's Luxury Palette 2026** |
| - | `6008ddd` | Implement Web Interface Guidelines compliance (accessibility) |
| - | `2600e77` | Refine brand voice to luxury positioning |

**Key Decision:** Brand pivot to "luxury" positioning with refined color palette.

---

## Phase 3: Visual Coherence & Design System

*Implementation of comprehensive design system and visual consistency.*

| Date | Commit | Description |
|------|--------|-------------|
| - | `8888ba1` | Elevate DESIGN_SPEC to luxury refinement guide (v3.0) |
| - | `9b6c39f` | Add comprehensive DESIGN_SPEC compliance report |
| - | `2015bb8` | Update DESIGN_SPEC with current implementation |
| - | `103f311` | Complete About page transformation message implementation |
| - | `5301b01` | Add circular glow to mobile menu sparkle icon |
| - | `7398f8f` | Remove circular glow effect from mobile menu sparkle icon |
| - | `7386aa6` | Update product care instructions to match brand standards |
| - | `74020d3` | **Prevent header from changing size on scroll** |
| - | `39656ea` | Reduce size of category badges on product images |
| - | `cd6ed86` | Apply DESIGN_SPEC language guidance for shop page |
| - | `5ec2676` | Apply visual coherence audit findings |
| - | `7414963` | Standardize container classes and hero padding |
| - | `2fc82d1` | Add SectionDivider and CTAButton components |
| - - | `91d26d3` | Integrate SectionDivider component across all pages |
| - | `defdd0f` | Standardize hero section padding across all pages |
| - | `fb37333` | Integrate CTAButton component across all pages |
| - | `061790f` | Add comprehensive UI harmonization components |
| - | `67bf8a5` | Create SectionPill component and harmonize all pills |

**Key Decision:** Component-based design system with reusable UI primitives.

---

## Phase 4: Performance & UX Enhancements

*Performance optimization and user experience improvements.*

| Date | Commit | Description |
|------|--------|-------------|
| - | `6db5942` | Add smooth page transitions and mobile menu animations |
| - | `3a3b233` | **Resolve Wouter route conflict** (products vs product detail) |
| - | `35feed1` | Add SEO Foundation implementation plan (Phase 1) |
| - | `169a810` | Add page-specific titles and meta descriptions |
| - | `05223ab` | Add BreadcrumbSchema component for SEO |
| - | `9daf9b4` | Add breadcrumb schema to products page |
| - | `20267f3` | Optimize H1 tags with target keywords |
| - | `6c33878` | Add BreadcrumbSchema to Home and PrivacyPolicy pages |
| - | `d3ec584` | Update .env.example with GA4 configuration |
| - | `6939534` | Add SEO Phase 1 completion report |
| - | `da89780` | Add comprehensive improvements design document |
| - | `af22778` | Create comprehensive README and consolidate documentation |
| - | `86301c7` | **Revert: Restore original Hero and Products H1 visual design** |
| - | `aa7afcf` | Prevent DOMException in schema cleanup functions |

**Key Decision:** SEO-first approach with structured data and breadcrumb navigation.

---

## Phase 5: DOM Cleanup & Race Conditions

*Critical fixes for React DOM manipulation and IntersectionObserver issues.*

| Date | Commit | Description |
|------|--------|-------------|
| - | `c89705f` | Reinitialize section observer on route changes |
| - | `107ae9c` | Reorganize Playwright tests (production vs debug suites) |
| - | `3798b49` | Extend SEOHead to accept title/description overrides |
| - | `62f09be` | **Properly disconnect IntersectionObserver on route changes** |
| - | `5998e8c` | Update all documentation to reflect current architecture |
| - | `8fc8a6a` | Resolve page transition and routing issues |
| - | `d692dc6` | Modernize DOM cleanup and add OG image generation |
| - | `22b145d` | Simplify PageTransition to prevent race conditions |
| - | `8a8be83` | Update testing status and IntersectionObserver best practices |
| - | `fc2aba4` | Install Playwright browsers for og:image generation in CI |
| - | `78ae9fe` | Configure E2E tests to run against production by default |
| - | `1fff31a` | Update Playwright tests for production compatibility |
| - | `47ddd57` | Ignore test artifacts and dev build files |
| - | `d89024f` | Add NixOS browser limitation note to E2E test docs |
| - | `238798b` | Use larger viewport for og:image generation |
| - | `0a2c92a` | Add cache-busting parameter to og:image URL |
| - | `fee1241` | Rewrite README for general public and client |
| - | `146f5b2` | Update copyright year to 2026 |
| - | `d68afab` | Add portfolio attribution to README |

**Critical Fix:** IntersectionObserver cleanup race conditions that caused `Node.removeChild` errors.

---

## Phase 6: Branch Strategy & CI/CD Reorganization

*Establishment of main/prod workflow with protected branches.*

| Date | Commit | Branch | Description |
|------|--------|--------|-------------|
| - | `e2c2a4d` | main | **Reorganize GitHub Actions for main/prod workflow** |
| - | `bcfbfd6` | main | Add PR/issue templates and CODEOWNERS |
| - | `5a672bc` | main | Add CODEOWNERS file |
| - | `bde2503` | add-cache-purge | Add Cloudflare cache purge workflow |
| - | `a2c65ff` | add-cache-purge | Resolve TypeScript error in PageTransition |
| - | `f8a689f` | add-cache-purge | Resolve navigation DOM race condition |
| - | `91f0d3b` | add-cache-purge | Resolve Node.removeChild errors in SchemaOrg |
| - | `d8cb269` | prod | **Create prod branch with only essential files** (tag: v1.0.0) |

**Key Decision:**
- `main` = Integration branch with CI tests
- `prod` = Protected production branch (deploys to GitHub Pages)
- `feat/*` = Feature development branches

---

## Phase 7: Production Hardening

*Stabilization of production deployment and console error fixes.*

| Date | Commit | Branch | Description |
|------|--------|--------|-------------|
| - | `34e7f01` | main | Resolve navigation DOM race condition |
| - | `de69530` | main | Add Cloudflare cache purge workflow |
| - | `6f3b367` | prod | Resolve Node.removeChild errors in SchemaOrg |
| - | `52ba76b` | prod | Simplify GitHub Actions deployment workflow |
| - | `9addf02` | prod | **Fix browser console warnings** |
| - | `816e2a2` | feat/astro-migration | Initialize Astro with React and Tailwind |
| - | `a2bf897` | feat/astro-migration | Reorganize source structure for Astro |
| - | `b405bd0` | feat/astro-migration | Update Tailwind config for Astro content paths |
| - | `9a343a9` | feat/astro-migration | Create base Astro layout with SEO meta tags |
| - | `affe9bf` | feat/astro-migration | Complete Astro migration with React Context |
| - | `c625106` | feat/astro-migration | Resolve hydration issues |
| - | `ad293e5` | feat/astro-migration | Complete remaining audit tasks |

**Note:** `feat/astro-migration` branch is parallel work - NOT deployed to production.

---

## Phase 8: Current Work (March 2026)

*Console error fixes, documentation, and branch cleanup.*

| Date | Commit | Branch | Description |
|------|--------|--------|-------------|
| Mar 14 | `aa9c2cd` | main | Fix console errors and warnings from site audit |
| Mar 14 | `7550e16` | main | **Add comprehensive README and CLAUDE.md** |
| Mar 14 | `d28db4a` | prod | Fix console errors and warnings from site audit |
| Mar 14 | `b23fd4b` | prod | Remove development files from prod branch |
| Mar 14 | `a23fff7` | prod | Restore required build scripts |
| Mar 14 | `b07c983` | prod | Add comprehensive README and CLAUDE.md |

### Fixes Applied:
1. ✅ Duplicate "Skip to main content" links → Single link in Header.tsx
2. ✅ Instagram icon truncated SVG → lucide-react `<Instagram />` component
3. ✅ Deprecated `apple-mobile-web-app-capable` → `mobile-web-app-capable`
4. ✅ Unused `useServiceWorker` hook → Deleted (VitePWA handles SW automatically)

---

## Branch Structure Today

```
feat/astro-migration  (8 commits)  → Astro framework experiment (NOT deployed)
│
├── 000c264  Initialize Astro
├── 816e2a2  Initialize Astro with React and Tailwind
├── a2bf897  Reorganize source structure
├── b405bd0  Update Tailwind config
├── 9a343a9  Create base Astro layout
├── affe9bf  Complete Astro migration
├── c625106  Resolve hydration issues
└── ad293e5  Complete remaining audit tasks

main                 (2 commits ahead of prod) → Integration branch
│
├── aa9c2cd  Fix console errors (deployed to prod via cherry-pick)
└── 7550e16  Add README and CLAUDE.md (deployed to prod via cherry-pick)

prod                 (protected, deploys to live) → Production source
│
├── d28db4a  Fix console errors (cherry-pick from main)
├── b23fd4b  Remove dev files
├── a23fff7  Restore build scripts
└── b07c983  Add README and CLAUDE.md (cherry-pick from main)
      │
      ▼
    https://trovesandcoves.ca (GitHub Pages)
```

---

## Protected Branch Rules

| Branch | Protection Rules |
|--------|-----------------|
| `prod` | ❌ No merge commits, ❌ No force-push, ✅ Cherry-pick only |
| `main` | ⚠️ Changes must go through PR (but bypasses allowed) |

---

## Deployment Workflow

```
1. Developer:  git checkout -b feat/thing main
2. Developer:  ...work on feature...
3. Developer:  git checkout main && git merge feat/thing
4. CI:         Tests run on main push
5. Maintainer: git checkout prod
6. Maintainer: git cherry-pick <commit-sha>
7. Maintainer: git push origin prod
8. GitHub:     Deploy workflow runs
9. Live:       https://trovesandcoves.ca updated
```

---

## Key Technical Decisions (Historical)

| Decision | Date | Rationale |
|----------|------|-----------|
| React + Vite | Foundation | Fast development, modern build tool |
| shadcn/ui | Phase 2 | Copy-paste components, full control |
| Wouter vs React Router | Phase 4 | Smaller bundle, hooks-based API |
| Zustand for cart | Phase 2 | Minimal boilerplate |
| CSS Variables theming | Phase 1 | Runtime theme switching |
| GitHub Pages hosting | Phase 6 | Free hosting, simple deployment |
| Cherry-pick to prod | Phase 6 | Protected branch, linear history |
| Astro experiment | Phase 7 | Exploring SSR/static generation |

---

## Migration Notes

**Active Migration:** `feat/astro-migration` branch contains an incomplete Astro framework migration. This is **parallel work** and is **NOT** currently deployed to production.

Current production remains on **React + Vite** stack.

---

## Tags

| Tag | Commit | Description |
|-----|--------|-------------|
| `v1.0.0` | `d8cb269` | Prod branch creation with essential files |

---

*Last updated: March 14, 2026*
