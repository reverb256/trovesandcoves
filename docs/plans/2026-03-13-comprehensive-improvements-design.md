# Comprehensive Improvements Design Document

**Project:** Troves & Coves - Crystal Jewelry E-commerce
**Date:** 2026-03-13
**Status:** Approved
**Author:** Claude Code (Sonnet 4.6)

---

## Executive Summary

This document outlines a comprehensive improvement plan for the Troves & Coves crystal jewelry website. The plan addresses SEO, conversion, content, and technical infrastructure, with a focus on adding direct checkout capabilities (Stripe, PayPal, E-Transfer) while maintaining Etsy integration.

**Business Goals:**

1. Increase organic traffic through SEO improvements
2. Capture Canadian sales directly with multiple payment options
3. Reduce customer support burden through better content
4. Build trust and credibility through social proof

**Technical Approach:**

- Phase-based implementation (7 phases over ~8-10 weeks)
- Maintain existing Material You design system
- Build checkout infrastructure that supports both direct and Etsy-driven sales
- Prioritize privacy-friendly analytics and excellent Core Web Vitals

---

## Architecture Overview

### Current State

- Static React + Vite frontend
- Wouter routing with base path for GitHub Pages
- In-memory product storage with seeded data
- LocalStorage-based cart
- Etsy integration for all purchases
- shadcn/ui component library with Material You styling

### Target State

```
┌─────────────────────────────────────────────────────────────┐
│                      User Layer                             │
├─────────────────────────────────────────────────────────────┤
│  React Frontend (Vite)                                      │
│  ├── Pages: Home, Products, ProductDetail, Checkout, etc.  │
│  ├── Components: shadcn/ui + custom                        │
│  └── State: React Query + Zustand for cart/wishlist        │
├─────────────────────────────────────────────────────────────┤
│                      Checkout Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Payment Providers:                                         │
│  ├── Stripe (Cards, Apple Pay, Google Pay)                 │
│  ├── PayPal (Standard/Express)                             │
│  └── E-Transfer (Manual for Canada)                        │
├─────────────────────────────────────────────────────────────┤
│                      Service Layer                          │
├─────────────────────────────────────────────────────────────┤
│  API Routes:                                                 │
│  ├── /api/products/* (existing)                            │
│  ├── /api/checkout/* (new)                                 │
│  ├── /api/orders/* (new)                                   │
│  └── /api/webhooks/* (new - Stripe/PayPal)                │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                             │
├─────────────────────────────────────────────────────────────┤
│  Storage:                                                   │
│  ├── PostgreSQL via Neon (orders, customers)                │
│  ├── Cloudflare KV (sessions, cache)                       │
│  └── In-memory (products, categories - seeded)             │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: SEO Foundation

### Critical Issues to Fix

#### 1.1 Duplicate Title Tags

**Problem:** All pages currently share the same title tag.

**Solution:**

```tsx
// client/src/components/SEOHead.tsx - enhance
const getPageTitle = (path: string, productName?: string) => {
  const titles: Record<string, string> = {
    '/': 'Troves & Coves - Handcrafted Crystal Jewelry | 14k Gold-Plated Statement Pieces',
    '/products':
      'Shop Crystal Jewelry | Handcrafted Necklaces & Bracelets | Troves & Coves',
    '/about': 'About Troves & Coves | Handcrafted in Winnipeg, Canada',
    '/contact': 'Contact Us | Custom Crystal Jewelry Orders | Troves & Coves',
    '/checkout': 'Checkout | Secure Payment | Troves & Coves',
  };

  if (productName && path.startsWith('/product/')) {
    return `${productName} | Handcrafted Crystal Jewelry | Troves & Coves`;
  }

  return titles[path] || titles['/'];
};
```

#### 1.2 Page-Specific Meta Descriptions

**Solution:**

```tsx
const getMetaDescription = (path: string) => {
  const descriptions: Record<string, string> = {
    '/': 'Discover handcrafted crystal jewelry with timeless elegance. Shop unique crystal necklaces & bracelets crafted in Winnipeg, Canada.',
    '/products':
      'Browse our collection of handcrafted crystal jewelry. Wire-wrapped pendants, gemstone necklaces, and leather cord pendants.',
    // ... etc
  };
  return descriptions[path] || descriptions['/'];
};
```

#### 1.3 Breadcrumb Schema

**Component:** `client/src/components/BreadcrumbSchema.tsx`

```tsx
interface BreadcrumbItem {
  name: string;
  path: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://trovesandcoves.ca${item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## Phase 2: Content & Education

### New Pages Structure

```
client/src/pages/faq/
├── index.tsx              # Main FAQ with accordion
├── shipping.tsx           # Shipping information
├── returns.tsx            # Return & exchange policy (exists, move)
├── sizing.tsx             # Size guide (exists, move)
└── care.tsx               # Jewelry care guide (exists, move)

client/src/pages/crystals/
├── index.tsx              # Crystal meanings overview
├── meanings.tsx           # Each crystal's properties
└── guide.tsx              # Choosing your crystal
```

### FAQ Schema Implementation

```tsx
// FAQPage schema for rich results
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};
```

---

## Phase 3: Conversion Features

### 3.1 Wishlist/Favorites

**Storage:** LocalStorage (no account required initially)

```typescript
// client/src/lib/wishlist.ts
interface WishlistStorage {
  items: number[]; // product IDs
  updatedAt: string;
}

export const wishlist = {
  add: (productId: number) => { /* ... */ },
  remove: (productId: number) => { /* ... */ },
  toggle: (productId: number) => { /* ... */ },
  has: (productId: number) => boolean,
  getAll: () => number[],
};
```

**Component:** `client/src/components/products/WishlistButton.tsx`

- Heart icon that toggles filled/outline
- Shows count in header similar to cart
- Quick access dropdown

### 3.2 Stock Badges

```tsx
// Already have data, just display it
<StockBadge quantity={product.stockQuantity} />

// Renders:
// quantity === 0 → "Out of Stock"
// quantity <= 3 → `Only ${quantity} left!`
// quantity > 10 → "In Stock"
```

### 3.3 Product Quick View Modal

```tsx
// client/src/components/products/QuickViewModal.tsx
interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

// Shows:
// - Product image
// - Price
// - Gemstones/Materials
// - Add to Cart button
// - "View Full Details" link
```

---

## Phase 4: Direct Checkout

### Checkout Flow Diagram

```
┌────────┐     ┌──────────┐     ┌─────────┐     ┌────────┐     ┌──────────┐
│  Cart  │────►│ Shipping │────►│ Payment │────►│ Review │────►│ Confirm  │
│        │     │  Form    │     │ Method  │     │        │     │          │
└────────┘     └──────────┘     └─────────┘     └────────┘     └──────────┘
                   │                  │
                   │                  ├─────────────┬────────────┐
                   │                  │             │            │
                   ▼                  ▼             ▼            ▼
              │ Address         │ Stripe      │ PayPal   │ E-Transfer
              │ Validation     │ (Cards)     │          │ (Manual)
                               │ Apple Pay   │          │ Hold until
                               │ Google Pay  │          │ received
```

### Payment Provider Architecture

```typescript
// client/src/lib/payments/base.ts
interface PaymentProvider {
  name: string;
  initialize(): Promise<void>;
  createPayment(amount: number, currency: string): Promise<PaymentResult>;
  confirmPayment(paymentId: string, data?: any): Promise<ConfirmResult>;
}

// client/src/lib/payments/stripe.ts
class StripeProvider implements PaymentProvider {
  async createPayment(amount: number, currency: string) {
    // Call /api/checkout/create-payment-intent
  }
}

// client/src/lib/payments/paypal.ts
class PayPalProvider implements PaymentProvider {
  async createPayment(amount: number, currency: string) {
    // Call /api/checkout/create-paypal-order
  }
}

// client/src/lib/payments/etransfer.ts
class ETransferProvider implements PaymentProvider {
  async createPayment(amount: number, currency: string) {
    // Return payment details, hold order
    // Email notification with transfer info
  }
}
```

### Server-Side Order Processing

```typescript
// server/routes/checkout.ts
interface CreateOrderRequest {
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: 'stripe' | 'paypal' | 'etransfer';
  customerEmail: string;
}

interface CreateOrderResponse {
  orderId: string;
  paymentClientSecret?: string; // For Stripe
  paypalOrderId?: string; // For PayPal
  etransferDetails?: ETransferDetails; // For E-Transfer
}
```

### Tax Calculation

```typescript
// server/lib/tax.ts
const TAX_RATES = {
  MB: { gst: 0.05, pst: 0.07, name: 'Manitoba' },
  ON: { gst: 0.05, hst: 0.13, name: 'Ontario' },
  BC: { gst: 0.05, pst: 0.07, name: 'British Columbia' },
  // ... all provinces
};

export function calculateTax(subtotal: number, province: string): TaxBreakdown {
  const rates = TAX_RATES[province] || { gst: 0.05, pst: 0, name: 'Other' };
  return {
    gst: subtotal * rates.gst,
    pst: subtotal * (rates.pst || 0),
    hst: subtotal * (rates.hst || 0),
    total: subtotal * (rates.gst + (rates.pst || 0) + (rates.hst || 0)),
    provinceName: rates.name,
  };
}
```

### Shipping Rates

```typescript
// server/lib/shipping.ts
interface ShippingRate {
  zone: string;
  provinces: string[];
  rate: number;
  freeThreshold?: number;
}

const SHIPPING_RATES: ShippingRate[] = [
  { zone: 'Local', provinces: ['MB'], rate: 0, freeThreshold: 100 },
  { zone: 'Canada', provinces: ['AB', 'BC', 'SK', ...], rate: 15, freeThreshold: 150 },
  { zone: 'US', provinces: [], rate: 25, freeThreshold: 200 },
];

export function calculateShipping(subtotal: number, province: string): number {
  const rate = SHIPPING_RATES.find(r => r.provinces.includes(province));
  if (!rate) return 25; // Default international
  if (rate.freeThreshold && subtotal >= rate.freeThreshold) return 0;
  return rate.rate;
}
```

---

## Phase 5: Analytics & Monitoring

### Analytics Activation

```typescript
// client/src/components/Analytics.tsx - uncomment and configure
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_ID;

export function Analytics() {
  useEffect(() => {
    // Load GA4 script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    gtag('js', new Date());
    gtag('config', GA4_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: false,
    });
  }, []);

  // Track page views on route change
  useEffect(() => {
    const path = location;
    gtag('event', 'page_view', { page_path: path });
  }, [location]);
}
```

### E-commerce Events

```typescript
// client/src/lib/analytics.ts
export const track = {
  viewItem: (product: Product) => {
    gtag('event', 'view_item', {
      currency: 'CAD',
      value: parseFloat(product.price),
      items: [{ item_id: product.id, item_name: product.name }],
    });
  },

  addToCart: (product: Product, quantity: number) => {
    gtag('event', 'add_to_cart', {
      currency: 'CAD',
      value: parseFloat(product.price) * quantity,
      items: [{ item_id: product.id, item_name: product.name, quantity }],
    });
  },

  beginCheckout: (cart: CartItem[]) => {
    const total = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    gtag('event', 'begin_checkout', {
      currency: 'CAD',
      value: total,
      items: cart.map(item => ({
        item_id: item.product.id,
        item_name: item.product.name,
        quantity: item.quantity,
      })),
    });
  },

  purchase: (order: Order) => {
    gtag('event', 'purchase', {
      currency: 'CAD',
      transaction_id: order.id,
      value: order.total,
      items: order.items.map(item => ({
        item_id: item.productId,
        item_name: item.productName,
        quantity: item.quantity,
      })),
    });
  },
};
```

---

## Phase 6: Social Proof & Trust

### Etsy Review Sync

```typescript
// server/services/etsy-sync.ts
interface EtsyReview {
  reviewId: string;
  rating: number;
  message: string;
  createdAt: string;
  reviewer: {
    name: string;
    avatar?: string;
  };
}

// Fetch reviews via Etsy API (or manual import)
export async function syncEtsyReviews(): Promise<EtsyReview[]> {
  // Option 1: Etsy API (requires authentication)
  // Option 2: Manual CSV export from Etsy shop
  // Option 3: Periodic manual update via admin
}
```

### Customer Photo Gallery

```typescript
// client/src/components/social/CustomerGallery.tsx
interface CustomerPhoto {
  id: string;
  image: string;
  product: string;
  caption?: string;
  instagram?: string; // Credit source
}

// Initially: Manual entries
// Future: Instagram hashtag scraping or customer submissions
```

---

## Phase 7: Testing & Quality

### Unit Test Targets

```typescript
// client/src/lib/__tests__/wishlist.test.ts
describe('Wishlist', () => {
  test('adds product to wishlist', () => {
    /* ... */
  });
  test('removes product from wishlist', () => {
    /* ... */
  });
  test('persists across sessions', () => {
    /* ... */
  });
});

// client/src/lib/__tests__/tax.test.ts
describe('Tax Calculation', () => {
  test('calculates Manitoba GST + PST correctly', () => {
    /* ... */
  });
  test('handles provinces with HST', () => {
    /* ... */
  });
  test('handles international customers (no tax)', () => {
    /* ... */
  });
});
```

### E2E Test Scenarios

```typescript
// tests/e2e/checkout.spec.ts
test('complete checkout flow with Stripe', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="product-1"]');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="cart-icon"]');
  await page.click('[data-testid="checkout-button"]');
  // ... fill shipping, select payment, confirm
});
```

---

## Database Schema Additions

### New Tables

```sql
-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  status VARCHAR(20) DEFAULT 'received',
  payment_method VARCHAR(20) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL
);

-- Customers (optional, for account holders)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255), -- Optional for guest checkout
  created_at TIMESTAMP DEFAULT NOW()
);

-- Addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(50) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  country VARCHAR(2) DEFAULT 'CA',
  is_default BOOLEAN DEFAULT false
);

-- Wishlists (for when accounts are added)
CREATE TABLE wishlist_items (
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (customer_id, product_id)
);
```

---

## Environment Variables

```bash
# .env.example - additions
VITE_GA4_ID=G-XXXXXXXXXX

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
VITE_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_WEBHOOK_ID=...

# Email (for order notifications)
SMTP_HOST=smtp.resend.com
SMTP_API_KEY=re_...

# Database
DATABASE_URL=postgresql://...

# App
SITE_URL=https://trovesandcoves.ca
```

---

## Success Metrics

### SEO Targets (3 months)

- Organic traffic: +30-50%
- Keyword rankings: Top 20 for "crystal jewelry Winnipeg"
- Indexation: All product pages indexed

### Conversion Targets (3 months post-checkout)

- Direct checkout rate: 15% of Canadian orders
- Wishlist conversion: 10% of wishlisted items purchased
- Cart abandonment: <70% (industry avg ~75%)

### Performance Targets

- LCP: <2s (currently 1.36s)
- CLS: <0.05 (currently 0.001)
- INP: <200ms (currently unknown)

---

## Implementation Checklist

### Phase 1: SEO Foundation

- [ ] Fix duplicate title tags
- [ ] Add page-specific meta descriptions
- [ ] Implement breadcrumb schema
- [ ] Add product schema to all product pages
- [ ] Optimize H1 tags

### Phase 2: Content

- [ ] Create FAQ page
- [ ] Create crystal meanings guide
- [ ] Create materials guide
- [ ] Enhance about page

### Phase 3: Conversion

- [ ] Implement wishlist
- [ ] Add stock badges
- [ ] Create quick view modal
- [ ] Add social proof bar
- [ ] Embed Instagram feed

### Phase 4: Checkout

- [ ] Set up PostgreSQL (Neon)
- [ ] Create checkout pages (shipping, payment, review)
- [ ] Integrate Stripe
- [ ] Integrate PayPal
- [ ] Implement E-Transfer flow
- [ ] Add tax calculation
- [ ] Add shipping rates
- [ ] Create order management

### Phase 5: Analytics

- [ ] Activate GA4
- [ ] Implement e-commerce events
- [ ] Add error tracking (Sentry)
- [ ] Monitor Core Web Vitals

### Phase 6: Social Proof

- [ ] Sync Etsy reviews
- [ ] Create customer photo gallery
- [ ] Add press/badges section
- [ ] Add live chat widget

### Phase 7: Testing

- [ ] Write unit tests (70% coverage target)
- [ ] Write E2E tests for checkout flow
- [ ] Run accessibility audit
- [ ] Fix issues found

---

**Document Version:** 1.0
**Last Updated:** 2026-03-13
**Next Review:** After Phase 1 completion
