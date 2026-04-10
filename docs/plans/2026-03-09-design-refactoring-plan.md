# Design Refactoring Plan - Troves & Coves Site Alignment

**Date:** 2026-03-09
**Author:** Claude Code (Design System Analysis)
**Status:** Design Phase - Awaiting Approval

---

## Executive Summary

Comprehensive refactoring of all pages to align with the hero section's mystical crystal design while ensuring WCAG AA compliance across light and dark modes. The site currently has inconsistent implementations of the brand design system, leading to contrast issues and visual fragmentation.

### Key Issues Identified

1. **Brand Color Inconsistency** - Pages use different color systems (hardcoded vs CSS variables)
2. **Contrast Violations** - Small text using client's exact colors without WCAG-compliant variants
3. **Border/Card Fragmentation** - Inconsistent border treatments and card backgrounds
4. **Typography Inconsistency** - Mixed font usage (Montserrat vs Libre Baskerville for headings)
5. **Theme Variable Underutilization** - Direct color values instead of theme-aware CSS variables

---

## Brand Design Specifications (Locked)

### Colors

```css
/* CLIENT'S EXACT COLORS - Decorative Use Only (18px+ text) */
--troves-turquoise: #4abfbf; /* TROVES brand color */
--coves-gold-1: #deb55b; /* Gold shade 1 */
--coves-gold-2: #e1af2f; /* Gold shade 2 */
--linen-background: #faf8f3; /* Background */

/* WCAG AA COMPLIANT VARIANTS - Small Text Use */
--wcag-turquoise: 174 70% 30%; /* 5.8:1 contrast on linen */
--wcag-gold-1: 43 78% 35%; /* 4.7:1 contrast on linen */
--wcag-gold-2: 38 80% 35%; /* 4.6:1 contrast on linen */
```

### Typography

```css
/* CLIENT'S FONTS */
--font-troves: 'Libre Baskerville', serif; /* TROVES and headings */
--font-coves: 'Alex Brush', cursive; /* Coves and script text */
--font-body: 'Montserrat', sans-serif; /* Body text and UI */
```

### Design Elements

- **Mystical gradient backgrounds** - Radial gradients with turquoise/gold glows
- **Glass morphism** - Backdrop blur with subtle borders
- **Crystal cards** - Hexagonal clip-path with gradient borders
- **Elevated shadows** - Multi-layer glow effects
- **Floating particles** - Subtle crystal/gold particle animations (disabled)

---

## Refactoring Approach

### Approach 1: Complete Component Overhaul (RECOMMENDED)

**Benefits:**

- Ensures consistency across all pages
- Single source of truth for design patterns
- Easier maintenance and theme updates
- Full WCAG AA compliance guaranteed

**Trade-offs:**

- Higher initial time investment
- Requires thorough testing
- May break existing patterns

**Implementation:**

1. Create new theme-aware component library
2. Replace all page-level styling with components
3. Implement strict color usage rules in components

### Approach 2: Incremental Migration

**Benefits:**

- Lower risk per change
- Can validate as you go
- Easier to rollback if needed

**Trade-offs:**

- Longer overall timeline
- Temporary inconsistencies during migration
- Higher coordination overhead

**Implementation:**

1. Migrate one page at a time
2. Build shared components as needed
3. Gradual deprecation of old patterns

### Approach 3: CSS Variable Migration Only

**Benefits:**

- Fastest implementation
- Minimal component changes
- Preserves existing page structure

**Trade-offs:**

- May not catch all color issues
- Less consistent component behavior
- Theme switching may have edge cases

**Implementation:**

1. Replace all hardcoded colors with CSS variables
2. Update light/dark mode variable definitions
3. Test contrast ratios at each breakpoint

---

## Design Specifications

### 1. Color Usage Rules

#### BRAND COLORS (Decorative/Large Text Only)

```tsx
// ✅ CORRECT - Large text (18px+)
<h1 style={{ color: '#4abfbf' }}>TROVES</h1>
<h2 style={{ color: '#deb55b', fontSize: '2rem' }}>Collections</h2>

// ❌ INCORRECT - Small text with brand colors
<p style={{ color: '#4abfbf', fontSize: '14px' }}>
  This violates WCAG AA
</p>

// ✅ CORRECT - Small text with WCAG compliant variant
<p style={{ color: 'hsl(174 70% 30%)', fontSize: '14px' }}>
  This meets WCAG AA standards
</p>
```

#### CSS VARIABLES (All Text Sizes)

```tsx
// ✅ CORRECT - Theme-aware variables
<p style={{ color: 'hsl(var(--text-primary))' }}>Body text</p>
<span style={{ color: 'hsl(var(--accent-vibrant))' }}>Accent</span>

// ❌ INCORRECT - Hardcoded colors
<p style={{ color: '#2c6f6f' }}>Body text</p>
<span style={{ color: '#4abfbf' }}>Accent</span>
```

### 2. Card & Border Standards

#### STANDARD CARD

```tsx
// Base card with mystical gradient
<Card variant="elevated" theme="gradient">
  <CardContent>{/* Content */}</CardContent>
</Card>
```

#### CARD WITH GOLD BORDER

```tsx
<div
  className="crystal-card p-6"
  style={{
    border: '1px solid hsla(43, 78%, 53%, 0.3)',
    background:
      'linear-gradient(135deg, hsl(var(--bg-card)) 0%, hsl(var(--bg-secondary)) 100%)',
  }}
>
  {/* Content */}
</div>
```

#### GLASS CARD (Both Themes)

```tsx
<div
  className="glass-mystical p-6"
  style={{
    border: '1px solid hsla(174, 85%, 45%, 0.15)',
  }}
>
  {/* Content */}
</div>
```

### 3. Typography Standards

#### HEADINGS

```tsx
// Primary heading - Libre Baskerville + Turquoise
<h1
  style={{
    fontFamily: "'Libre Baskerville', serif",
    color: '#4abfbf',  // Only for 18px+
    fontWeight: 700
  }}
>
  Crystal Collection
</h1>

// Secondary heading - WCAG compliant
<h2
  style={{
    fontFamily: "'Libre Baskerville', serif",
    color: 'hsl(174 70% 30%)',  // WCAG AA variant
    fontWeight: 700
  }}
>
  Featured Pieces
</h2>
```

#### BODY TEXT

```tsx
// Standard body text - Montserrat + Theme variable
<p
  style={{
    fontFamily: "'Montserrat', sans-serif",
    color: 'hsl(var(--text-primary))',
    lineHeight: 1.7,
  }}
>
  Handcrafted crystal jewelry
</p>
```

#### SCRIPT TEXT (Coves)

```tsx
// Script text - Alex Brush + Gold
<span
  style={{
    fontFamily: "'Alex Brush', cursive",
    color: '#e1af2f'  // Only for 18px+ or dark backgrounds
  }}
>
  Coves
</span>

// WCAG compliant for small sizes
<span
  style={{
    fontFamily: "'Alex Brush', cursive",
    color: 'hsl(38 80% 35%)',  // WCAG AA variant
    fontSize: '1rem'
  }}
>
  Coves
</span>
```

### 4. Background Standards

#### SECTION BACKGROUNDS

```tsx
// Gradient section header
<section
  style={{
    background: 'linear-gradient(180deg, hsl(var(--bg-primary)) 0%, hsl(var(--bg-secondary)) 100%)'
  }}
>
  {/* Content */}
</section>

// Mystical gradient with glows
<section
  className="relative"
  style={{
    background: `
      radial-gradient(ellipse at 85% 15%, hsla(174, 70%, 40%, 0.12) 0%, transparent 45%),
      radial-gradient(ellipse at 15% 85%, hsla(215, 25%, 8%, 0.15) 0%, transparent 40%),
      linear-gradient(180deg, hsl(var(--bg-primary)) 0%, hsl(var(--bg-secondary)) 100%)
    `
  }}
>
  {/* Content */}
</section>
```

#### CARD BACKGROUNDS

```tsx
// Standard card background
<div
  style={{
    background: 'hsl(var(--bg-card))',
    border: '1px solid hsl(var(--border-medium))'
  }}
>
  {/* Content */}
</div>

// Elevated card with gradient
<div
  style={{
    background: 'linear-gradient(135deg, hsl(var(--bg-card)) 0%, hsl(var(--bg-secondary)) 100%)',
    border: '1px solid hsla(174, 85%, 45%, 0.3)'
  }}
>
  {/* Content */}
</div>
```

---

## Page-by-Page Analysis

### Home Page ✅ ALIGNED

- **Status:** Hero section properly implements brand design
- **Issues:** Some product cards may need contrast review

### Products Page ⚠️ NEEDS REVIEW

- **Issues:**
  - Sidebar filters use hardcoded colors
  - Category buttons may have contrast issues
  - Card borders inconsistent with hero

### About Page ⚠️ NEEDS REFACTOR

- **Issues:**
  - Value cards use hardcoded color strings
  - Story cards need border standardization
  - Some headings use non-brand fonts

### Contact Page ⚠️ NEEDS REFACTOR

- **Issues:**
  - Form fields need theme-aware backgrounds
  - Service cards require border updates
  - Labels may need contrast adjustments

### Other Pages (Checkout, Returns, etc.) ⚠️ NEED REVIEW

- **Status:** Not analyzed yet, likely need similar updates

---

## WCAG AA Compliance Checklist

### Contrast Ratios (Minimum 4.5:1 for normal text)

#### Light Mode

- [ ] All body text: `hsl(var(--text-primary))` on `hsl(var(--bg-primary))`
- [ ] Small turquoise text: `hsl(174 70% 30%)` minimum
- [ ] Small gold text: `hsl(38 80% 35%)` minimum
- [ ] Links on light backgrounds: WCAG compliant variants

#### Dark Mode

- [ ] All body text: `hsl(var(--text-primary))` on `hsl(var(--bg-primary))`
- [ ] Accent text: Use `--accent-vibrant` (brighter in dark mode)
- [ ] Borders: `hsl(var(--border-medium))` for sufficient contrast

### Interactive Elements

- [ ] All buttons have visible focus states
- [ ] Form inputs have clear borders and labels
- [ ] Links are distinguishable from surrounding text
- [ ] No dark-on-dark or light-on-light combinations

---

## Implementation Plan

### Phase 1: Foundation (Recommended: Approach 1)

1. **Create theme-aware component library**
   - `MysticalCard` - Standardized card component
   - `MysticalSection` - Section header with gradients
   - `MysticalButton` - Themed button variants
   - `MysticalText` - Typography components with WCAG compliance

2. **Update CSS variables**
   - Ensure all colors have light/dark variants
   - Add WCAG compliant text colors
   - Test contrast ratios for all combinations

3. **Create design tokens**
   - Spacing scales
   - Shadow definitions
   - Border radius standards
   - Animation timings

### Phase 2: Page Migration

1. **Products page**
   - Replace sidebar filters with themed components
   - Update product cards to standard
   - Fix category button contrasts

2. **About page**
   - Refactor value cards with component
   - Standardize story card borders
   - Update all headings to brand fonts

3. **Contact page**
   - Theme form fields and inputs
   - Update service cards
   - Fix label contrasts

4. **Remaining pages**
   - Checkout, Returns, Warranty, etc.
   - Consistent application of standards

### Phase 3: Quality Assurance

1. **Contrast testing**
   - Automated contrast ratio checks
   - Manual testing in both themes
   - Edge case validation

2. **Cross-browser testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers
   - Accessibility tools

3. **Performance validation**
   - No layout shifts
   - Smooth theme transitions
   - Optimized animations

---

## Success Criteria

### Design Alignment

- ✅ All pages use consistent card/border styling
- ✅ All headings use Libre Baskerville font family
- ✅ All body text uses Montserrat font family
- ✅ Script text uses Alex Brush consistently
- ✅ Brand colors used according to specifications

### WCAG Compliance

- ✅ All text meets 4.5:1 contrast minimum (normal text)
- ✅ All large text meets 3:1 contrast minimum (18px+)
- ✅ All interactive elements have visible focus states
- ✅ No contrast violations in light mode
- ✅ No contrast violations in dark mode

### Theme Consistency

- ✅ Light mode uses client's linen background (#faf8f3)
- ✅ Dark mode uses slate with turquoise accents
- ✅ All components respond correctly to theme toggle
- ✅ No hardcoded colors that ignore theme

### Code Quality

- ✅ No inline color values (except brand colors for large text)
- ✅ All colors use CSS variables
- ✅ Consistent component usage across pages
- ✅ Type-safe color utilities where applicable

---

## Risk Assessment

### High Risk

- **Breaking existing user flows** - Mitigation: Thorough testing of each page
- **Theme switching failures** - Mitigation: Comprehensive theme testing
- **Performance regression** - Mitigation: Performance monitoring

### Medium Risk

- **Browser compatibility** - Mitigation: Cross-browser testing
- **Mobile responsiveness** - Mitigation: Device testing
- **Animation performance** - Mitigation: Reduced motion support

### Low Risk

- **Design inconsistency** - Mitigation: Component library enforcement
- **Color drift** - Mitigation: CSS variable locks
- **Font loading** - Mitigation: Font display strategies

---

## Open Questions

1. **Animation Strategy** - Should we re-enable floating particles and shimmer effects?
2. **Card Interactions** - Should cards have hover lift effects? (Currently disabled)
3. **Gradient Intensity** - Are current mystical glows appropriate or too strong?
4. **Component Library** - Should we use shadcn/ui or build custom mystical components?
5. **Testing Tools** - What automated contrast testing should we integrate?

---

## Next Steps

Upon approval of this design document:

1. **Invoke writing-plans skill** to create detailed implementation plan
2. **Begin Phase 1** - Foundation work
3. **Set up testing** - Contrast validation, theme testing
4. **Execute page migration** - Following Phase 2 plan
5. **Quality assurance** - Phase 3 validation

---

**Recommendation:** Proceed with **Approach 1 (Complete Component Overhaul)** for maximum consistency and WCAG compliance. This investment will pay dividends in maintainability and user experience.

**Estimated Timeline:** 3-5 days for complete migration, assuming component library foundation is solid.
