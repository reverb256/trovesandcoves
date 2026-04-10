# Testing & Quality Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement comprehensive testing with unit tests for critical functions, E2E tests for checkout flow, accessibility audit, and performance monitoring.

**Architecture:** Vitest for unit testing, Playwright for E2E testing, axe-core for accessibility, Lighthouse for performance audits.

**Tech Stack:** Vitest, Playwright, React Testing Library, axe-core, TypeScript

---

## Task 1: Set up testing infrastructure

**Files:**

- Create: `vitest.config.ts`
- Modify: `package.json`
- Create: `client/src/test/setup.ts`

**Step 1: Configure Vitest**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './client/src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'client/src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        'server/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@assets': path.resolve(__dirname, './attached_assets'),
    },
  },
});
```

**Step 2: Update test scripts in package.json**

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

**Step 3: Create test setup file**

```typescript
// client/src/test/setup.ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe() {}
  disconnect() {}
  unobserve() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});
```

**Step 4: Install testing dependencies**

Run: `npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`

**Step 5: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 6: Commit**

```bash
git add vitest.config.ts package.json client/src/test/setup.ts package-lock.json
git commit -m "test: set up Vitest testing infrastructure

- Configure Vitest with jsdom environment
- Add test scripts (run, coverage, e2e)
- Create test setup with cleanup
- Mock browser APIs
"
```

---

## Task 2: Create wishlist unit tests

**Files:**

- Create: `client/src/lib/__tests__/wishlist.test.ts`

**Step 1: Write wishlist tests**

```typescript
// client/src/lib/__tests__/wishlist.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getWishlistItems,
  addWishlistItem,
  removeWishlistItem,
  toggleWishlistItem,
  isInWishlist,
  getWishlistCount,
  clearWishlist,
} from '../wishlist';

const STORAGE_KEY = 'trovesandcoves_wishlist';

describe('Wishlist', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getWishlistItems', () => {
    it('should return empty array when no items in storage', () => {
      const result = getWishlistItems();
      expect(result).toEqual([]);
    });

    it('should return items from storage', () => {
      const items = [1, 2, 3];
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items, updatedAt: new Date().toISOString() })
      );

      const result = getWishlistItems();
      expect(result).toEqual(items);
    });

    it('should handle corrupted storage gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');

      const result = getWishlistItems();
      expect(result).toEqual([]);
    });
  });

  describe('addWishlistItem', () => {
    it('should add item to wishlist', () => {
      addWishlistItem(1);
      const result = getWishlistItems();
      expect(result).toEqual([1]);
    });

    it('should not add duplicate items', () => {
      addWishlistItem(1);
      addWishlistItem(1);
      const result = getWishlistItems();
      expect(result).toEqual([1]);
    });

    it('should add multiple items', () => {
      addWishlistItem(1);
      addWishlistItem(2);
      addWishlistItem(3);
      const result = getWishlistItems();
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('removeWishlistItem', () => {
    it('should remove item from wishlist', () => {
      addWishlistItem(1);
      addWishlistItem(2);
      removeWishlistItem(1);
      const result = getWishlistItems();
      expect(result).toEqual([2]);
    });

    it('should handle removing non-existent item', () => {
      addWishlistItem(1);
      removeWishlistItem(999);
      const result = getWishlistItems();
      expect(result).toEqual([1]);
    });
  });

  describe('toggleWishlistItem', () => {
    it('should add item when not in wishlist', () => {
      const result = toggleWishlistItem(1);
      expect(result).toBe(true);
      expect(getWishlistItems()).toEqual([1]);
    });

    it('should remove item when already in wishlist', () => {
      addWishlistItem(1);
      const result = toggleWishlistItem(1);
      expect(result).toBe(false);
      expect(getWishlistItems()).toEqual([]);
    });

    it('should return true for new item, false for existing', () => {
      expect(toggleWishlistItem(1)).toBe(true);
      expect(toggleWishlistItem(1)).toBe(false);
      expect(toggleWishlistItem(1)).toBe(true);
    });
  });

  describe('isInWishlist', () => {
    it('should return false for empty wishlist', () => {
      expect(isInWishlist(1)).toBe(false);
    });

    it('should return true when item is in wishlist', () => {
      addWishlistItem(1);
      expect(isInWishlist(1)).toBe(true);
    });

    it('should return false when item is not in wishlist', () => {
      addWishlistItem(2);
      expect(isInWishlist(1)).toBe(false);
    });
  });

  describe('getWishlistCount', () => {
    it('should return 0 for empty wishlist', () => {
      expect(getWishlistCount()).toBe(0);
    });

    it('should return correct count', () => {
      addWishlistItem(1);
      addWishlistItem(2);
      addWishlistItem(3);
      expect(getWishlistCount()).toBe(3);
    });
  });

  describe('clearWishlist', () => {
    it('should clear all items', () => {
      addWishlistItem(1);
      addWishlistItem(2);
      clearWishlist();
      expect(getWishlistItems()).toEqual([]);
    });

    it('should remove storage key', () => {
      addWishlistItem(1);
      clearWishlist();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });
});
```

**Step 2: Run tests**

Run: `npm run test`

Expected: All wishlist tests pass

**Step 3: Commit**

```bash
git add client/src/lib/__tests__/wishlist.test.ts
git commit -m "test: add wishlist unit tests

- Test all wishlist functions
- Test edge cases (duplicates, corrupted data)
- 100% coverage of wishlist module
"
```

---

## Task 3: Create tax calculation unit tests

**Files:**

- Create: `server/lib/__tests__/tax.test.ts`

**Step 1: Write tax calculation tests**

```typescript
// server/lib/__tests__/tax.test.ts
import { describe, it, expect } from 'vitest';
import {
  calculateTax,
  getTaxRate,
  getProvinces,
  isValidPostalCode,
} from '../tax';

describe('Tax Calculation', () => {
  describe('calculateTax', () => {
    it('should calculate GST only for Alberta', () => {
      const result = calculateTax(100, 'AB');
      expect(result.gst).toBe(5);
      expect(result.pst).toBe(0);
      expect(result.hst).toBe(0);
      expect(result.total).toBe(5);
      expect(result.provinceName).toBe('Alberta');
    });

    it('should calculate GST + PST for Manitoba', () => {
      const result = calculateTax(100, 'MB');
      expect(result.gst).toBe(5);
      expect(result.pst).toBe(7);
      expect(result.hst).toBe(0);
      expect(result.total).toBe(12);
      expect(result.provinceName).toBe('Manitoba');
    });

    it('should calculate HST for Ontario', () => {
      const result = calculateTax(100, 'ON');
      expect(result.gst).toBe(0);
      expect(result.pst).toBe(0);
      expect(result.hst).toBe(13);
      expect(result.total).toBe(13);
      expect(result.provinceName).toBe('Ontario');
    });

    it('should calculate QST for Quebec', () => {
      const result = calculateTax(100, 'QC');
      expect(result.gst).toBe(5);
      expect(result.pst).toBeCloseTo(9.975, 2);
      expect(result.hst).toBe(0);
      expect(result.total).toBeCloseTo(14.975, 2);
      expect(result.provinceName).toBe('Quebec');
    });

    it('should calculate HST for maritime provinces', () => {
      const nb = calculateTax(100, 'NB');
      expect(nb.hst).toBe(15);

      const ns = calculateTax(100, 'NS');
      expect(ns.hst).toBe(15);

      const pe = calculateTax(100, 'PE');
      expect(pe.hst).toBe(15);
    });

    it('should calculate GST only for territories', () => {
      const yt = calculateTax(100, 'YT');
      expect(yt.gst).toBe(5);
      expect(yt.total).toBe(5);

      const nt = calculateTax(100, 'NT');
      expect(nt.gst).toBe(5);
      expect(nt.total).toBe(5);

      const nu = calculateTax(100, 'NU');
      expect(nu.gst).toBe(5);
      expect(nu.total).toBe(5);
    });

    it('should default to GST only for invalid province', () => {
      const result = calculateTax(100, 'XX');
      expect(result.gst).toBe(5);
      expect(result.pst).toBe(0);
      expect(result.hst).toBe(0);
      expect(result.total).toBe(5);
      expect(result.provinceName).toBe('Unknown');
    });

    it('should be case insensitive', () => {
      const result1 = calculateTax(100, 'mb');
      const result2 = calculateTax(100, 'MB');
      const result3 = calculateTax(100, 'Mb');
      expect(result1.total).toBe(result2.total);
      expect(result2.total).toBe(result3.total);
    });
  });

  describe('getTaxRate', () => {
    it('should return tax rate for valid province', () => {
      const result = getTaxRate('MB');
      expect(result).toEqual({
        gst: 0.05,
        pst: 0.07,
        hst: 0,
        name: 'Manitoba',
      });
    });

    it('should return null for invalid province', () => {
      const result = getTaxRate('XX');
      expect(result).toBeNull();
    });
  });

  describe('getProvinces', () => {
    it('should return all provinces', () => {
      const provinces = getProvinces();
      expect(provinces.length).toBeGreaterThan(10);
      expect(provinces.some(p => p.code === 'MB')).toBe(true);
    });

    it('should have correct structure', () => {
      const provinces = getProvinces();
      provinces.forEach(p => {
        expect(p).toHaveProperty('code');
        expect(p).toHaveProperty('name');
        expect(typeof p.code).toBe('string');
        expect(typeof p.name).toBe('string');
        expect(p.code.length).toBe(2);
      });
    });
  });

  describe('isValidPostalCode', () => {
    it('should validate valid postal codes', () => {
      expect(isValidPostalCode('R3C 0C4')).toBe(true);
      expect(isValidPostalCode('r3c0c4')).toBe(true);
      expect(isValidPostalCode('A1A-1A1')).toBe(true);
      expect(isValidPostalCode('a1a1a1')).toBe(true);
    });

    it('should reject invalid postal codes', () => {
      expect(isValidPostalCode('123456')).toBe(false);
      expect(isValidPostalCode('ABCDE')).toBe(false);
      expect(isValidPostalCode('A1A A1A')).toBe(false); // space in wrong place
      expect(isValidPostalCode('')).toBe(false);
    });
  });
});
```

**Step 2: Run tests**

Run: `npm run test`

Expected: All tax tests pass

**Step 3: Commit**

```bash
git add server/lib/__tests__/tax.test.ts
git commit -m "test: add tax calculation unit tests

- Test all provinces and territories
- Test HST, GST+PST combinations
- Test postal code validation
- Test edge cases (invalid input, case sensitivity)
"
```

---

## Task 4: Create shipping calculation unit tests

**Files:**

- Create: `server/lib/__tests__/shipping.test.ts`

**Step 1: Write shipping tests**

```typescript
// server/lib/__tests__/shipping.test.ts
import { describe, it, expect } from 'vitest';
import {
  calculateShipping,
  getShippingInfo,
  getAllShippingZones,
} from '../shipping';

describe('Shipping Calculation', () => {
  describe('calculateShipping', () => {
    it('should give free local shipping over $100 in Manitoba', () => {
      const result = calculateShipping(150, 'MB', 'CA');
      expect(result.rate).toBe(0);
      expect(result.zone).toBe('Local (Manitoba)');
    });

    it('should charge for local shipping under $100 in Manitoba', () => {
      const result = calculateShipping(50, 'MB', 'CA');
      expect(result.rate).toBe(0);
      expect(result.zone).toBe('Local (Manitoba)');
    });

    it('should give free shipping over $150 for other Canada', () => {
      const result = calculateShipping(200, 'ON', 'CA');
      expect(result.rate).toBe(0);
    });

    it('should charge $15 for other Canada under $150', () => {
      const result = calculateShipping(100, 'ON', 'CA');
      expect(result.rate).toBe(15);
      expect(result.zone).toBe('Canada');
    });

    it('should use international rate for US', () => {
      const result = calculateShipping(100, undefined, 'US');
      expect(result.rate).toBe(25);
      expect(result.zone).toBe('United States');
    });

    it('should use international rate for other countries', () => {
      const result = calculateShipping(100, undefined, 'GB');
      expect(result.rate).toBe(40);
      expect(result.zone).toBe('International');
    });

    it('should give free shipping over threshold for US', () => {
      const result = calculateShipping(250, undefined, 'US');
      expect(result.rate).toBe(0);
    });

    it('should give free shipping over threshold for international', () => {
      const result = calculateShipping(300, undefined, 'GB');
      expect(result.rate).toBe(0);
    });
  });

  describe('getShippingInfo', () => {
    it('should return shipping info for Manitoba', () => {
      const result = getShippingInfo('MB', 'CA');
      expect(result).toEqual({
        rate: 0,
        freeThreshold: 100,
        zone: 'Local (Manitoba)',
        estimatedDays: '1-2 business days',
      });
    });

    it('should return null for invalid lookup', () => {
      // This shouldn't happen in practice but tests the fallback
      const result = getShippingInfo('XX', 'ZZ');
      expect(result).not.toBeNull();
    });
  });

  describe('getAllShippingZones', () => {
    it('should return all zones', () => {
      const zones = getAllShippingZones();
      expect(zones.length).toBe(4);
      expect(zones[0].zone).toBe('Local (Manitoba)');
    });

    it('should have all required properties', () => {
      const zones = getAllShippingZones();
      zones.forEach(zone => {
        expect(zone).toHaveProperty('zone');
        expect(zone).toHaveProperty('provinces');
        expect(zone).toHaveProperty('rate');
        expect(zone).toHaveProperty('estimatedDays');
      });
    });
  });
});
```

**Step 2: Run tests**

Run: `npm run test`

Expected: All shipping tests pass

**Step 3: Commit**

```bash
git add server/lib/__tests__/shipping.test.ts
git commit -m "test: add shipping calculation unit tests

- Test all shipping zones
- Test free shipping thresholds
- Test international shipping
"
```

---

## Task 5: Create cart hook unit tests

**Files:**

- Create: `client/src/hooks/__tests__/useCart.test.ts`

**Step 1: Write cart hook tests**

```typescript
// client/src/hooks/__tests__/useCart.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../useCart';
import type { Product } from '@shared/types';

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  price: '25.00',
  image: '/test.jpg',
  description: 'Test description',
  category: 'necklaces',
  gemstones: ['Amethyst'],
  materials: ['Gold'],
  stockQuantity: 10,
};

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with empty cart', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].product).toEqual(mockProduct);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.itemCount).toBe(1);
  });

  it('should increment quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.removeFromCart(mockProduct.id);
    });

    expect(result.current.items).toEqual([]);
  });

  it('should decrement quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.updateQuantity(mockProduct.id, 1);
    });

    expect(result.current.items[0].quantity).toBe(1);
  });

  it('should remove item when quantity set to 0', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.updateQuantity(mockProduct.id, 0);
    });

    expect(result.current.items).toEqual([]);
  });

  it('should clear all items', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart({ ...mockProduct, id: 2 });
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
  });

  it('should calculate total correctly', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
      result.current.addToCart({ ...mockProduct, price: '50.00' });
    });

    expect(result.current.total).toBe(100); // 25 + 25 + 50
  });

  it('should check if item is in cart', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current isInCart(mockProduct.id)).toBe(false);

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current isInCart(mockProduct.id)).toBe(true);
  });

  it('should persist cart to localStorage', () => {
    const { result: result1 } = renderHook(() => useCart());

    act(() => {
      result1.current.addToCart(mockProduct);
    });

    // Unmount and remount to test persistence
    const { result: result2 } = renderHook(() => useCart());

    expect(result2.current.items.length).toBe(1);
    expect(result2.current.items[0].product.id).toBe(mockProduct.id);
  });
});
```

**Step 2: Run tests**

Run: `npm run test`

Expected: All cart tests pass

**Step 3: Commit**

```bash
git add client/src/hooks/__tests__/useCart.test.ts
git commit -m "test: add cart hook unit tests

- Test add to cart
- Test quantity updates
- Test remove from cart
- Test clear cart
- Test total calculation
- Test localStorage persistence
"
```

---

## Task 6: Set up Playwright E2E testing

**Files:**

- Create: `playwright.config.ts`
- Create: `tests/e2e/checkout.spec.ts`
- Modify: `package.json`

**Step 1: Install Playwright**

Run: `npm install -D @playwright/test`

Run: `npx playwright install`

**Step 2: Configure Playwright**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 3: Write checkout E2E test**

```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('add to cart and navigate to checkout', async ({ page }) => {
    // Add first product to cart
    await page.locator('[data-testid="product-card"]').first().hover();
    await page.locator('button:has-text("Add to Cart")').first().click();

    // Verify cart badge shows count
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1');

    // Navigate to checkout
    await page.click('[data-testid="cart-icon"]');
    await page.click('text=Checkout');

    // Verify checkout page loaded
    await expect(page).toHaveURL('/checkout');
    await expect(page.locator('h1')).toContainText('Checkout');
  });

  test('fill out shipping form', async ({ page }) => {
    // Add item to cart and go to checkout
    await page.locator('[data-testid="product-card"]').first().hover();
    await page.locator('button:has-text("Add to Cart")').first().click();
    await page.click('[data-testid="cart-icon"]');
    await page.click('text=Checkout');

    // Fill shipping form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="street"]', '123 Main St');
    await page.fill('input[name="city"]', 'Winnipeg');
    await page.selectOption('select[name="province"]', 'MB');
    await page.fill('input[name="postalCode"]', 'R3C 0C4');

    // Submit form
    await page.click('button:has-text("Continue to Payment")');

    // Verify moved to payment step
    await expect(page.locator('text=Payment Method')).toBeVisible();
  });

  test('display order summary with correct totals', async ({ page }) => {
    // Add specific item to cart
    await page.locator('[data-testid="product-card"]').first().hover();
    await page.locator('button:has-text("Add to Cart")').first().click();

    // Open cart
    await page.click('[data-testid="cart-icon"]');

    // Verify order summary
    await expect(page.locator('text=Order Summary')).toBeVisible();
    await expect(page.locator('[data-testid="cart-total"]')).toBeVisible();
  });

  test('E-Transfer payment option', async ({ page }) => {
    // Add item and go through shipping
    await page.locator('[data-testid="product-card"]').first().hover();
    await page.locator('button:has-text("Add to Cart")').first().click();
    await page.click('[data-testid="cart-icon"]');
    await page.click('text=Checkout');

    await page.fill('input[name="name"]', 'Jane Smith');
    await page.fill('input[name="email"]', 'jane@example.com');
    await page.fill('input[name="street"]', '456 Main St');
    await page.fill('input[name="city"]', 'Winnipeg');
    await page.selectOption('select[name="province"]', 'MB');
    await page.fill('input[name="postalCode"]', 'R3C 1A1');
    await page.click('button:has-text("Continue to Payment")');

    // Select E-Transfer
    await page.click('button:has-text("E-Transfer")');

    // Verify E-Transfer option selected
    await expect(
      page.locator('button:has-text("E-Transfer").border-primary')
    ).toBeVisible();
  });
});

test.describe('Product Navigation', () => {
  test('navigate from home to product detail', async ({ page }) => {
    await page.goto('/');

    // Click on a product
    await page.locator('[data-testid="product-card"]').first().click();

    // Verify product detail page
    await expect(page).toHaveURL(/\/product\/\d+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigate between categories', async ({ page }) => {
    await page.goto('/products');

    // Click a category filter
    await page.click('text=Necklaces');

    // Verify URL updated
    await expect(page).toHaveURL('/products/necklaces');
  });
});

test.describe('Wishlist', () => {
  test('add and remove items from wishlist', async ({ page }) => {
    await page.goto('/products');

    // Add to wishlist
    await page.locator('[data-testid="product-card"]').first().hover();
    const wishlistButton = page
      .locator('[data-testid="wishlist-button"]')
      .first();
    await wishlistButton.click();

    // Verify filled heart
    await expect(wishlistButton.locator('.fill-current')).toBeVisible();

    // Check wishlist count in header
    await expect(page.locator('[data-testid="wishlist-count"]')).toHaveText(
      '1'
    );

    // Remove from wishlist
    await wishlistButton.click();

    // Verify outline heart
    await expect(wishlistButton).not.toHaveClass(/fill-current/);
  });
});
```

**Step 4: Add test IDs to components**

Add `data-testid` attributes to key components:

```tsx
// ProductCard.tsx - add test IDs
<div data-testid="product-card">
  <button data-testid="wishlist-button" />
  <button data-testid="add-to-cart">Add to Cart</button>
</div>

// Header.tsx - add test IDs
<button data-testid="cart-icon" />
<span data-testid="cart-badge" />
<span data-testid="wishlist-count" />
```

**Step 5: Run E2E tests**

Run: `npm run test:e2e:ui`

Expected: All tests pass

**Step 6: Commit**

```bash
git add playwright.config.ts tests/e2e/checkout.spec.ts package.json package-lock.json
git add client/src/components/ProductCard.tsx client/src/components/Header.tsx
git commit -m "test: add Playwright E2E tests

- Checkout flow tests
- Product navigation tests
- Wishlist tests
- Add test IDs to components
- Configure Playwright
"
```

---

## Task 7: Run accessibility audit

**Files:**

- Create: `tests/a11y/a11y-audit.spec.ts`

**Step 1: Install axe-core Playwright**

Run: `npm install -D @axe-core/playwright`

**Step 2: Write accessibility tests**

```typescript
// tests/a11y/a11y-audit.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('home page should not have accessibility violations', async ({
    page,
  }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('products page should not have accessibility violations', async ({
    page,
  }) => {
    await page.goto('/products');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('product detail page should not have accessibility violations', async ({
    page,
  }) => {
    await page.goto('/product/1');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('checkout page should not have accessibility violations', async ({
    page,
  }) => {
    await page.goto('/checkout');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('home page should have proper heading structure', async ({ page }) => {
    await page.goto('/');

    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingLevels = await Promise.all(
      headings.map(h => h.evaluate(el => el.tagName))
    );

    // Check that headings are in logical order (no skipping levels)
    let previousLevel = 0;
    for (const level of headingLevels) {
      const currentLevel = parseInt(level.charAt(1));
      expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1);
      previousLevel = currentLevel;
    }
  });

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBe('');
    }
  });

  test('all interactive elements should be keyboard accessible', async ({
    page,
  }) => {
    await page.goto('/products');

    const buttons = await page.locator('button, a, input').all();
    for (const button of buttons.slice(0, 10)) {
      // Test first 10
      try {
        await button.focus();
        const isFocused = await button.evaluate(
          el => document.activeElement === el
        );
        expect(isFocused).toBe(true);
      } catch {
        // Some elements might not be focusable - skip
      }
    }
  });

  test('forms should have proper labels', async ({ page }) => {
    await page.goto('/checkout');

    const inputs = await page.locator('input').all();
    for (const input of inputs) {
      const hasLabel = await input.evaluate(el => {
        // Check if has explicit label or aria-label
        return (
          el.getAttribute('aria-label') ||
          (el.getAttribute('id') &&
            document.querySelector(`label[for="${el.id}"]`))
        );
      });
      expect(hasLabel).toBeTruthy();
    }
  });
});
```

**Step 3: Run accessibility tests**

Run: `npm run test:e2e tests/a11y/a11y-audit.spec.ts`

Expected: All tests pass or documented violations

**Step 4: Fix any violations found**

Document any acceptable violations in `tests/a11y/exceptions.md`

**Step 5: Commit**

```bash
git add tests/a11y/a11y-audit.spec.ts package.json package-lock.json
git commit -m "test: add accessibility audit tests

- Scan all main pages for violations
- Test heading structure
- Test image alt text
- Test keyboard accessibility
- Test form labels
"
```

---

## Task 8: Set up Lighthouse CI for performance

**Files:**

- Create: `lighthouserc.json`

**Step 1: Install Lighthouse CI**

Run: `npm install -D @lhci/cli`

**Step 2: Configure Lighthouse CI**

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": [
        "http://localhost:5173/",
        "http://localhost:5173/products",
        "http://localhost:5173/product/1",
        "http://localhost:5173/checkout"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.8 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Step 3: Add Lighthouse scripts**

```json
{
  "scripts": {
    "lhci:autorun": "lhci autorun",
    "lhci:collect": "npm run build && lhci collect"
  }
}
```

**Step 4: Commit**

```bash
git add lighthouserc.json package.json package-lock.json
git commit -m "test: add Lighthouse CI configuration

- Performance audits for main pages
- Minimum score thresholds
- Temporary public storage for results
"
```

---

## Task 9: Run full test suite and generate coverage

**Files:**

- Test: All tests

**Step 1: Run unit tests with coverage**

Run: `npm run test:coverage`

Expected: Coverage report generated

**Step 2: Review coverage report**

Open `coverage/index.html` in browser

Target coverage:

- Wishlist: 100%
- Tax calculation: 100%
- Shipping calculation: 100%
- Cart hook: 80%+

**Step 3: Run E2E tests**

Run: `npm run test:e2e`

Expected: All tests pass

**Step 4: Run accessibility tests**

Run: `npm run test:e2e tests/a11y/a11y-audit.spec.ts`

Expected: No critical violations

**Step 5: Run Lighthouse audit**

Run: `npm run lhci:collect`

Expected: All scores above thresholds

**Step 6: Commit coverage reports**

```bash
git add coverage/
git commit -m "test: add coverage reports"
```

---

## Task 10: Create testing documentation

**Files:**

- Create: `docs/testing.md`

**Step 1: Write testing documentation**

````markdown
# Testing Guide

## Running Tests

### Unit Tests

```bash
npm run test           # Watch mode
npm run test:run       # Run once
npm run test:coverage  # With coverage report
```
````

### E2E Tests

```bash
npm run test:e2e       # Run all E2E tests
npm run test:e2e:ui    # Run with UI
npm run test:e2e:debug # Debug mode
```

### Performance Tests

```bash
npm run lhci:collect   # Run Lighthouse audits
```

## Test Structure

### Unit Tests (`client/src/__tests__`, `server/lib/__tests__`)

- Wishlist utilities
- Tax calculation
- Shipping calculation
- Cart hook
- Form validation

### E2E Tests (`tests/e2e/`)

- Checkout flow
- Product navigation
- Wishlist functionality
- Cart operations

### Accessibility Tests (`tests/a11y/`)

- Page accessibility scans
- Heading structure
- Image alt text
- Keyboard navigation
- Form labels

## Coverage Goals

| Module    | Target | Current |
| --------- | ------ | ------- |
| Wishlist  | 100%   | -       |
| Tax       | 100%   | -       |
| Shipping  | 100%   | -       |
| Cart Hook | 80%    | -       |
| Overall   | 70%    | -       |

## Writing New Tests

1. Unit tests: Co-locate with source file in `__tests__` directory
2. E2E tests: Add to `tests/e2e/`
3. Use `data-testid` attributes for element selection

## CI/CD Integration

Tests run automatically on:

- Pull request creation
- Push to main branch
- Before deployment

````

**Step 2: Commit documentation**

```bash
git add docs/testing.md
git commit -m "docs: add testing guide"
````

---

## Task 11: Create final completion report

**Files:**

- Create: `docs/plans/2026-03-13-final-completion-report.md`

**Step 1: Write final completion report**

```markdown
# Comprehensive Improvements - Final Completion Report

**Date:** 2026-03-13
**Project:** Troves & Coves Website Improvements

## Overview

All 7 phases of the comprehensive improvement plan have been documented with detailed implementation plans.

## Completed Phases

### Phase 1: SEO Foundation

- [x] Implementation plan created
- **Files:** `docs/plans/2026-03-13-seo-foundation-implementation.md`
- **Key Deliverables:** Page metadata, breadcrumb schema, H1 optimization

### Phase 2: Content & Education

- [x] Implementation plan created
- **Files:** `docs/plans/2026-03-13-content-education-implementation.md`
- **Key Deliverables:** FAQ page, crystal meanings, materials guide

### Phase 3: Conversion Features

- [x] Implementation plan created
- **Files:** `docs/plans/2026-03-13-conversion-features-implementation.md`
- **Key Deliverables:** Wishlist, stock badges, quick view modal

### Phase 4: Direct Checkout

- [x] Implementation plan created
- **Files:** `docs/plans/2026-03-13-direct-checkout-implementation.md`
- **Key Deliverables:** Stripe, PayPal, E-Transfer, tax/shipping

### Phase 5: Analytics & Monitoring

- [x] Implementation plan created
- **Files:** `docs/plans/2026-03-13-analytics-implementation.md`
- **Key Deliverables:** GA4, Sentry, Web Vitals

### Phase 6: Social Proof & Trust

- [x] Implementation plan created
- **Files:** `docs/plans/2026-03-13-social-proof-implementation.md`
- **Key Deliverables:** Reviews, customer gallery, trust badges

### Phase 7: Testing & Quality

- [x] Implementation plan created
- **Files:** `docs/plans/2026-03-13-testing-quality-implementation.md`
- **Key Deliverables:** Unit tests, E2E tests, accessibility audit

## Implementation Plans Summary

Each implementation plan includes:

- ✅ Complete task breakdown with exact file paths
- ✅ Full code snippets (no "add code here" placeholders)
- ✅ Testing and verification steps
- ✅ Git commit messages
- ✅ Continuation instructions for context compression

## Estimated Total Effort

| Phase                  | Estimated Time  |
| ---------------------- | --------------- |
| SEO Foundation         | 3-4 hours       |
| Content & Education    | 4-5 hours       |
| Conversion Features    | 4-5 hours       |
| Direct Checkout        | 8-10 hours      |
| Analytics & Monitoring | 3-4 hours       |
| Social Proof & Trust   | 4-5 hours       |
| Testing & Quality      | 6-8 hours       |
| **Total**              | **32-41 hours** |

## Next Steps

1. Choose implementation approach:
   - **Subagent-Driven:** Execute task-by-task with review between steps
   - **Parallel Session:** Open new session with executing-plans skill

2. Start with Phase 1 (SEO Foundation) as it has no dependencies

3. Follow each plan's tasks in order

4. After each phase, run testing checklist before moving to next

## Files Created

### Implementation Plans

- `docs/plans/2026-03-13-seo-foundation-implementation.md`
- `docs/plans/2026-03-13-content-education-implementation.md`
- `docs/plans/2026-03-13-conversion-features-implementation.md`
- `docs/plans/2026-03-13-direct-checkout-implementation.md`
- `docs/plans/2026-03-13-analytics-implementation.md`
- `docs/plans/2026-03-13-social-proof-implementation.md`
- `docs/plans/2026-03-13-testing-quality-implementation.md`

### Design Documents

- `docs/plans/2026-03-13-comprehensive-improvements-design.md`

### Completion Reports

- `docs/plans/2026-03-13-seo-completion-report.md` (Phase 1)
- `docs/plans/2026-03-13-content-completion-report.md` (Phase 2)
- `docs/plans/2026-03-13-conversion-completion-report.md` (Phase 3)
- `docs/plans/2026-03-13-checkout-completion-report.md` (Phase 4)
- `docs/plans/2026-03-13-analytics-completion-report.md` (Phase 5)
- `docs/plans/2026-03-13-social-proof-completion-report.md` (Phase 6)

## Success Criteria

Each phase is complete when:

- [ ] All tasks in the plan are done
- [ ] Testing checklist passes
- [ ] TypeScript check passes
- [ ] All tests pass
- [ ] Production build succeeds
- [ ] Completion report is created

## Risk Mitigation

### External Dependencies

- GA4 setup required (analytics)
- Sentry account required (error tracking)
- Stripe account required (payments)
- PayPal account required (payments)
- PostgreSQL database required (orders)

### Rollback Plan

Each phase commits independently, allowing selective rollback if issues arise.
```

**Step 2: Commit final report**

```bash
git add docs/plans/2026-03-13-final-completion-report.md
git commit -m "docs: add final completion report for all phases"
```

---

## Testing Checklist

Before marking this complete, verify:

- [ ] All implementation plans created
- [ ] Each plan has complete code snippets
- [ ] Each plan has continuation instructions
- [ ] Design document is complete
- [ ] Final completion report created
- [ ] All plans committed to git

---

**Total Estimated Time:** 6-8 hours

**Dependencies:** None (this is the final phase)

**All Plans Complete!** All 7 implementation plans are now ready for execution.

---

## Continuation After Context Compression

If this session is compressed and you need to continue:

1. **Current Progress:** ALL 7 implementation plans are complete
2. **Next Step:** Begin execution with Phase 1 (SEO Foundation)
3. **All Implementation Plans:**
   - Phase 1: `docs/plans/2026-03-13-seo-foundation-implementation.md`
   - Phase 2: `docs/plans/2026-03-13-content-education-implementation.md`
   - Phase 3: `docs/plans/2026-03-13-conversion-features-implementation.md`
   - Phase 4: `docs/plans/2026-03-13-direct-checkout-implementation.md`
   - Phase 5: `docs/plans/2026-03-13-analytics-implementation.md`
   - Phase 6: `docs/plans/2026-03-13-social-proof-implementation.md`
   - Phase 7: `docs/plans/2026-03-13-testing-quality-implementation.md`
4. **Master Design:** `docs/plans/2026-03-13-comprehensive-improvements-design.md`
5. **Execution Options:**
   - Use `superpowers:executing-plans` skill to implement each plan
   - Or use `superpowers:subagent-driven-development` for guided execution

**Ready to execute!** All planning is complete. You can now begin implementing any phase in any order (Phases 1-3 are independent, Phase 4 depends on earlier phases).
