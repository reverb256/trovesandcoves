# Troves & Coves - Codebase Structure

## Directory Layout

```
trovesandcoves/
├── client/                        # React frontend source (Vite root)
│   └── src/
│       ├── components/            # React components
│       │   ├── ui/               # shadcn/ui base components (~40 components)
│       │   ├── CartDrawer.tsx    # Shopping cart drawer
│       │   ├── FeaturesBar.tsx    # Feature highlights
│       │   ├── Footer.tsx         # Site footer
│       │   ├── Header.tsx         # Site header with nav
│       │   ├── Hero.tsx           # Hero section
│       │   ├── LazyImage.tsx      # Lazy-loaded images
│       │   ├── MobileOptimized.tsx
│       │   ├── NotFound.tsx       # 404 page component
│       │   ├── ProductCard.tsx    # Product display card
│       │   ├── SearchBar.tsx      # Product search
│       │   └── SkullIcon.tsx      # Custom icon
│       ├── hooks/                 # React hooks
│       │   ├── use-mobile.tsx     # Mobile detection
│       │   ├── use-toast.ts       # Toast notifications
│       │   ├── useCart.ts         # Cart state management
│       │   └── useServiceWorker.ts
│       ├── lib/                   # Utilities
│       │   ├── cloudflareClient.ts
│       │   ├── queryClient.ts     # React Query config
│       │   ├── store.ts           # Zustand/Context stores
│       │   └── utils.ts           # Utility functions
│       ├── pages/                 # Route pages
│       │   ├── Home.tsx           # Landing page
│       │   ├── Products.tsx       # Product listing
│       │   ├── ProductDetail.tsx  # Individual product
│       │   ├── Checkout.tsx       # Checkout flow
│       │   ├── OrderConfirmation.tsx
│       │   ├── Contact.tsx
│       │   ├── About.tsx
│       │   ├── SizeGuide.tsx
│       │   ├── JewelryCare.tsx
│       │   ├── Warranty.tsx
│       │   ├── Returns.tsx
│       │   ├── Financing.tsx
│       │   ├── PrivacyPolicy.tsx
│       │   ├── AdminDashboard.tsx # Stub admin page
│       │   └── not-found.tsx
│       ├── apiClient.ts           # Centralized API calls
│       ├── main.tsx               # React entry point
│       ├── App.tsx                # Main app with routing
│       └── test-setup.ts          # Vitest setup
│
├── server/                        # Express.js backend (development only)
│   ├── deprecated/                # Old unused code
│   │   ├── cloudflare-deployment.ts
│   │   ├── cloudflare-edge-optimizer.ts
│   │   ├── cloudflare-orchestrator.ts
│   │   ├── cloudflare-types.d.ts
│   │   ├── service-discovery.ts
│   │   ├── services/image-preservation.ts
│   │   └── audit.ts
│   ├── security/                  # Security middleware
│   │   ├── owasp-compliance.ts    # OWASP security measures
│   │   ├── iso27001-compliance.ts # ISO 27001 compliance
│   │   └── validation.ts         # Input validation
│   ├── etsy-links.ts             # Etsy product links
│   ├── authentic-products.ts     # Product data source
│   ├── mock-data.ts              # Mock/test data
│   ├── db-storage.ts             # Database storage (UNUSED)
│   ├── storage.ts                # In-memory storage (ACTIVE)
│   ├── routes.ts                 # API route definitions
│   ├── vite.ts                   # Vite development server
│   └── index.ts                  # Server entry point
│
├── shared/                        # Shared TypeScript code
│   ├── schema.ts                 # Drizzle ORM schema (UNUSED)
│   ├── config.ts                 # Centralized configuration
│   ├── brand-config.ts           # Brand/design tokens
│   └── locked-design-language.ts # Design system constants
│
├── tests/                         # Test files
│   └── e2e/                      # Playwright E2E tests
│       ├── example.spec.ts
│       ├── homepage.spec.ts
│       └── products.spec.ts
│
├── scripts/                       # Build/utility scripts
│   ├── postbuild-copy.cjs
│   ├── migrate.ts
│   └── seed.ts
│
├── api/                           # Cloudflare Workers (separate package)
│   └── (separate npm package)
│
├── attached_assets/               # Static assets (images, videos)
├── dist/                          # Build output
│   └── public/                    # Built React app
│
├── docs/                          # Documentation
│   ├── development/
│   ├── api/
│   └── deployment/
│
├── .github/                       # GitHub configuration
│   └── workflows/
│       ├── deploy.yml             # GitHub Actions deployment
│       └── e2e.yml                # E2E test CI
│
├── package.json                   # Project dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite build config
├── tailwind.config.js             # Tailwind CSS config
├── .eslintrc.json                 # ESLint config
├── .prettierrc                    # Prettier config
├── wrangler.toml                  # Cloudflare Workers config
│
├── README.md                      # Project overview
├── CLAUDE.md                      # AI assistant guide
├── ROADMAP.md                     # Feature roadmap
├── TECHNICAL_DEBT.md              # Known issues
└── LICENSE                        # MIT License
```

## Key Files by Function

### Entry Points
- `client/src/main.tsx` - React app entry
- `server/index.ts` - Express server entry
- `client/src/App.tsx` - Main routing and providers

### State Management
- `client/src/lib/store.ts` - Cart state (Context)
- `client/src/lib/queryClient.ts` - React Query setup
- `server/storage.ts` - Product data storage

### API Layer
- `client/src/apiClient.ts` - Frontend API client
- `server/routes.ts` - Backend API routes
- `shared/config.ts` - API configuration

### Design System
- `shared/locked-design-language.ts` - Color tokens, CSS classes
- `shared/brand-config.ts` - Brand configuration
- `client/src/components/ui/` - shadcn/ui components

### Routing
- `client/src/App.tsx` - Wouter routing setup
- All routes use base path `/trovesandcoves` for GitHub Pages

## Important Patterns

### Storage Abstraction
The `IStorage` interface in `server/storage.ts` defines the contract:
- `MemStorage` - In-memory implementation (currently used)
- `db-storage.ts` - Database implementation (exists but unused)

### Component Organization
- `components/ui/` - Generic, reusable components (shadcn/ui)
- `components/` - App-specific components
- `pages/` - Route-level components

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- TypeScript types and interfaces
- Configuration
- Design tokens
- Database schema (not currently connected)
