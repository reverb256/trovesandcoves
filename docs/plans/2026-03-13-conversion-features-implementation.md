# Conversion Features Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add conversion-boosting features - wishlist functionality, stock urgency badges, and product quick view modal.

**Architecture:** LocalStorage-based wishlist (no account required initially), display existing stock data with visual badges, modal component for quick product preview without leaving browse flow.

**Tech Stack:** React hooks (useLocalStorage, useMemo), shadcn/ui Dialog component, TypeScript

---

## Task 1: Create wishlist storage utilities

**Files:**

- Create: `client/src/lib/wishlist.ts`

**Step 1: Write the wishlist storage utility**

```typescript
// client/src/lib/wishlist.ts

const WISHLIST_STORAGE_KEY = 'trovesandcoves_wishlist';

export interface WishlistStorage {
  items: number[]; // product IDs
  updatedAt: string;
}

/**
 * Get all wishlist items from localStorage
 */
export function getWishlistItems(): number[] {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!stored) return [];
    const data: WishlistStorage = JSON.parse(stored);
    return data.items || [];
  } catch {
    return [];
  }
}

/**
 * Save wishlist items to localStorage
 */
function saveWishlistItems(items: number[]): void {
  const data: WishlistStorage = {
    items,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Add a product to wishlist
 */
export function addWishlistItem(productId: number): void {
  const items = getWishlistItems();
  if (!items.includes(productId)) {
    items.push(productId);
    saveWishlistItems(items);
  }
}

/**
 * Remove a product from wishlist
 */
export function removeWishlistItem(productId: number): void {
  const items = getWishlistItems();
  const filtered = items.filter(id => id !== productId);
  saveWishlistItems(filtered);
}

/**
 * Toggle a product in wishlist (add if not present, remove if present)
 */
export function toggleWishlistItem(productId: number): boolean {
  const items = getWishlistItems();
  const exists = items.includes(productId);

  if (exists) {
    removeWishlistItem(productId);
    return false;
  } else {
    addWishlistItem(productId);
    return true;
  }
}

/**
 * Check if a product is in wishlist
 */
export function isInWishlist(productId: number): boolean {
  return getWishlistItems().includes(productId);
}

/**
 * Get count of items in wishlist
 */
export function getWishlistCount(): number {
  return getWishlistItems().length;
}

/**
 * Clear all wishlist items
 */
export function clearWishlist(): void {
  localStorage.removeItem(WISHLIST_STORAGE_KEY);
}
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors (new file with no dependencies yet)

---

## Task 2: Create WishlistButton component

**Files:**

- Create: `client/src/components/products/WishlistButton.tsx`

**Step 1: Write the WishlistButton component**

```tsx
// client/src/components/products/WishlistButton.tsx
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { isInWishlist, toggleWishlistItem } from '@/lib/wishlist';

interface WishlistButtonProps {
  productId: number;
  productName?: string;
  className?: string;
  showLabel?: boolean;
  onToggle?: (isNowWishlisted: boolean) => void;
}

export function WishlistButton({
  productId,
  productName,
  className = '',
  showLabel = false,
  onToggle,
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check initial state and sync across tabs
  useEffect(() => {
    setIsWishlisted(isInWishlist(productId));

    const handleStorageChange = () => {
      setIsWishlisted(isInWishlist(productId));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [productId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = toggleWishlistItem(productId);
    setIsWishlisted(newState);
    onToggle?.(newState);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 transition-all duration-200 ${className} ${
        isWishlisted
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-400'
      }`}
      aria-label={
        isWishlisted
          ? `Remove ${productName || 'item'} from wishlist`
          : `Add ${productName || 'item'} to wishlist`
      }
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={isWishlisted ? 'fill-current' : ''}
        size={showLabel ? 18 : 20}
      />
      {showLabel && (
        <span className="text-sm">{isWishlisted ? 'Saved' : 'Save'}</span>
      )}
    </button>
  );
}
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add client/src/lib/wishlist.ts client/src/components/products/WishlistButton.tsx
git commit -m "feat: add wishlist functionality

- Add LocalStorage-based wishlist utilities
- Create WishlistButton component with heart icon
- Sync across tabs using storage events
- No account required initially
"
```

---

## Task 3: Add WishlistButton to ProductCard

**Files:**

- Modify: `client/src/components/ProductCard.tsx`

**Step 1: Read current ProductCard structure**

Run: `cat client/src/components/ProductCard.tsx`

Note the current component structure and where add to cart button is

**Step 2: Add WishlistButton import and usage**

Add import at top:

```tsx
import { WishlistButton } from './products/WishlistButton';
```

Add the button in the card actions area (after the Add to Cart button or in the card footer):

```tsx
<WishlistButton
  productId={product.id}
  productName={product.name}
  className="p-2 hover:bg-surface-100 rounded-full"
/>
```

**Step 3: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 4: Commit**

```bash
git add client/src/components/ProductCard.tsx
git commit -m "feat: add wishlist button to product cards"
```

---

## Task 4: Add WishlistButton to ProductDetail page

**Files:**

- Modify: `client/src/pages/ProductDetail.tsx`

**Step 1: Add WishlistButton to product detail**

Add import:

```tsx
import { WishlistButton } from '@/components/products/WishlistButton';
```

Add button near the Add to Cart section (after quantity selector):

```tsx
<div className="flex items-center gap-4 mt-4">
  <WishlistButton
    productId={product.id}
    productName={product.name}
    showLabel={true}
    className="text-lg px-4 py-2 border border-border-200 rounded-lg hover:border-red-300"
  />
</div>
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add client/src/pages/ProductDetail.tsx
git commit -m "feat: add wishlist button to product detail page"
```

---

## Task 5: Add wishlist icon to header with count

**Files:**

- Modify: `client/src/components/Header.tsx` (or similar header component)

**Step 1: Find header component**

Run: `find client/src/components -name "*[Hh]eader*" -o -name "*[Nn]av*"`

Read the file to understand current structure

**Step 2: Add wishlist state and button**

Add state in header component:

```tsx
const [wishlistCount, setWishlistCount] = useState(0);

useEffect(() => {
  const updateCount = () => {
    setWishlistCount(getWishlistCount());
  };

  updateCount();

  const handleStorageChange = () => {
    updateCount();
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

Add wishlist icon button (near cart icon):

```tsx
<Link to="/wishlist" className="relative p-2 hover:bg-surface-100 rounded-full">
  <Heart
    className={wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}
    size={24}
  />
  {wishlistCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-primary text-primary-on text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {wishlistCount > 9 ? '9+' : wishlistCount}
    </span>
  </Link>
</Link>
```

**Step 3: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 4: Commit**

```bash
git add client/src/components/Header.tsx
git commit -m "feat: add wishlist icon to header with item count"
```

---

## Task 6: Create StockBadge component

**Files:**

- Create: `client/src/components/products/StockBadge.tsx`

**Step 1: Write the StockBadge component**

```tsx
// client/src/components/products/StockBadge.tsx

interface StockBadgeProps {
  quantity: number;
  className?: string;
}

export function StockBadge({ quantity, className = '' }: StockBadgeProps) {
  if (quantity <= 0) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-gray-400" />
        Out of Stock
      </span>
    );
  }

  if (quantity <= 3) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-700 ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        Only {quantity} left!
      </span>
    );
  }

  // For higher quantities, don't show badge or show subtle "in stock"
  if (quantity <= 10) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-green-500" />
        In Stock
      </span>
    );
  }

  // Don't show anything for high stock (FOMO effect)
  return null;
}
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add client/src/components/products/StockBadge.tsx
git commit -m "feat: add StockBadge component

- Shows 'Out of Stock' for 0 quantity
- Shows urgency badge 'Only X left!' for low stock (1-3)
- Shows 'In Stock' for medium stock (4-10)
- Hides badge for high stock (>10) for FOMO effect
- Animated pulse on urgency badges
"
```

---

## Task 7: Add StockBadge to ProductCard

**Files:**

- Modify: `client/src/components/ProductCard.tsx`

**Step 1: Add StockBadge to product card**

Add import:

```tsx
import { StockBadge } from './products/StockBadge';
```

Add badge in the card content area (near price or title):

```tsx
<div className="p-4">
  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
  <p className="text-lg font-bold mb-2">${product.price}</p>
  <StockBadge quantity={product.stockQuantity} className="mb-3" />
  {/* rest of card content */}
</div>
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add client/src/components/ProductCard.tsx
git commit -m "feat: add stock badge to product cards"
```

---

## Task 8: Add StockBadge to ProductDetail page

**Files:**

- Modify: `client/src/pages/ProductDetail.tsx`

**Step 1: Add StockBadge to product detail**

Add import:

```tsx
import { StockBadge } from '@/components/products/StockBadge';
```

Add badge near the price/availability section:

```tsx
<div className="mb-6">
  <StockBadge quantity={product.stockQuantity} />
</div>
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add client/src/pages/ProductDetail.tsx
git commit -m "feat: add stock badge to product detail page"
```

---

## Task 9: Create QuickViewModal component

**Files:**

- Create: `client/src/components/products/QuickViewModal.tsx`

**Step 1: Write the QuickViewModal component**

```tsx
// client/src/components/products/QuickViewModal.tsx
import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Product } from '@shared/types';
import { useCart } from '@/hooks/useCart';
import { WishlistButton } from './WishlistButton';
import { StockBadge } from './StockBadge';

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function QuickViewModal({
  product,
  open,
  onClose,
}: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  const handleIncrement = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(q => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-surface-100 rounded-full"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <DialogTitle className="sr-only">
          Quick View - {product.name}
        </DialogTitle>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-surface-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

            <p className="text-3xl font-bold mb-4">${product.price}</p>

            <StockBadge quantity={product.stockQuantity} className="mb-4" />

            {/* Gemstones */}
            {product.gemstones && product.gemstones.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-on-surface-variant mb-2">
                  Gemstones
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.gemstones.map((gem, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-surface-100 rounded-full text-sm"
                    >
                      {gem}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Materials */}
            {product.materials && product.materials.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-on-surface-variant mb-2">
                  Materials
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-surface-100 rounded-full text-sm"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-on-surface-variant mb-6 line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Actions */}
            <div className="mt-auto space-y-4">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-surface-100 disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stockQuantity}
                    className="p-2 hover:bg-surface-100 disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="w-full"
                size="lg"
              >
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              {/* Wishlist */}
              <div className="flex justify-center">
                <WishlistButton
                  productId={product.id}
                  productName={product.name}
                  showLabel={true}
                />
              </div>

              {/* Full Details Link */}
              <a
                href={`/product/${product.id}`}
                onClick={e => {
                  e.preventDefault();
                  onClose();
                  window.location.href = `/product/${product.id}`;
                }}
                className="text-center text-sm text-primary hover:underline"
              >
                View Full Details →
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add client/src/components/products/QuickViewModal.tsx
git commit -m "feat: add QuickViewModal component

- Modal for quick product preview without leaving page
- Shows image, price, gemstones, materials
- Includes quantity selector and add to cart
- Links to full product details
- Integrates WishlistButton and StockBadge
"
```

---

## Task 10: Add quick view to ProductCard

**Files:**

- Modify: `client/src/components/ProductCard.tsx`

**Step 1: Add quick view button and state**

Add state:

```tsx
const [showQuickView, setShowQuickView] = useState(false);
```

Add QuickViewModal import:

```tsx
import { QuickViewModal } from './products/QuickViewModal';
```

Add quick view button (in card actions):

```tsx
<button
  onClick={e => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  }}
  className="px-4 py-2 text-sm border border-border-200 rounded-lg hover:bg-surface-50"
>
  Quick View
</button>
```

Add modal at end of component:

```tsx
<QuickViewModal
  product={product}
  open={showQuickView}
  onClose={() => setShowQuickView(false)}
/>
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add client/src/components/ProductCard.tsx
git commit -m "feat: add quick view button to product cards"
```

---

## Task 11: Create dedicated Wishlist page

**Files:**

- Create: `client/src/pages/Wishlist.tsx`
- Modify: `client/src/App.tsx`

**Step 1: Write the Wishlist page**

```tsx
// client/src/pages/Wishlist.tsx
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Trash2, ShoppingBag } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { getWishlistItems, clearWishlist } from '@/lib/wishlist';
import type { Product } from '@shared/types';
import { SEOHead } from '@/components/SEOHead';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Wishlist', path: '/wishlist' },
];

export function Wishlist() {
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      try {
        const wishlistIds = getWishlistItems();
        if (wishlistIds.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // Fetch products from API
        const response = await fetch('/api/products');
        const allProducts: Product[] = await response.json();
        const wishlisted = allProducts.filter(p => wishlistIds.includes(p.id));
        setProducts(wishlisted);
      } catch (error) {
        console.error('Failed to load wishlist:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadWishlistProducts();
  }, []);

  const handleClearAll = () => {
    if (confirm('Remove all items from your wishlist?')) {
      clearWishlist();
      setProducts([]);
    }
  };

  return (
    <>
      <SEOHead
        title="My Wishlist | Saved Crystal Jewelry | Troves & Coves"
        description="View your saved handcrafted crystal jewelry pieces. Manage your wishlist and find your perfect piece."
        path="/wishlist"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
          <p className="text-on-surface-variant">
            {products.length} {products.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-on-surface-variant">Loading your wishlist...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag
              className="mx-auto mb-4 text-on-surface-variant"
              size={48}
            />
            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-on-surface-variant mb-6">
              Save your favorite pieces by clicking the heart icon
            </p>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} className="mr-2" />
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
```

**Step 2: Add route to App.tsx**

Add import:

```tsx
import { Wishlist } from '@/pages/Wishlist';
```

Add route:

```tsx
<Route path="/wishlist" component={Wishlist} />
```

**Step 3: Add page metadata**

Update `client/src/lib/pageMetadata.ts` (created in Phase 1):

Add to pageMetadata object:

```tsx
'/wishlist': {
  title: 'My Wishlist | Saved Crystal Jewelry | Troves & Coves',
  description: 'View your saved handcrafted crystal jewelry pieces. Manage your wishlist and find your perfect piece.',
  keywords: 'wishlist, saved items, favorites',
},
```

**Step 4: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 5: Commit**

```bash
git add client/src/pages/Wishlist.tsx client/src/App.tsx client/src/lib/pageMetadata.ts
git commit -m "feat: add dedicated wishlist page

- Page to view all saved items
- Clear all functionality
- Empty state with CTA to browse products
- Breadcrumb schema included
"
```

---

## Task 12: Add to page metadata for new pages

**Files:**

- Modify: `client/src/lib/pageMetadata.ts`

**Step 1: Ensure wishlist page metadata is included**

The wishlist metadata was added in the previous task. Verify it exists.

**Step 2: Commit if needed**

If metadata was missing, commit the addition.

---

## Task 13: Test and verify all conversion features

**Files:**

- Test: Manual verification

**Step 1: Test wishlist functionality**

Run: `npm run dev`

Test:

1. Click heart icon on a product card
2. Verify it fills with red color
3. Check header icon shows count of 1
4. Navigate to different page and back - verify wishlist persists
5. Go to wishlist page - verify product appears
6. Click heart again to remove - verify it un-fills
7. Test clear all on wishlist page

**Step 2: Test stock badges**

Test:

1. Find a product with low stock (1-3) - verify "Only X left!" badge with pulse animation
2. Find a product with medium stock (4-10) - verify "In Stock" badge
3. Find a product with high stock (>10) - verify no badge shown
4. Find an out of stock product - verify "Out of Stock" badge

**Step 3: Test quick view modal**

Test:

1. Click "Quick View" button on product card
2. Verify modal opens with product details
3. Verify quantity selector works
4. Verify add to cart works
5. Verify wishlist toggle works
6. Verify "View Full Details" link navigates to product page
7. Verify close button (X) closes modal
8. Verify clicking outside modal closes it

**Step 4: Run type check**

Run: `npm run check`

Expected: No errors

**Step 5: Run tests**

Run: `npm run test`

Expected: All tests pass

**Step 6: Build production**

Run: `npm run build`

Expected: Build succeeds

---

## Task 14: Create completion report

**Files:**

- Create: `docs/plans/2026-03-13-conversion-completion-report.md`

**Step 1: Write completion report**

```markdown
# Conversion Features Completion Report

**Date:** 2026-03-13
**Phase:** Conversion Features (Phase 3)

## Completed Tasks

### 1. Wishlist Functionality

- [x] Created LocalStorage-based wishlist utilities
- [x] Built WishlistButton component with heart icon
- [x] Added wishlist to ProductCard
- [x] Added wishlist to ProductDetail page
- [x] Added wishlist icon to header with count badge
- [x] Created dedicated Wishlist page

### 2. Stock Badges

- [x] Created StockBadge component with urgency indicators
- [x] Added to ProductCard
- [x] Added to ProductDetail page
- [x] Implements FOMO psychology (hides high stock)

### 3. Quick View Modal

- [x] Created QuickViewModal component
- [x] Added quick view button to ProductCard
- [x] Modal shows all key product info
- [x] Includes add to cart and wishlist actions

## Results

### Before

- No wishlist functionality
- No stock visibility
- Users must navigate away to view product details

### After

- Full wishlist with cross-tab sync
- Urgency-driven stock badges
- Quick preview without losing browse context

## Expected Impact

- 10-15% increase in add-to-cart rate from wishlisted items
- Reduced bounce rate from quick view feature
- Increased urgency from stock badges on low-stock items
```

**Step 2: Commit report**

```bash
git add docs/plans/2026-03-13-conversion-completion-report.md
git commit -m "docs: add conversion features completion report"
```

---

## Testing Checklist

Before marking this complete, verify:

- [ ] Wishlist persists across page refreshes
- [ ] Wishlist syncs across multiple tabs
- [ ] Header icon shows correct count
- [ ] Stock badges show correct urgency levels
- [ ] Quick view modal opens and closes properly
- [ ] Add to cart works from quick view
- [ ] All tests pass: `npm run test`
- [ ] TypeScript check passes: `npm run check`
- [ ] Linting passes: `npm run lint`
- [ ] Production build succeeds: `npm run build`

---

**Total Estimated Time:** 4-5 hours

**Dependencies:**

- Phase 1 (SEO Foundation) - for page metadata pattern

**Next Phase:** Phase 4 - Direct Checkout (requires this wishlist for potential "save for later" in cart)

---

## Continuation After Context Compression

If this session is compressed and you need to continue:

1. **Current Progress:** You completed Phase 3 (Conversion Features)
2. **Next Step:** Implement Phase 4 (Direct Checkout)
3. **Key Files Created:**
   - `client/src/lib/wishlist.ts` - Wishlist storage
   - `client/src/components/products/WishlistButton.tsx`
   - `client/src/components/products/StockBadge.tsx`
   - `client/src/components/products/QuickViewModal.tsx`
   - `client/src/pages/Wishlist.tsx`
4. **Design Reference:** `docs/plans/2026-03-13-comprehensive-improvements-design.md` - Phase 4 section

Continue to Phase 4 implementation plan at `docs/plans/2026-03-13-direct-checkout-implementation.md`
