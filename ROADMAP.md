# ROADMAP.md

This document outlines the planned features and improvements for Troves & Coves.

## Current State

**What Works Today:**
- ✅ Static product showcase with beautiful UI
- ✅ Product catalog with categories
- ✅ Basic cart functionality (localStorage)
- ✅ Etsy integration for purchases
- ✅ Responsive design with Material You-inspired styling
- ✅ Development server with hot reload
- ✅ GitHub Pages deployment

## Phased Implementation Plan

### Phase 1: Foundation (Priority: High)

**Goal**: Make the current features production-ready and reliable.

#### 1.1 Fix Basic E-commerce Functionity
- [ ] Implement persistent cart (server-side storage, not localStorage)
- [ ] Add product search functionality
- [ ] Improve product filtering by material, gemstone, price
- [ ] Add proper error handling and loading states
- [ ] Implement proper 404 pages

#### 1.2 Data Layer
- [ ] **Decision point**: Choose between PostgreSQL vs. continue with KV-only
- [ ] If PostgreSQL: Implement `db-storage.ts` with real database connection
- [ ] If KV: Improve KV storage implementation with proper TTL management
- [ ] Add database migrations
- [ ] Add data seeding script for products

#### 1.3 Testing
- [ ] Add unit tests for components (target: 70% coverage)
- [ ] Add e2e tests for critical flows (view products, add to cart, checkout)
- [ ] Set up CI test runs

**Estimated Effort**: 2-3 weeks

---

### Phase 2: Payment & Orders (Priority: High)

**Goal**: Enable actual transactions through the site.

#### 2.1 Stripe Integration
- [ ] Implement Stripe Checkout flow
- [ ] Add Stripe webhooks for payment confirmation
- [ ] Create order management system
- [ ] Add order confirmation emails
- [ ] Implement order status tracking
- [ ] Add admin interface for order management

#### 2.2 User Accounts
- [ ] Implement user registration/login
- [ ] Add password reset flow
- [ ] Create user profile pages
- [ ] Add order history for logged-in users
- [ ] Implement saved addresses

**Estimated Effort**: 3-4 weeks

---

### Phase 3: Enhanced Shopping Experience (Priority: Medium)

**Goal**: Improve conversion and user experience.

#### 3.1 Product Features
- [ ] Product reviews and ratings
- [ ] Related products recommendations
- [ ] Recently viewed items
- [ ] Wishlist/favorites functionality
- [ ] Product comparison
- [ ] Image gallery with zoom

#### 3.2 Checkout Improvements
- [ ] Guest checkout option
- [ ] Multiple shipping addresses
- [ ] Shipping cost calculation
- [ ] Tax calculation
- [ ] Discount/promo codes
- [ ] Abandoned cart recovery emails

**Estimated Effort**: 3-4 weeks

---

### Phase 4: Admin & Operations (Priority: Medium)

**Goal**: Enable business operations through the site.

#### 4.1 Admin Dashboard
- [ ] Product management (CRUD operations)
- [ ] Inventory tracking
- [ ] Order management interface
- [ ] Customer management
- [ ] Analytics dashboard
- [ ] Sales reports

#### 4.2 Content Management
- [ ] CMS for static pages (About, FAQ, etc.)
- [ ] Blog functionality
- [ ] Banner/promotion management

**Estimated Effort**: 4-5 weeks

---

### Phase 5: Advanced Features (Priority: Low)

**Goal**: Differentiation and enhanced value.

#### 5.1 AI Features (Optional)
- [ ] Product recommendation engine
- [ ] Chatbot for customer service
- [ ] Crystal selection quiz/consultation
- [ ] AI-powered product descriptions

#### 5.2 Community Features
- [ ] User profiles with public wishlists
- [ ] Photo gallery/reviews
- [ ] Q&A forum
- [ ] Social sharing integration

#### 5.3 International
- [ ] Multi-currency support
- [ ] International shipping
- [ ] Language translations

**Estimated Effort**: 6-8 weeks

---

## Technical Debt Items

See [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md) for detailed technical debt items that should be addressed alongside feature work.

## Decision Points

### Database Architecture
**Status**: Not decided
**Options**:
1. PostgreSQL (via Neon/Supabase) - Full relational, but higher cost
2. Cloudflare KV + Durable Objects - Serverless, cheaper, but more complex
3. Continue with in-memory - Simple, but data loss on redeploy

**Recommendation**: Decide before Phase 2 (Payment & Orders)

### Authentication
**Status**: Not decided
**Options**:
1. Auth0/Clerk - Faster implementation, monthly cost
2. Custom implementation - More control, more maintenance
3. NextAuth - Free, but requires Next.js (migration needed)

**Recommendation**: Decide by Phase 2.1

## Dependencies

Some phases depend on others:
- Phase 2 requires Phase 1 database decision
- Phase 4 requires Phase 2 (users) and Phase 3 (orders)
- Phase 5 is independent and can be done anytime

## Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1 | 2-3 weeks | None |
| Phase 2 | 3-4 weeks | Phase 1 |
| Phase 3 | 3-4 weeks | Phase 1 |
| Phase 4 | 4-5 weeks | Phase 2, 3 |
| Phase 5 | 6-8 weeks | Phase 2, 3 |

**Minimum Viable E-commerce**: Phase 1 + Phase 2 (~5-7 weeks)

## Contributing

If you want to work on any of these items:
1. Open an issue to discuss the approach
2. Reference this roadmap in your PR
3. Update this roadmap as items are completed
