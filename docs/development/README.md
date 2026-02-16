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

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## 🏗️ Project Architecture

### Frontend (React)
- **Location**: `client/src/`
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query + Zustand
- **Routing**: Wouter (lightweight routing)

### Backend (Development)
- **Location**: `server/`
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js

### Backend (Production)
- **Location**: `cloudflare-worker.js`
- **Runtime**: Cloudflare Workers
- **Storage**: Cloudflare KV
- **Edge Computing**: Global distribution

## 📂 File Structure

### Frontend Structure
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (shadcn/ui)
│   │   ├── Header.tsx      # Site header
│   │   ├── Footer.tsx      # Site footer
│   │   └── ...
│   ├── pages/              # Route components
│   │   ├── Home.tsx        # Homepage
│   │   ├── Products.tsx    # Product listing
│   │   ├── ProductDetail.tsx # Product details
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and configurations
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
└── public/                 # Static assets
```

### Backend Structure
```
server/
├── index.ts                # Express server entry point
├── routes/                 # API route handlers
├── middleware/             # Express middleware
├── lib/                    # Server utilities
└── types/                  # TypeScript type definitions
```

## 🔧 Development Commands

### Core Commands
```bash
npm run dev                 # Start development server (frontend + backend)
npm run build              # Build for production
npm run preview            # Preview production build
npm run check              # TypeScript type checking
```

### Cloudflare Commands
```bash
npm run cf:dev             # Test Cloudflare Worker locally
npm run cf:tail            # View Worker logs in real-time
npm run cf:kv:list         # List KV namespaces
```

### Database Commands
```bash
npm run db:push            # Push schema changes to database
npm run db:studio          # Open Drizzle Studio (database GUI)
```

### Utility Commands
```bash
npm run optimize:images    # Optimize image assets
npm run analyze:bundle     # Analyze bundle size
```

## 🧪 Testing

### Unit Testing
```bash
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
```

### Integration Testing
```bash
npm run test:e2e           # Run end-to-end tests
npm run test:api           # Test API endpoints
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

### 2. Testing Deployment
```bash
# Test production build
npm run build
npm run preview

# Test Cloudflare Worker
npm run cf:dev
```

### 3. Code Quality
```bash
# Type checking
npm run check

# Linting
npm run lint

# Formatting
npm run format
```

## 🌐 API Development

### Local API Server
The development server runs on `http://localhost:3000` with:
- Express.js backend
- PostgreSQL database
- Full authentication
- File uploads
- WebSocket support

### Production API (Cloudflare Worker)
The production API runs on Cloudflare Workers with:
- Serverless functions
- KV storage
- Edge computing
- Global distribution

### API Endpoints
See [API Documentation](../api/README.md) for complete endpoint reference.

## 🎨 UI Development

### Component Library
- **Base Components**: shadcn/ui components in `components/ui/`
- **Custom Components**: Application-specific components
- **Styling**: Tailwind CSS with custom design system

### Design System
```css
/* Brand Colors */
--troves-turquoise: #14B8A6
--coves-cursive-blue: #3B82F6
--skull-turquoise: #06B6D4
--ornate-frame-gold: #F59E0B
```

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interfaces

## 🔧 Configuration

### Environment Variables
```env
# Development
VITE_DEV_MODE=true
VITE_API_URL=http://localhost:3000

# Production
VITE_API_URL=https://your-worker.workers.dev
VITE_GITHUB_PAGES_URL=https://username.github.io/repo
```

### Build Configuration
- **Vite**: Frontend build tool
- **TypeScript**: Type checking and compilation
- **Tailwind**: CSS processing
- **ESBuild**: Backend bundling

## 🐛 Debugging

### Frontend Debugging
- **React DevTools**: Browser extension for React debugging
- **Console Logging**: Strategic console.log statements
- **Source Maps**: Enabled in development builds

### Backend Debugging
- **VS Code Debugger**: Attach to Node.js process
- **Cloudflare Wrangler**: Local worker testing
- **Network Tab**: Inspect API requests/responses

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. TypeScript Errors
```bash
# Check types
npm run check

# Generate types
npm run build
```

#### 3. Cloudflare Worker Issues
```bash
# Test locally
npm run cf:dev

# Check logs
npm run cf:tail
```

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

### Tools
- [VS Code](https://code.visualstudio.com/) - Recommended IDE
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

Need help? Check the [troubleshooting section](../guides/troubleshooting.md) or create an issue.
