# Troves & Coves Static Deployment Refactoring Plan

## Executive Summary
Migrate trovesandcoves from monolithic Express+PostgreSQL to static GitHub Pages frontend with serverless backend architecture.

## Current State
- Frontend: React/Vite (client-side)
- Backend: Express.js server with session management
- Database: PostgreSQL with Drizzle ORM
- Features: Products, cart, orders, Stripe payments, AI chat
- Deployment: Hybrid GitHub Pages + Cloudflare Workers (partially implemented)

## Target Architecture

### 1. Frontend (GitHub Pages)
- Pure static React build
- No server-side dependencies
- API calls to serverless endpoints
- GitHub Actions for deployment

### 2. Backend (Serverless)
**Recommended: Vercel Functions**
- Better TypeScript support
- Integrated deployment
- Generous free tier
- Edge functions support

**Alternative: Netlify Functions**
- Also excellent choice
- Similar capabilities
- Good free tier

### 3. Database (Serverless PostgreSQL)
**Recommended: Neon**
- Native PostgreSQL
- Serverless scaling
- Generous free tier
- Drizzle compatible

**Alternative: Supabase**
- PostgreSQL + real-time
- Good free tier
- Additional features

## Implementation Strategy

### Phase 1: Database Migration
1. Set up Neon database
2. Migrate existing schema using Drizzle
3. Test data access
4. Update database connection

### Phase 2: Backend Serverless Conversion
1. Convert Express routes to Vercel functions
2. Implement proper CORS for GitHub Pages
3. Add authentication for serverless
4. Test API endpoints

### Phase 3: Frontend Updates
1. Update API client for serverless endpoints
2. Remove session dependencies (use JWT/localStorage)
3. Test all functionality
4. Optimize for static deployment

### Phase 4: Deployment Setup
1. Configure Vercel backend
2. Set up GitHub Pages frontend
3. Environment variables management
4. CI/CD pipeline

## Preserved Features
✅ Product catalog and browsing
✅ Shopping cart functionality  
✅ Stripe payment processing
✅ Order management
✅ Contact forms
✅ AI chat functionality
✅ Admin dashboard
✅ Security compliance

## File Structure Changes

### New Structure
```
trovesandcoves/
├── client/                 # React frontend (GitHub Pages)
│   ├── src/
│   └── package.json
├── api/                    # Serverless functions (Vercel)
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── payments/
│   └── contact/
├── shared/                 # Shared types and utilities
├── scripts/               # Migration and deployment scripts
└── docs/                  # Documentation
```

### Removed/Moved
- `server/index.ts` → Replaced with API functions
- `server/routes.ts` → Split into individual API functions
- `server/storage.ts` → Database utilities in API functions
- Session middleware → JWT/localStorage approach

## Benefits
1. **Free hosting**: GitHub Pages (frontend) + Vercel (backend)
2. **Better scalability**: Serverless auto-scaling
3. **Simplified deployment**: Separate frontend/backend concerns
4. **Lower costs**: No server maintenance
5. **Better performance**: Edge-optimized backend

## Timeline
- Day 1: Database migration setup
- Day 2: Backend serverless conversion
- Day 3: Frontend updates and testing
- Day 4: Deployment and final testing

## Risk Mitigation
1. **Data backup**: Full database backup before migration
2. **Feature testing**: Comprehensive testing of each feature
3. **Rollback plan**: Keep current deployment as fallback
4. **Gradual migration**: Can migrate features incrementally

## Success Metrics
- All e-commerce functionality preserved
- Faster page loads (static hosting)
- Zero server costs
- Successful deployment on both platforms
- Complete e-commerce flow functional