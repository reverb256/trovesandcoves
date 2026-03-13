# Development Guide

## 🛠️ Local Development Setup

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Git**: Latest version
- **VS Code**: Recommended IDE

### Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/reverb256/trovesandcoves.git
   cd trovesandcoves
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

The site will be available at:
- Frontend: `http://localhost:5173`
- API: `http://localhost:5000`

## 🏗️ Project Architecture

### Current Architecture (Showcase Site)

This is a **static showcase site** with the following architecture:

**Frontend**:
- **Location**: `src/` (Vite root is `./client`)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Material You-inspired design
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: None currently (single-page app)

**Backend (Development)**:
- **Location**: `server/`
- **Runtime**: Node.js with Express
- **Storage**: In-memory (MemStorage class)
- **Session**: express-session for cart management

**Backend (Production - Optional)**:
- **Runtime**: Cloudflare Workers (if configured)
- **Storage**: Cloudflare KV (if configured)
- **Note**: Currently uses GitHub Pages for static hosting only

### What Exists Now

```
client/src/
├── components/
│   ├── Hero.tsx           # Landing page hero section
│   ├── ProductCard.tsx    # Product card component
│   ├── SEOHead.tsx        # SEO meta tag component
│   ├── BreadcrumbSchema.tsx  # Schema.org structured data
│   └── ui/                # shadcn/ui base components
├── pages/
│   ├── Home.tsx           # Homepage
│   ├── Products.tsx       # Product listing
│   ├── ProductDetail.tsx  # Single product view
│   └── ...
├── lib/
│   ├── pageMetadata.ts    # SEO metadata config
│   └── ...
├── hooks/                 # Custom React hooks
├── main.tsx               # React entry point
└── App.tsx                # Main app component

server/
├── index.ts               # Express server entry
├── routes.ts              # API routes
├── storage.ts             # In-memory storage with seeded data
└── security/              # Security middleware

shared/
├── types.ts               # TypeScript type definitions
├── brand-config.ts        # Brand tokens
└── locked-design-language.ts  # Design system
```

### What Does NOT Exist

The following are planned but not implemented:
- ❌ No database (uses in-memory storage with seeded data)
- ❌ No payment processing (redirects to Etsy for purchases)
- ❌ No user authentication
- ❌ No admin dashboard

See [ROADMAP.md](../../ROADMAP.md) for planned features.

## 📂 File Structure

### Frontend Structure
```
client/src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── Hero.tsx        # Landing hero section
│   ├── ProductCard.tsx # Product cards
│   └── SEOHead.tsx     # SEO meta tags
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Products.tsx
│   └── ...
├── lib/                # Utilities
├── hooks/              # Custom React hooks
├── main.tsx            # Entry point
└── App.tsx             # Main app
```

### Backend Structure
```
server/
├── index.ts            # Express server with Vite HMR
├── routes.ts           # API route definitions
├── storage.ts          # In-memory storage (MemStorage)
├── vite.ts             # Vite dev middleware
└── security/           # Security middleware (boilerplate)
```

## 🔧 Development Commands

### Core Commands
```bash
npm run dev              # Start dev server (frontend + backend on port 5000)
npm run build           # Build for production
npm run preview         # Preview production build
npm run check           # TypeScript type checking
```

### Testing Commands
```bash
npm run test            # Run Vitest unit tests
npm run test:e2e        # Run Playwright e2e tests
npm run test:all        # Run all tests
```

### Code Quality Commands
```bash
npm run lint            # Run ESLint
npm run format          # Format with Prettier
```

### Cloudflare Commands (Optional)
```bash
npm run cf:dev          # Test Cloudflare Worker locally
npm run cf:tail         # View Worker logs
npm run cf:kv:list      # List KV namespaces
```

### Deployment Commands
```bash
npm run deploy:all      # Deploy to Cloudflare + GitHub Pages
npm run deploy:github-pages  # Deploy to GitHub Pages only
npm run deploy:cloudflare    # Deploy to Cloudflare Workers only
```

## 🔄 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and test locally
npm run dev

# Commit changes
git add .
git commit -m "Add new feature"

# Push and create PR
git push origin feature/new-feature
```

### 2. Before Committing
```bash
# Type check
npm run check

# Lint
npm run lint

# Format
npm run format

# Run tests
npm run test
```

### 3. Testing Production Build
```bash
# Build
npm run build

# Preview
npm run preview
```

## 🌐 API Development

### Local API Server
The development server runs on `http://localhost:5000` with:
- Express.js backend
- In-memory product storage
- Session-based cart
- Basic API routes

### Current API Endpoints
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `GET /api/categories` - List categories
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart
- `POST /api/contact` - Submit contact form

### Production API (Optional)
If using Cloudflare Workers:
- Serverless functions
- KV storage
- Edge computing

## 🎨 UI Development

### Component Library
- **Base Components**: shadcn/ui in `components/ui/`
- **Custom Components**: Application-specific components
- **Styling**: Tailwind CSS with custom design system

### Design System
```css
/* Brand Colors - Cream Scheme */
--surface-50: #fafaf9;
--surface-100: #f5f5f4;
--primary-600: #059669;
--primary-800: #065f46;
```

### Tailwind Classes
- Backgrounds: `bg-surface-50`, `bg-surface-100`, etc.
- Text: `text-on-surface`, `text-on-surface-variant`, etc.
- Primary: `text-primary-600`, `bg-primary-600`, etc.

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🔧 Configuration

### Path Aliases
Configured in both `tsconfig.json` and `vite.config.ts`:
```typescript
"@/*": "./client/src/*"
"@shared/*": "./shared/*"
"@assets/*": "./attached_assets/*"
```

### Build Configuration
- **Vite**: Frontend build tool
- **TypeScript**: Type checking
- **Tailwind**: CSS processing
- **ESBuild**: Backend bundling (if needed)

### Vite Configuration
- Root: `./client`
- OutDir: `./dist/public`
- Base path: `/trovesandcoves/` (for GitHub Pages)

## 🐛 Debugging

### Frontend Debugging
- **React DevTools**: Browser extension
- **Console**: Standard browser console
- **Source Maps**: Enabled in development

### Backend Debugging
- **VS Code Debugger**: Attach to Node.js process
- **Console Logs**: Server logs in terminal
- **Network Tab**: Inspect API requests

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Check types
npm run check

# Fix issues manually or use --skipLibCheck
```

#### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or use different port
PORT=3000 npm run dev
```

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [shadcn/ui](https://ui.shadcn.com/)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Internal Docs
- [ROADMAP.md](../../ROADMAP.md) - Planned features
- [TECHNICAL_DEBT.md](../../TECHNICAL_DEBT.md) - Known issues
- [CLAUDE.md](../../CLAUDE.md) - AI assistant guide

---

Need help? Create an issue or check [TECHNICAL_DEBT.md](../../TECHNICAL_DEBT.md) for known problems.
