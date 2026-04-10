# Premium Product Experience Documentation

## Overview

The Troves & Coves website features a premium, Vellees-inspired product experience designed to showcase handcrafted crystal jewelry with elegance and intention. This document describes the premium features, their implementation, and how to use them.

## Design Philosophy

Inspired by [Vellees.com](https://vellees.com), the premium experience emphasizes:

- **Large, dominant product photography** that makes jewelry the star
- **Excellent whitespace** for a calm, premium feel
- **Short, emotional benefits/intentions** sections with subtle icons
- **Layered storytelling**: crystal properties → materials → brand story
- **Spacious, minimalist layout** with clear visual hierarchy
- **Sophisticated yet warm** spiritual vibe

## Features

### 1. Hero Product Images

**Location:** `client/src/pages/ProductDetail.tsx`

Large, immersive product images (1000x1000px) with zoom cursor interaction.

```tsx
<div className="product-hero-image product-zoom-trigger shadow-lg">
  <WebPImage
    src={images[selectedImage]}
    alt={product.name}
    width={1000}
    height={1000}
    className="w-full h-full"
  />
</div>
```

**Dark Mode Mystical Glow:**
In dark mode, product images glow with turquoise and gold aura for a mystical cove feel.

```css
[data-theme='dark'] .product-hero-image {
  box-shadow:
    0 0 60px hsla(var(--skull-turquoise-glow), 0.12),
    0 0 100px hsla(var(--frame-gold), 0.06),
    inset 0 0 60px hsla(var(--skull-turquoise), 0.03);
}
```

### 2. Benefits / Intentions Section

**Location:** `client/src/pages/ProductDetail.tsx`

Three elegant cards highlighting key product benefits:

```tsx
<div className="benefits-section">
  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
    <div className="benefit-item">
      <div className="benefit-icon">
        <Sparkles className="w-6 h-6" />
      </div>
      <h4 className="benefit-title">Intention</h4>
      <p className="benefit-description">
        Crafted with purpose and positive energy
      </p>
    </div>
    {/* ... more benefits */}
  </div>
</div>
```

**Available Icons:**

- `Sparkles` - Intention/Purpose
- `Gem` - Natural/Crystals
- `Shield` - Warranty/Protection
- `Truck` - Shipping
- `Heart` - Love/Care

### 3. Crystal Energy Properties

**Location:** `client/src/pages/ProductDetail.tsx`

Auto-generated crystal properties based on gemstones:

```tsx
const getCrystalProperties = (gemstones: string[] | null | undefined) => {
  if (!gemstones || gemstones.length === 0) return [];

  const properties: { title: string; description: string; icon: string }[] = [];

  gemstones.forEach(stone => {
    const lowerStone = stone.toLowerCase();
    if (lowerStone.includes('moonstone')) {
      properties.push(
        {
          title: 'Intuition',
          description: 'Moonstone enhances inner wisdom and emotional balance',
          icon: '🌙',
        },
        {
          title: 'New Beginnings',
          description: 'A stone of fresh starts and positive transformation',
          icon: '✨',
        }
      );
    }
    // ... more stones
  });

  return properties.slice(0, 4);
};
```

**Supported Stones:**

- **Moonstone** → Intuition, New Beginnings
- **Amethyst** → Calm & Clarity, Protection
- **Quartz** → Amplification, Clarity
- **Labradorite** → Magic, Transformation

### 4. Storytelling Sections

**Location:** `client/src/pages/ProductDetail.tsx`, `client/src/pages/Home.tsx`

Elegant bordered sections for brand storytelling:

```tsx
<div className="story-section">
  <h3>Handcrafted in Winnipeg</h3>
  <p>
    Each piece is carefully crafted with 14k gold-plated materials and genuine
    crystals. We source our stones ethically and create every piece with
    intention...
  </p>
</div>
```

**CSS Styling:**

```css
.story-section {
  padding: 3rem 2rem;
  margin: 2rem 0;
  background: hsla(var(--bg-secondary), 0.5);
  border-left: 3px solid hsl(var(--gold-medium));
  border-radius: 0 8px 8px 0;
}
```

### 5. Premium Buttons

**Location:** `client/src/index.css`

Two premium button styles for primary and secondary actions:

**Primary Button (Add to Cart):**

```tsx
<button className="btn-premium-primary w-full">
  <ShoppingBag className="w-5 h-5" />
  <span>Add to Cart</span>
</button>
```

**Secondary Button (View All):**

```tsx
<button className="btn-premium-secondary">
  <span>View All Products</span>
</button>
```

### 6. Enhanced Product Cards

**Location:** `client/src/components/ProductCard.tsx`

Premium product cards with:

- Taller aspect ratio (1:1.15)
- Subtle gradient overlay on hover
- Wishlist functionality
- Gold hover borders in dark mode
- Enhanced typography

```tsx
<Card className="product-card-enhanced group cursor-pointer overflow-hidden">
  <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 1.15' }}>
    <WebPImage
      src={product.imageUrl}
      alt={product.name}
      width={600}
      height={690}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  </div>
  {/* ... card content */}
</Card>
```

### 7. Premium Spacing Utilities

**Location:** `client/src/index.css`

Enhanced spacing classes for premium layouts:

```css
.spacing-premium-lg {
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.spacing-premium-xl {
  padding-top: 6rem;
  padding-bottom: 6rem;
}
```

### 8. Trust Badges

**Location:** `client/src/pages/Home.tsx`, `client/src/pages/ProductDetail.tsx`

Clean icon-based trust signals:

```tsx
<div className="trust-badges">
  <div className="trust-badge">
    <div className="trust-badge-icon">
      <Truck className="w-5 h-5" />
    </div>
    <span className="trust-badge-text">Free Shipping</span>
  </div>
  {/* ... more badges */}
</div>
```

## CSS Utilities Reference

### Product Display Classes

| Class                       | Purpose                      | Usage                |
| --------------------------- | ---------------------------- | -------------------- |
| `.product-hero-image`       | Main product image container | ProductDetail page   |
| `.product-zoom-trigger`     | Zoom cursor on hover         | ProductDetail images |
| `.gallery-thumbnails`       | Image gallery grid           | ProductDetail page   |
| `.gallery-thumbnail`        | Individual thumbnail         | ProductDetail page   |
| `.gallery-thumbnail.active` | Active thumbnail state       | ProductDetail page   |

### Content Section Classes

| Class                  | Purpose                       | Usage               |
| ---------------------- | ----------------------------- | ------------------- |
| `.benefits-section`    | Benefits/Intentions container | ProductDetail, Home |
| `.benefit-item`        | Individual benefit card       | Benefits sections   |
| `.benefit-icon`        | Benefit icon container        | Benefit items       |
| `.benefit-title`       | Benefit heading               | Benefit items       |
| `.benefit-description` | Benefit text                  | Benefit items       |
| `.story-section`       | Storytelling container        | ProductDetail, Home |
| `.crystal-properties`  | Crystal energy grid           | ProductDetail page  |
| `.crystal-property`    | Individual property card      | Crystal properties  |

### Typography Classes

| Class                      | Purpose                   | Usage                      |
| -------------------------- | ------------------------- | -------------------------- |
| `.gemstone-display`        | Script font for gemstones | ProductCard, ProductDetail |
| `.premium-section-divider` | Gold/turquoise divider    | Section breaks             |

### Button Classes

| Class                    | Purpose                   | Usage          |
| ------------------------ | ------------------------- | -------------- |
| `.btn-premium-primary`   | Primary CTA with gradient | Add to Cart    |
| `.btn-premium-secondary` | Secondary outlined button | View All, etc. |

### Spacing Classes

| Class                 | Purpose               | Usage          |
| --------------------- | --------------------- | -------------- |
| `.spacing-premium-lg` | 4rem vertical padding | Major sections |
| `.spacing-premium-xl` | 6rem vertical padding | Hero sections  |

### Interactive Classes

| Class                    | Purpose                   | Usage                  |
| ------------------------ | ------------------------- | ---------------------- |
| `.product-card-enhanced` | Premium card hover effect | ProductCard component  |
| `.trust-badges`          | Trust badge container     | ProductDetail, Home    |
| `.trust-badge`           | Individual trust badge    | Trust badges container |
| `.trust-badge-icon`      | Trust badge icon          | Trust badges           |
| `.trust-badge-text`      | Trust badge text          | Trust badges           |

## Dark Mode Features

### Mystical Glow Effect

Dark mode enhances the mystical "cove" atmosphere with:

1. **Product Image Glow:**

   ```css
   [data-theme='dark'] .product-hero-image {
     box-shadow:
       0 0 60px hsla(var(--skull-turquoise-glow), 0.12),
       0 0 100px hsla(var(--frame-gold), 0.06);
   }
   ```

2. **Benefit Icons:**

   ```css
   [data-theme='dark'] .benefit-icon {
     background: hsla(var(--skull-turquoise-glow), 0.15);
     box-shadow: 0 0 20px hsla(var(--skull-turquoise), 0.2);
   }
   ```

3. **Story Sections:**
   ```css
   [data-theme='dark'] .story-section {
     background: hsla(var(--bg-secondary), 0.3);
     border-left-color: hsla(var(--frame-gold), 0.6);
   }
   ```

## Adding Crystal Properties

To add crystal properties for new gemstones, edit the `getCrystalProperties` function in `client/src/pages/ProductDetail.tsx`:

```tsx
if (lowerStone.includes('your-stone')) {
  properties.push(
    {
      title: 'Property Name',
      description: 'Description of the property',
      icon: '🔮',
    },
    {
      title: 'Another Property',
      description: 'Another description',
      icon: '✨',
    }
  );
}
```

## Customization Guide

### Changing Benefits Icons

Replace icons in the benefits section:

```tsx
<div className="benefit-icon">
  <YourIcon className="w-6 h-6" />
</div>
```

Available icons from `lucide-react`:

- `Sparkles`, `Gem`, `Shield`, `Truck`, `Heart`, `Star`, `Moon`, `Zap`, etc.

### Adjusting Spacing

Modify premium spacing values in `client/src/index.css`:

```css
.spacing-premium-lg {
  padding-top: 4rem; /* Adjust as needed */
  padding-bottom: 4rem;
}
```

### Customizing Colors

All colors use CSS variables from the theme system:

```css
/* Turquoise */
hsl(var(--skull-turquoise))
hsl(var(--accent-vibrant))

/* Gold */
hsl(var(--frame-gold))
hsl(var(--gold-medium))
```

**Never change the core palette values** - use the existing variables only.

## Testing Premium Features

### Manual Testing Checklist

- [ ] Product images display at 1000x1000px
- [ ] Zoom cursor appears on product images
- [ ] Dark mode mystical glow is visible
- [ ] Benefits section displays correctly
- [ ] Crystal properties generate for known stones
- [ ] Story sections have gold accent border
- [ ] Premium buttons have gradient effects
- [ ] Product cards have hover lift effect
- [ ] Trust badges align correctly
- [ ] All spacing is consistent

### Automated Testing

E2E tests verify premium features:

```bash
# Run all E2E tests
npx playwright test

# Run specific tests
npx playwright test products.spec.ts
npx playwright test theme-toggle.spec.ts
```

## Performance Considerations

### Image Optimization

- Use WebP format with `WebPImage` component
- Lazy load images below the fold
- Preload critical hero images

### CSS Optimization

- Premium utilities are in `index.css` (loaded once)
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid `transition: all` - list specific properties

### Bundle Size

- Premium CSS adds ~8KB gzipped
- Crystal properties logic is tree-shakeable
- No additional dependencies required

## Accessibility

### WCAG Compliance

- All interactive elements have proper ARIA labels
- Color contrast meets WCAG AA standards
- Keyboard navigation works throughout
- Focus indicators are visible in both themes

### Reduced Motion

Respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .product-card-enhanced {
    transition: none;
  }
}
```

## Browser Compatibility

### Supported Browsers

- Chrome/Edge 90+ (all features)
- Firefox 88+ (all features)
- Safari 14+ (all features)
- Mobile Safari 14+ (all features)

### Fallbacks

- CSS variables work in all modern browsers
- WebP images have JPEG fallbacks
- Grid layout uses flexbox fallbacks

## Troubleshooting

### Dark Mode Glow Not Visible

**Issue:** Product images don't glow in dark mode

**Solution:**

1. Check `data-theme="dark"` attribute on `<html>`
2. Verify CSS utilities loaded in `index.css`
3. Check browser DevTools for CSS conflicts

### Crystal Properties Not Showing

**Issue:** Crystal Energy section doesn't appear

**Solution:**

1. Verify product has `gemstones` field
2. Check stone name matches supported stones
3. Ensure `getCrystalProperties` function returns results

### Benefits Section Misaligned

**Issue:** Benefits cards don't align properly

**Solution:**

1. Check `.benefits-section` container class
2. Verify grid columns: `grid-cols-2 md:grid-cols-3`
3. Test on different viewport sizes

## Future Enhancements

Potential improvements for the premium experience:

1. **Image Lightbox** - Full-screen image viewer with zoom
2. **Video Backgrounds** - Subtle crystal formation videos
3. **AR Preview** - Try jewelry on virtually
4. **Crystal Quiz** - Find your perfect crystal
5. **Gift Wrap** - Premium packaging options
6. **Size Guide** - Interactive size selector
7. **Reviews** - Customer testimonials with photos

## Resources

### Design Inspiration

- [Vellees.com](https://vellees.com) - Primary design inspiration
- [Energy Muse](https://www.energymuse.com) - Crystal education
- [Satya Jewelry](https://www.satyajewelry.com) - Intention-based design
- [Bluboho](https://bluboho.com) - Canadian crystal jewelry

### Development Resources

- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/
- Lucide Icons: https://lucide.dev/icons/
- shadcn/ui: https://ui.shadcn.com/

---

**Last Updated:** March 30, 2026
**Version:** 1.0.0
**Maintained By:** Development Team
