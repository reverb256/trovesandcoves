# Changelog

All notable changes to Troves & Coves website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Premium Product Experience (March 30, 2026)

#### Product Detail Page Enhancements
- **Large hero imagery** - Product images now display at 1000x1000px with zoom cursor interaction
- **Dark mode mystical glow** - Product images glow with turquoise and gold aura in dark mode
- **Benefits/Intentions section** - Three elegant cards highlighting Intention, Natural, and Lifetime Care
- **Crystal Energy properties** - Auto-generated crystal properties based on gemstones:
  - Moonstone → Intuition, New Beginnings
  - Amethyst → Calm & Clarity, Protection
  - Quartz → Amplification, Clarity
  - Labradorite → Magic, Transformation
- **Storytelling sections** - Enhanced "Handcrafted in Winnipeg" section with gold accent border
- **Premium buttons** - New gradient primary button and outlined secondary button styles
- **Wishlist functionality** - Heart icon to save items to wishlist
- **Enhanced gallery thumbnails** - Active state with glow effect
- **Premium spacing** - Spacious layout with `spacing-premium-lg` (4rem) and `spacing-premium-xl` (6rem)

#### Product Card Enhancements
- **Taller aspect ratio** - Cards now use 1:1.15 ratio for better product prominence
- **Subtle gradient overlay** - Hover effect with gradient from bottom
- **Premium hover lift** - Cards elevate +8px on hover with enhanced shadows
- **Improved gemstone display** - Script font with bullet separators
- **Enhanced wishlist button** - Scale animation on hover
- **Better whitespace** - Increased padding for premium feel
- **Gold hover borders** - Dark mode gold border on hover

#### Homepage Enhancements
- **Benefits section** - Three elegant cards with icons (Intentional Design, Natural Crystals, Lifetime Care)
- **Storytelling card** - "Handcrafted in Winnipeg" section with gold border
- **Trust badges** - Clean icon-based trust signals (Free Shipping, Lifetime Warranty, Handcrafted)
- **Premium section dividers** - Gold/turquoise gradient dividers
- **Enhanced product grid** - Better spacing and gemstone display

#### CSS Utilities (400+ lines added)
- **Product display classes** - `.product-hero-image`, `.product-zoom-trigger`, `.gallery-thumbnails`
- **Content section classes** - `.benefits-section`, `.story-section`, `.crystal-properties`
- **Typography classes** - `.gemstone-display`, `.premium-section-divider`
- **Button classes** - `.btn-premium-primary`, `.btn-premium-secondary`
- **Spacing classes** - `.spacing-premium-lg`, `.spacing-premium-xl`
- **Interactive classes** - `.product-card-enhanced`, `.trust-badges`
- **Dark mode enhancements** - Mystical glow effects throughout

#### Design Philosophy
Inspired by Vellees.com, the premium experience emphasizes:
- Large, dominant product photography that makes jewelry the star
- Excellent whitespace for a calm, premium feel
- Short, emotional benefits/intentions sections with subtle icons
- Layered storytelling: crystal properties → materials → brand story
- Spacious, minimalist layout with clear visual hierarchy
- Sophisticated yet warm spiritual vibe

#### Technical Details
- **No new dependencies** - All features use existing libraries
- **CSS bundle size** - +8KB gzipped for premium utilities
- **Browser compatibility** - All modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- **Accessibility** - WCAG AA compliant, proper ARIA labels, keyboard navigation
- **Performance** - GPU-accelerated animations, lazy loading, WebP images
- **Responsive design** - Mobile-first approach with breakpoints at 640px, 768px, 1024px

#### Testing
- ✅ All 40 unit tests passing (Vitest)
- ✅ All 140 E2E tests passing (Playwright)
- ✅ TypeScript type checking passes
- ✅ No linting errors
- ✅ Manual testing completed for light/dark modes

### Documentation
- Added `docs/premium-product-experience.md` - Comprehensive premium features guide
- Updated `README.md` - Added premium features to troubleshooting and tech stack
- Updated `docs/development/README.md` - Added premium product experience section

### Changed
- Enhanced ProductDetail.tsx with premium layout and features
- Enhanced ProductCard.tsx with improved styling and interactions
- Enhanced Home.tsx with benefits section and storytelling
- Added 400+ lines of premium CSS utilities to index.css

### Fixed
- Fixed TypeScript errors (IconCircle import, SectionPill variant, gemstones null handling)

## [1.0.0] - 2026-03-13

### Added
- Initial site launch
- Product catalog with categories
- Shopping cart functionality
- Theme toggle (light/dark mode)
- SEO optimization
- PWA support
- E2E testing with Playwright

---

**Note:** This project follows a calendar versioning scheme (CalVer) for the major version: `YEAR.MONTH.DAY`
