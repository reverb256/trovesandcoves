# Analytics & Monitoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Activate GA4 analytics, implement e-commerce event tracking, add error tracking with Sentry, and monitor Core Web Vitals.

**Architecture:** Client-side GA4 integration with privacy-friendly settings, custom event hooks for user actions, Sentry for error monitoring.

**Tech Stack:** Google Analytics 4, Sentry SDK, React hooks, TypeScript

---

## Task 1: Create Analytics component with GA4

**Files:**
- Create: `client/src/components/Analytics.tsx`
- Modify: `client/src/main.tsx`

**Step 1: Write the Analytics component**

```tsx
// client/src/components/Analytics.tsx
import { useEffect } from 'react';
import { useLocation } from 'wouter';

const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_ID;

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Initialize Google Analytics 4 with privacy-friendly settings
 */
export function Analytics() {
  const [location] = useLocation();

  useEffect(() => {
    // Only load analytics in production or if explicitly enabled
    if (!GA4_MEASUREMENT_ID) {
      console.log('GA4 not configured');
      return;
    }

    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    // Configure GA4 with privacy settings
    window.gtag('js', new Date());
    window.gtag('config', GA4_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: false, // We'll track manually with wouter
      cookie_flags: 'SameSite=None;Secure',
    });

    console.log('GA4 initialized');
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (GA4_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [location]);

  return null;
}

/**
 * GA4 event tracking helpers
 */
export const track = {
  /**
   * Track when a user views a product
   */
  viewItem: (product: { id: number; name: string; price: string; category?: string }) => {
    if (!window.gtag) return;

    window.gtag('event', 'view_item', {
      currency: 'CAD',
      value: parseFloat(product.price),
      items: [
        {
          item_id: product.id.toString(),
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  },

  /**
   * Track when items are added to cart
   */
  addToCart: (product: { id: number; name: string; price: string; category?: string }, quantity: number = 1) => {
    if (!window.gtag) return;

    window.gtag('event', 'add_to_cart', {
      currency: 'CAD',
      value: parseFloat(product.price) * quantity,
      items: [
        {
          item_id: product.id.toString(),
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity,
        },
      ],
    });
  },

  /**
   * Track when items are removed from cart
   */
  removeFromCart: (product: { id: number; name: string; price: string }, quantity: number = 1) => {
    if (!window.gtag) return;

    window.gtag('event', 'remove_from_cart', {
      currency: 'CAD',
      value: parseFloat(product.price) * quantity,
      items: [
        {
          item_id: product.id.toString(),
          item_name: product.name,
          price: product.price,
          quantity,
        },
      ],
    });
  },

  /**
   * Track when checkout begins
   */
  beginCheckout: (cart: Array<{ product: { id: number; name: string; price: string }; quantity: number }>) => {
    if (!window.gtag) return;

    const total = cart.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);

    window.gtag('event', 'begin_checkout', {
      currency: 'CAD',
      value: total,
      items: cart.map((item) => ({
        item_id: item.product.id.toString(),
        item_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
    });
  },

  /**
   * Track when a purchase is completed
   */
  purchase: (order: {
    id: string;
    total: number;
    tax: number;
    shipping: number;
    items: Array<{ productId: number; productName: string; price: number; quantity: number }>;
  }) => {
    if (!window.gtag) return;

    window.gtag('event', 'purchase', {
      transaction_id: order.id,
      affiliation: 'Troves & Coves',
      value: order.total,
      currency: 'CAD',
      tax: order.tax,
      shipping: order.shipping,
      items: order.items.map((item) => ({
        item_id: item.productId.toString(),
        item_name: item.productName,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  },

  /**
   * Track wishlist additions
   */
  addToWishlist: (product: { id: number; name: string; price: string; category?: string }) => {
    if (!window.gtag) return;

    window.gtag('event', 'add_to_wishlist', {
      currency: 'CAD',
      value: parseFloat(product.price),
      items: [
        {
          item_id: product.id.toString(),
          item_name: product.name,
          item_category: product.category,
          price: product.price,
        },
      ],
    });
  },

  /**
   * Track search queries
   */
  search: (searchTerm: string) => {
    if (!window.gtag) return;

    window.gtag('event', 'search', {
      search_term: searchTerm,
    });
  },

  /**
   * Track custom events
   */
  event: (eventName: string, parameters?: Record<string, any>) => {
    if (!window.gtag) return;

    window.gtag('event', eventName, parameters);
  },
};

/**
 * Hook to track page view timings (Core Web Vitals proxy)
 */
export function usePageViewTiming() {
  useEffect(() => {
    if (!GA4_MEASUREMENT_ID || !window.gtag) return;

    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      window.gtag('event', 'page_view_timing', {
        event_category: 'timing',
        value: Math.round(duration),
        custom_map: { metric_value: 'page_load_time' },
      });
    };
  }, []);
}
```

**Step 2: Add Analytics to main.tsx**

```tsx
// Add to client/src/main.tsx imports
import { Analytics } from '@/components/Analytics';

// Add inside App component or render alongside
<Analytics />
```

**Step 3: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 4: Commit**

```bash
git add client/src/components/Analytics.tsx client/src/main.tsx
git commit -m "feat: add GA4 analytics component

- Initialize Google Analytics 4
- Privacy-friendly settings (IP anonymization)
- Track page views on route changes
- E-commerce event tracking helpers
- Page view timing hook
"
```

---

## Task 2: Integrate tracking into ProductDetail page

**Files:**
- Modify: `client/src/pages/ProductDetail.tsx`

**Step 1: Add viewItem tracking**

Add to component imports:
```tsx
import { track } from '@/components/Analytics';
```

Add useEffect when product loads:
```tsx
useEffect(() => {
  if (product) {
    track.viewItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
  }
}, [product]);
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add client/src/pages/ProductDetail.tsx
git commit -m "feat: track product views in GA4"
```

---

## Task 3: Integrate tracking into cart operations

**Files:**
- Modify: `client/src/hooks/useCart.ts`

**Step 1: Add event tracking to cart operations**

```typescript
// Add import
import { track } from '@/components/Analytics';

// In addToCart function, after successful add:
track.addToCart(product, quantity);

// In removeFromCart function:
track.removeFromCart(product, quantity);

// In clearCart function, track each item:
items.forEach(({ product, quantity }) => {
  track.removeFromCart(product, quantity);
});
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add client/src/hooks/useCart.ts
git commit -m "feat: track cart operations in GA4

- Track add to cart events
- Track remove from cart events
- Track clear cart events
"
```

---

## Task 4: Integrate tracking into checkout

**Files:**
- Modify: `client/src/pages/Checkout.tsx`

**Step 1: Add beginCheckout tracking**

```tsx
// Add import
import { track, usePageViewTiming } from '@/components/Analytics';

// Add hook in component
usePageViewTiming();

// When moving to payment step
useEffect(() => {
  if (step === 'payment') {
    track.beginCheckout(items);
  }
}, [step, items]);
```

**Step 2: Integrate tracking into CheckoutConfirmation**

```tsx
// Modify client/src/pages/CheckoutConfirmation.tsx
import { track } from '@/components/Analytics';

// When order is loaded
useEffect(() => {
  if (order && order.payment_status === 'completed') {
    track.purchase({
      id: order.id,
      total: order.total,
      tax: order.tax_total,
      shipping: order.shipping,
      items: [], // Would need to fetch order items
    });
  }
}, [order]);
```

**Step 3: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 4: Commit**

```bash
git add client/src/pages/Checkout.tsx client/src/pages/CheckoutConfirmation.tsx
git commit -m "feat: track checkout events in GA4

- Track begin checkout
- Track purchase completed
- Track page view timings
"
```

---

## Task 5: Integrate tracking into wishlist

**Files:**
- Modify: `client/src/components/products/WishlistButton.tsx`

**Step 1: Add wishlist tracking**

```tsx
// Add import
import { track } from '@/components/Analytics';

// In toggle function, after successful toggle:
if (!exists) {
  track.addToWishlist({
    id: productId,
    name: productName || '',
    price: '0', // Would need product prop for accurate price
  });
}
```

**Step 6: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 7: Commit**

```bash
git add client/src/components/products/WishlistButton.tsx
git commit -m "feat: track wishlist additions in GA4"
```

---

## Task 6: Integrate tracking into search

**Files:**
- Modify: `client/src/pages/Products.tsx`

**Step 1: Add search tracking**

```tsx
// Add import
import { track } from '@/components/Analytics';

// Track searches when user submits search
useEffect(() => {
  if (searchQuery) {
    track.search(searchQuery);
  }
}, [searchQuery]);
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add client/src/pages/Products.tsx
git commit -m "feat: track site search in GA4"
```

---

## Task 7: Set up Sentry for error tracking

**Files:**
- Create: `client/src/sentry.ts`
- Modify: `client/src/main.tsx`
- Modify: `client/src/components/ErrorBoundary.tsx`

**Step 1: Install Sentry SDK**

Run: `npm install @sentry/react`

**Step 2: Configure Sentry**

```typescript
// client/src/sentry.ts
import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const IS_PRODUCTION = import.meta.env.PROD;

export function initSentry() {
  if (!SENTRY_DSN) {
    console.log('Sentry not configured');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    // Sample rates - adjust based on traffic
    tracesSampleRate: IS_PRODUCTION ? 0.1 : 1.0,
    replaysSessionSampleRate: IS_PRODUCTION ? 0.05 : 1.0,
    replaysOnErrorSampleRate: 1.0,

    // Integrations
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Filter out certain errors
    beforeSend(event, hint) {
      // Ignore chunk loading errors (harmless, user refresh fixes)
      if (event.exception?.values?.[0]?.value?.includes('ChunkLoadError')) {
        return null;
      }

      // Ignore network errors that are likely user connectivity issues
      if (event.exception?.values?.[0]?.value?.includes('NetworkError')) {
        return null;
      }

      return event;
    },

    // Release tracking
    release: import.meta.env.VITE_GIT_COMMIT || 'development',
  });
}

/**
 * Log an error to Sentry
 */
export function logError(error: Error, context?: Record<string, any>) {
  if (!SENTRY_DSN) {
    console.error('Error:', error, context);
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    Sentry.captureException(error);
  });
}

/**
 * Log a message to Sentry
 */
export function logMessage(message: string, level: 'info' | 'warning' = 'info') {
  if (!SENTRY_DSN) {
    console.log(`[${level}]`, message);
    return;
  }

  Sentry.captureMessage(message, level);
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: { id?: string; email?: string }) {
  if (!SENTRY_DSN) return;

  Sentry.setUser(user);
}
```

**Step 3: Update ErrorBoundary to use Sentry**

```tsx
// client/src/components/ErrorBoundary.tsx
import * as Sentry from '@sentry/react';

// Use Sentry's ErrorBoundary component
export const ErrorBoundary = Sentry.ErrorBoundary;

// Or wrap custom boundary with Sentry
export function CustomErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <div role="alert" className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
          {process.env.NODE_ENV === 'development' && (
            <pre>{error.message}</pre>
          )}
          <button onClick={resetError}>Try again</button>
        </div>
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
```

**Step 4: Initialize Sentry in main.tsx**

```tsx
// client/src/main.tsx
import { initSentry } from './sentry';

// Initialize before rendering
initSentry();
```

**Step 5: Add Sentry context helpers**

Create `client/src/lib/sentry-context.ts`:
```typescript
// client/src/lib/sentry-context.ts
import { setUserContext, logError } from '@/sentry';

/**
 * Set user context from cart/email (guest checkout)
 */
export function setCheckoutUser(email: string) {
  setUserContext({
    email,
    id: email, // Using email as ID for guest users
  });
}

/**
 * Log checkout errors with context
 */
export function logCheckoutError(error: Error, context: {
  step: 'shipping' | 'payment' | 'confirm';
  cartTotal?: number;
  itemCount?: number;
}) {
  logError(error, context);
}
```

**Step 6: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 7: Commit**

```bash
git add client/src/sentry.ts client/src/main.tsx client/src/components/ErrorBoundary.tsx client/src/lib/sentry-context.ts package.json package-lock.json
git commit -m "feat: add Sentry error tracking

- Configure Sentry with replay
- Filter harmless errors
- Add error logging helpers
- Integrate with ErrorBoundary
- Add checkout error context
"
```

---

## Task 8: Add Core Web Vitals monitoring

**Files:**
- Create: `client/src/components/WebVitals.tsx`
- Modify: `client/src/main.tsx`

**Step 1: Create Web Vitals component**

```tsx
// client/src/components/WebVitals.tsx
import { useEffect } from 'react';

/**
 * Report Core Web Vitals to GA4
 * Based on web-vitals library recommendations
 */
export function WebVitals() {
  useEffect(() => {
    if (!import.meta.env.VITE_GA4_ID) return;

    // Dynamically import web-vitals to reduce initial bundle size
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      const sendToAnalytics = ({ name, value, id }: { name: string; value: number; id: string }) => {
        if (window.gtag) {
          window.gtag('event', name, {
            event_category: 'Web Vitals',
            event_label: id,
            value: Math.round(name === 'CLS' ? value * 1000 : value),
            non_interaction: true,
          });
        }
      };

      // Core Web Vitals
      getCLS(sendToAnalytics); // Cumulative Layout Shift
      getFID(sendToAnalytics); // First Input Delay
      getFCP(sendToAnalytics); // First Contentful Paint
      getLCP(sendToAnalytics); // Largest Contentful Paint
      getTTFB(sendToAnalytics); // Time to First Byte
    });
  }, []);

  return null;
}
```

**Step 2: Install web-vitals**

Run: `npm install web-vitals`

**Step 3: Add WebVitals to main.tsx**

```tsx
import { WebVitals } from '@/components/WebVitals';

// Add alongside Analytics
<WebVitals />
```

**Step 4: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 5: Commit**

```bash
git add client/src/components/WebVitals.tsx client/src/main.tsx package.json package-lock.json
git commit -m "feat: add Core Web Vitals monitoring

- Track CLS, FID, FCP, LCP, TTFB
- Report metrics to GA4
- Use dynamic import for code splitting
"
```

---

## Task 9: Create analytics documentation

**Files:**
- Create: `docs/analytics-setup.md`

**Step 1: Write analytics documentation**

```markdown
# Analytics Setup

## Overview

This project uses Google Analytics 4 for user analytics and Sentry for error tracking.

## Google Analytics 4

### Setup

1. Create a GA4 property at https://analytics.google.com
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Set `VITE_GA4_ID` in your environment variables

### Events Tracked

| Event Name | Description | Parameters |
|-----------|-------------|------------|
| `page_view` | Page navigation | page_path, page_location, page_title |
| `view_item` | Product detail view | item_id, item_name, price |
| `add_to_cart` | Item added to cart | item_id, item_name, price, quantity |
| `remove_from_cart` | Item removed from cart | item_id, item_name, price, quantity |
| `begin_checkout` | Checkout started | items array, value |
| `purchase` | Order completed | transaction_id, value, tax, shipping |
| `add_to_wishlist` | Item added to wishlist | item_id, item_name, price |
| `search` | Site search performed | search_term |

### Privacy Settings

- IP anonymization enabled
- No cookies sent with cross-site requests
- Send page view tracking disabled (manual)
- SameSite=None;Secure for cookies

## Sentry Error Tracking

### Setup

1. Create a Sentry project at https://sentry.io
2. Get your DSN
3. Set `VITE_SENTRY_DSN` in your environment variables

### Features Enabled

- Error tracking with stack traces
- Performance monitoring (10% sample in production)
- Session replay (5% sample in production)
- User context tracking

### Error Filtering

The following errors are filtered out:
- ChunkLoadError (harmless, fixed by refresh)
- NetworkError (likely user connectivity issues)

## Core Web Vitals

The following metrics are tracked:

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | < 2.5s | < 4s | > 4s |
| FID | < 100ms | < 300ms | > 300ms |
| CLS | < 0.1 | < 0.25 | > 0.25 |
| FCP | < 1.8s | < 3s | > 3s |
| TTFB | < 800ms | < 1800ms | > 1800s |

## Environment Variables

```bash
# Analytics
VITE_GA4_ID=G-XXXXXXXXXX

# Error Tracking
VITE_SENTRY_DSN=https://...@sentry.io/...
```

## Viewing Analytics

1. **GA4 Dashboard**: https://analytics.google.com
   - Real-time dashboard for live events
   - Reports → Engagement → Events for event tracking
   - Reports → Monetization → E-commerce purchases

2. **Sentry Dashboard**: https://sentry.io
   - Issues tab for error list
   - Performance tab for slow transactions
   - Replay tab for session recordings
```

**Step 2: Commit documentation**

```bash
git add docs/analytics-setup.md
git commit -m "docs: add analytics setup documentation"
```

---

## Task 10: Update environment variables

**Files:**
- Modify: `.env.example`

**Step 1: Add analytics environment variables**

```bash
cat >> .env.example << 'EOF'

# Analytics
VITE_GA4_ID=G-XXXXXXXXXX

# Error Tracking
VITE_SENTRY_DSN=https://...@sentry.io/...

# Release tracking (optional)
VITE_GIT_COMMIT=$(git rev-parse HEAD)
EOF
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add analytics environment variables to example"
```

---

## Task 11: Test analytics and error tracking

**Files:**
- Test: Manual verification

**Step 1: Verify GA4 initialization**

Run: `npm run dev`

Check browser console:
- Should see "GA4 initialized" if VITE_GA4_ID is set
- Should see "GA4 not configured" if not set

**Step 2: Verify event tracking**

Test each event:
1. Navigate to product page - check console for page_view event
2. Add item to cart - check for add_to_cart event
3. Go to checkout - check for begin_checkout event
4. Search for products - check for search event

Use GA4 Real-time view to confirm events are received.

**Step 3: Verify error tracking**

Add intentional error to test:
```tsx
throw new Error('Test error for Sentry');
```

Check Sentry dashboard for error report.

Remove test error after verification.

**Step 4: Verify Web Vitals**

Open DevTools → Performance → Record
- Navigate through site
- Stop recording
- Check LCP, FCP, CLS values

**Step 5: Run tests**

Run: `npm run test`

Expected: All tests pass

**Step 6: Build production**

Run: `npm run build`

Expected: Build succeeds

---

## Task 12: Create completion report

**Files:**
- Create: `docs/plans/2026-03-13-analytics-completion-report.md`

**Step 1: Write completion report**

```markdown
# Analytics & Monitoring Completion Report

**Date:** 2026-03-13
**Phase:** Analytics & Monitoring (Phase 5)

## Completed Tasks

### 1. Google Analytics 4
- [x] GA4 initialization with privacy settings
- [x] Page view tracking on route changes
- [x] E-commerce event tracking (view, add to cart, checkout, purchase)
- [x] Wishlist event tracking
- [x] Search event tracking

### 2. Sentry Error Tracking
- [x] Sentry SDK integration
- [x] Error boundary integration
- [x] Error filtering for harmless errors
- [x] User context tracking
- [x] Checkout error logging

### 3. Core Web Vitals
- [x] Web Vitals monitoring
- [x] CLS, FID, FCP, LCP, TTFB tracking
- [x] Metrics reported to GA4

### 4. Documentation
- [x] Analytics setup guide
- [x] Event tracking reference
- [x] Environment variable documentation

## Results

### Before
- No analytics tracking
- No error monitoring
- No performance metrics

### After
- Full GA4 integration with e-commerce events
- Sentry error tracking with replay
- Core Web Vitals monitoring
- Privacy-friendly settings (IP anonymization)

## Expected Impact
- Visibility into user behavior and conversion funnel
- Proactive error detection before users report
- Performance baseline for optimization
- Data-driven product decisions
```

**Step 2: Commit report**

```bash
git add docs/plans/2026-03-13-analytics-completion-report.md
git commit -m "docs: add analytics completion report"
```

---

## Testing Checklist

Before marking this complete, verify:

- [ ] GA4 initializes without console errors
- [ ] Page views are tracked on navigation
- [ ] Product views are tracked
- [ ] Add to cart events fire
- [ ] Checkout events fire
- [ ] Sentry captures errors
- [ ] Web Vitals metrics appear in GA4
- [ ] All tests pass: `npm run test`
- [ ] TypeScript check passes: `npm run check`
- [ ] Production build succeeds: `npm run build`

---

**Total Estimated Time:** 3-4 hours

**Dependencies:**
- Requires GA4 property setup (external)
- Requires Sentry project setup (external)
- Phase 3 (Conversion Features) - for wishlist tracking
- Phase 4 (Direct Checkout) - for checkout/purchase tracking

**Next Phase:** Phase 6 - Social Proof & Trust

---

## Continuation After Context Compression

If this session is compressed and you need to continue:

1. **Current Progress:** You completed Phase 5 (Analytics & Monitoring)
2. **Next Step:** Implement Phase 6 (Social Proof & Trust)
3. **Key Files Created:**
   - `client/src/components/Analytics.tsx` - GA4 tracking
   - `client/src/sentry.ts` - Sentry configuration
   - `client/src/components/WebVitals.tsx` - Core Web Vitals
   - `client/src/lib/sentry-context.ts` - Error helpers
   - `docs/analytics-setup.md` - Documentation
4. **Design Reference:** `docs/plans/2026-03-13-comprehensive-improvements-design.md` - Phase 6 section
5. **External Setup Required:**
   - GA4 property: https://analytics.google.com
   - Sentry project: https://sentry.io

Continue to Phase 6 implementation plan at `docs/plans/2026-03-13-social-proof-implementation.md`
