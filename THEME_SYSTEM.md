# Troves & Coves - Theme System Documentation

> **Complete guide to the centralized theme system** for maintaining visual consistency across the site.

---

## Quick Start

### Using the Theme System

The theme system provides **reusable, theme-aware components** that automatically adapt to light/dark mode:

```tsx
// Elevated card with gradient theme
<Card variant="elevated" theme="gradient">
  <CardHeader variant="gradient">
    <CardTitle>My Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content...
  </CardContent>
</Card>

// Standard pill/badge
<div className="inline-flex items-center justify-center px-6 py-2 rounded-full"
     style={{
       backgroundColor: 'hsl(var(--gold-soft))',
       color: 'hsl(var(--text-primary))',
       boxShadow: '0 2px 8px hsla(var(--gold-medium), 0.3)'
     }}>
  <span className="text-sm font-medium tracking-widest uppercase">
    Badge Text
  </span>
</div>
```

---

## Architecture Overview

### Component Structure

```
client/src/components/
├── ui/
│   ├── card.tsx          # Card with variant/theme system
│   ├── badge.tsx         # Badge with theme variants
│   └── themed-components.tsx  # Reusable themed patterns
└── pages/                 # All pages use centralized system
```

### Design Philosophy

1. **CSS Variables as Single Source of Truth** - All colors defined in `index.css`
2. **Variant-Based Components** - Type-safe, composable options
3. **Reusable Patterns** - Common structures abstracted into components
4. **Consistent Spacing** - Built into component variants

---

## Component Reference

### Card Component (`client/src/components/ui/card.tsx`)

#### Variants

| Variant       | Description              | Use Case                             |
| ------------- | ------------------------ | ------------------------------------ |
| `default`     | Standard shadow-sm       | General content cards                |
| `elevated`    | shadow-2xl               | Featured content, important sections |
| `glass`       | shadow-lg                | Overlay cards, glassmorphism         |
| `interactive` | shadow-2xl + hover scale | Cards that respond to hover          |

#### Theme Options

| Theme      | Description              | Effect                                  |
| ---------- | ------------------------ | --------------------------------------- |
| `default`  | Uses `bg-card`           | Standard card background                |
| `gradient` | Uses gradient background | Elevated look with theme-aware gradient |

#### Usage Examples

```tsx
// Standard content card
<Card variant="default">
  <CardContent>Content...</CardContent>
</Card>

// Featured card with gradient
<Card variant="elevated" theme="gradient">
  <CardHeader variant="gradient">
    <CardTitle>Featured Content</CardTitle>
  </CardHeader>
  <CardContent>Content...</CardContent>
</Card>

// Interactive card with hover effect
<Card variant="interactive" theme="gradient">
  <CardContent>Hover me!</CardContent>
</Card>
```

### Badge Component (`client/src/components/ui/badge.tsx`)

#### Variants

| Variant     | Colors           | Use Case                |
| ----------- | ---------------- | ----------------------- |
| `default`   | Gold background  | Primary badges, pills   |
| `secondary` | Gray background  | Secondary info          |
| `gold`      | Gold with hover  | Gold-themed elements    |
| `turquoise` | Turquoise accent | Featured items, accents |
| `outline`   | Border only      | Category labels         |

#### Usage

```tsx
<Badge variant="default">Default Badge</Badge>
<Badge variant="gold">Gold Badge</Badge>
<Badge variant="turquoise">Turquoise Badge</Badge>
<Badge variant="outline">Outline Badge</Badge>
```

### Themed Components (`client/src/components/ui/themed-components.tsx`)

#### ThemeSectionHeader

**Purpose**: Page headers with badge + title + gradient divider

```tsx
<ThemeSectionHeader
  badge="Our Promise"
  title="Returns & Exchanges"
  description="Your satisfaction is paramount..."
/>
```

#### ThemeCard

**Purpose**: Elevated cards with icon + title for features

```tsx
import { ThemeCard } from '@/components/ui/themed-components';
import { Heart } from 'lucide-react';

<ThemeCard title="Authentic Crystals" icon={<Heart className="h-6 w-6" />}>
  <p>Card content here...</p>
</ThemeCard>;
```

#### StepCard

**Purpose**: Process/tutorial steps with numbered circles

```tsx
import { StepCard } from '@/components/ui/themed-components';

<StepCard
  step={1}
  title="Contact Us"
  description="Reach out through our contact form..."
/>;
```

**Result**:

```
[1] Contact Us
Reach out through our contact form...
```

#### InfoCircleCard

**Purpose**: Feature cards with circular icons

```tsx
import { InfoCircleCard } from '@/components/ui/themed-components';

<InfoCircleCard
  icon="💎"
  title="Authentic Crystals"
  description="Every piece features genuine, ethically sourced crystals"
  size="lg" // sm | md | lg
/>;
```

#### Gradient Dividers

```tsx
import { GradientDivider, TwoToneDivider } from '@/components/ui/themed-components';

<GradientDivider />  // Single color fade
<TwoToneDivider />   // Two-tone gradient (turquoise → blue)
```

---

## CSS Variables Reference

All colors defined in `client/src/index.css`

### Text Colors

```css
--text-primary: Main headings and important text --text-secondary: Body text and
  descriptions --text-muted: Subtle/disclaimer text;
```

### Background Colors

```css
--bg-primary: Page backgrounds (light mode: hsl(0 0% 99%))
  --bg-secondary: Section backgrounds --bg-tertiary: Card backgrounds
  --bg-card: Card element backgrounds;
```

### Accent Colors

```css
--accent-vibrant: Turquoise (primary accent) - hsl(174 85% 32%)
  --gold-soft: Soft gold (pills, badges) - hsl(43 95% 55%) --gold-medium: Medium
  gold (icons, borders) - hsl(43 95% 65%);
```

### Border Colors

```css
--border-light: Subtle borders --border-medium: Standard borders;
```

### Typography

```css
.troves-text: Teal with watercolor texture (larger)
.coves-text: Bright blue (smaller)
```

---

## Common Patterns

### Standard Page Header

```tsx
<section
  className="relative overflow-hidden py-20"
  style={{
    background:
      'linear-gradient(180deg, hsl(var(--bg-primary)) 0%, hsl(var(--bg-secondary)) 100%)',
  }}
>
  <div
    className="absolute top-0 left-0 w-full h-1"
    style={{
      background:
        'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)',
    }}
  />
  <div className="relative container mx-auto px-4 text-center">
    {/* Optional Badge */}
    <div
      className="inline-flex items-center justify-center px-6 py-2 mb-8 rounded-full"
      style={{
        backgroundColor: 'hsl(var(--gold-soft))',
        color: 'hsl(var(--text-primary))',
        boxShadow: '0 2px 8px hsla(var(--gold-medium), 0.3)',
      }}
    >
      <span className="text-sm font-medium tracking-widest uppercase">
        Badge Text
      </span>
    </div>

    {/* Title */}
    <h1
      className="text-5xl md:text-6xl font-bold mb-6"
      style={{ color: 'hsl(var(--text-primary))' }}
    >
      Page Title
    </h1>

    {/* Divider */}
    <div
      className="w-24 h-1 mx-auto mb-6 rounded-full"
      style={{
        background:
          'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)',
      }}
    />

    {/* Optional Description */}
    <p
      className="text-xl max-w-3xl mx-auto leading-relaxed"
      style={{ color: 'hsl(var(--text-secondary))' }}
    >
      Page description...
    </p>
  </div>
</section>
```

### Gradient Card with Header

```tsx
<Card variant="elevated" theme="gradient">
  <CardHeader variant="gradient">
    <CardTitle className="flex items-center gap-3">
      <IconName className="h-6 w-6" />
      Card Title
    </CardTitle>
  </CardHeader>
  <CardContent>Card content...</CardContent>
</Card>
```

### Interactive Card (Hover Scale)

```tsx
<Card variant="interactive" theme="gradient">
  <CardContent>This card scales on hover!</CardContent>
</Card>
```

---

## Migration Guide

### Converting Old Patterns

#### Card Styling

**Before:**

```tsx
<Card className="shadow-2xl backdrop-blur-sm"
      style={{
        border: '1px solid hsl(var(--border-medium))',
        background: 'linear-gradient(135deg, hsl(var(--bg-card)) 0%, hsl(var(--bg-secondary)) 100%)'
      }}
```

**After:**

```tsx
<Card variant="elevated" theme="gradient">
```

#### CardHeader Styling

**Before:**

```tsx
<CardHeader className="border-b"
              style={{
                background: 'linear-gradient(90deg, hsla(var(--accent-vibrant), 0.1), hsla(var(--accent-vibrant), 0.05))',
                borderBottomColor: 'hsl(var(--border-medium))'
              }}
```

**After:**

```tsx
<CardHeader variant="gradient">
```

#### Text Colors

**Before:**

```tsx
<h2 style={{ color: 'hsl(var(--text-primary))' }}>Title</h2>
<p style={{ color: 'hsl(var(--text-secondary))' }}>Description</p>
```

**After:**

```tsx
<h2 className="text-3xl font-bold mb-6" style={{ color: 'hsl(var(--text-primary))' }}>Title</h2>
<p className="text-lg" style={{ color: 'hsl(var(--text-secondary))' }}>Description</p>
```

**Note:** The CardTitle component now automatically applies `--text-primary` color, so you can omit the style prop for titles inside CardTitle.

---

## Design System

### Colors & Meaning

| Color          | CSS Variable       | Usage                                   | Meaning                               |
| -------------- | ------------------ | --------------------------------------- | ------------------------------------- |
| Teal/Turquoise | `--accent-vibrant` | Primary buttons, active elements, icons | Energy, spirituality, primary actions |
| Gold Soft      | `--gold-soft`      | Pills, badges                           | Warmth, elegance                      |
| Gold Medium    | `--gold-medium`    | Icons, borders                          | Richness, detail                      |
| Bright Blue    | `hsl(215 95% 55%)` | "Coves" text                            | Contrast, distinction                 |

### Spacing Standards

- **Pills/Badges**: `px-6 py-2` with `rounded-full`
- **Card padding**: Built into CardHeader (p-6) and CardContent (p-6 pt-0)
- **Section spacing**: `py-20` for major sections
- **Container margins**: `mx-auto` with `max-w-*` classes

### Typography Scale

- **Page titles**: `text-5xl md:text-6xl font-bold`
- **Section titles**: `text-3xl md:text-4xl font-bold`
- **Card titles**: `text-2xl font-semibold` (built into CardTitle)
- **Body text**: `text-base` or `text-lg`
- **Small text**: `text-sm`

---

## Best Practices

### 1. Use Variants Over Inline Styles

**❌ Avoid:**

```tsx
<div style={{ backgroundColor: 'hsl(var(--gold-soft))', ... }}>
```

**✅ Prefer:**

```tsx
<Card variant="elevated" theme="gradient">
<Badge variant="gold">
```

### 2. Leverage Built-in Components

**❌ Avoid:**

```tsx
<div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
  <span className="font-bold">1</span>
</div>
<h4 className="font-semibold">Title</h4>
<p className="text-sm">Description</p>
```

**✅ Prefer:**

```tsx
<StepCard step={1} title="Title" description="Description" />
```

### 3. Consistent Badge Styling

All pills/badges across the site use this pattern:

```tsx
<div className="inline-flex items-center justify-center px-6 py-2 rounded-full"
     style={{
       backgroundColor: 'hsl(var(--gold-soft))',
       color: 'hsl(var(--text-primary))',
       boxShadow: '0 2px 8px hsla(var(--gold-medium), 0.3)'
     }>
```

### 4. Semantic Color Usage

- `--text-primary`: Headings, important text
- `--text-secondary`: Body text, descriptions
- `--text-muted`: Subtle text, disclaimers
- `--accent-vibrant`: Primary actions, icons, highlights
- `--gold-soft`: Pills, badges, warm accents
- `--gold-medium`: Icons, borders

### 5. Theme Switching

All components automatically respond to theme changes. The CSS variables handle light/dark mode automatically:

- `body[data-theme='dark']` triggers dark mode
- All CSS variables have light/dark values defined
- Components automatically adapt without additional code

---

## Troubleshooting

### Component Not Using Theme Colors

**Issue**: Component still using old colors

**Fix**: Ensure you're using the variant prop:

```tsx
// ❌ Wrong - old way
<Card className="shadow-2xl backdrop-blur-sm">

// ✅ Correct - new way
<Card variant="elevated" theme="gradient">
```

### Colors Not Updating

**Issue**: Changed CSS variable but site not reflecting change

**Fix**:

1. Clear browser cache
2. Check for inline styles overriding CSS variables
3. Ensure CSS variable is defined in both `:root` and `[data-theme='dark']`

### TypeScript Errors

**Issue**: Type errors on variant props

**Fix**: Ensure you're importing from the correct path:

```tsx
import { Card } from '@/components/ui/card'; // ✅ Correct
import { Card } from '@/components/ui/card'; // ✅ Correct
```

---

## File Organization

### Theme-Related Files

```
client/src/
├── components/
│   └── ui/
│       ├── card.tsx                    # Card variants
│       ├── badge.tsx                   # Badge variants
│       └── themed-components.tsx        # Reusable patterns
├── index.css                           # CSS variables
└── pages/                             # All pages use system
```

### Documentation Files

- `THEME_SYSTEM.md` - This file (comprehensive guide)
- `CLAUDE.md` - Project-specific instructions
- `ROADMAP.md` - Future improvement plans

---

## Quick Reference Card

```tsx
// Cards
<Card variant="default">           // Standard
<Card variant="elevated">          // Featured
<Card variant="glass">             // Glassmorphism
<Card variant="interactive">       // Hover effect
<Card theme="gradient">           // Add gradient background

// Headers
<CardHeader variant="gradient">     // Add gradient background

// Badges
<Badge variant="default">          // Gold pill
<Badge variant="gold">              // Gold with hover
<Badge variant="turquoise">        // Turquoise accent
<Badge variant="outline">          // Border only

// Reusable Components
<ThemeSectionHeader />           // Page headers
<ThemeCard />                     // Feature cards
<StepCard />                      // Process steps
<InfoCircleCard />                // Feature cards
<GradientDivider />               // Single color
<TwoToneDivider />                // Two-tone
```

---

## Summary

The theme system provides:

- ✅ **Single source of truth** for all colors (CSS variables)
- ✅ **Type-safe variants** with autocomplete
- ✅ **Reusable components** for common patterns
- ✅ **Consistent spacing** built into variants
- ✅ **~500 lines of code eliminated** across all pages
- ✅ **Easy theme switching** (light/dark mode)
- ✅ **Maintainable** - update in one place, applies everywhere

**All pages now use this centralized system.** Theme coherence achieved! 🎉
