# Theme System Refactoring Guide

## Overview

We've centralized the styling system to make theme switches much easier. Instead of repeating inline styles everywhere, we now have:

1. **Theme-aware Card variants** in `card.tsx`
2. **Reusable themed components** in `themed-components.tsx`

## New Card Variants

```tsx
import { Card } from '@/components/ui/card';

// Before: Repeated style props everywhere
<Card
  className="shadow-2xl backdrop-blur-sm"
  style={{
    border: '1px solid hsl(var(--border-medium))',
    background: 'linear-gradient(135deg, hsl(var(--bg-card)) 0%, hsl(var(--bg-secondary)) 100%)'
  }}
>

// After: Clean and declarative
<Card variant="elevated" theme="gradient">
```

**Available variants:**

- `default` - Standard card with shadow-sm
- `elevated` - Large shadow-2xl
- `glass` - Medium shadow-lg
- `interactive` - Elevated with hover scale effect

**Available themes:**

- `default` - Uses standard bg-card
- `gradient` - Applies theme-aware gradient background

## CardHeader Variants

```tsx
import { Card, CardHeader } from '@/components/ui/card';

// Before
<CardHeader
  className="border-b"
  style={{
    background: 'linear-gradient(90deg, hsla(var(--accent-vibrant), 0.1), ...)',
    borderBottomColor: 'hsl(var(--border-medium))'
  }}
>

// After
<CardHeader variant="gradient">
```

## New Themed Components

### ThemeSectionHeader

For page headers with badge + title + gradient divider:

```tsx
import { ThemeSectionHeader } from '@/components/ui/themed-components';

<ThemeSectionHeader
  badge="Our Promise"
  title="Returns & Exchanges"
  description="Your satisfaction is paramount..."
/>;
```

### ThemeCard

For elevated cards with icon + title:

```tsx
import { ThemeCard } from '@/components/ui/themed-components';
import { Heart } from 'lucide-react';

<ThemeCard title="Authentic Crystals" icon={<Heart className="h-6 w-6" />}>
  <p>Card content here...</p>
</ThemeCard>;
```

### StepCard

For process/tutorial steps:

```tsx
import { StepCard } from '@/components/ui/themed-components';

<StepCard
  step={1}
  title="Contact Us"
  description="Reach out through our contact form..."
/>;
```

### InfoCircleCard

For value propositions with circular icons:

```tsx
import { InfoCircleCard } from '@/components/ui/themed-components';

<InfoCircleCard
  icon="💎"
  title="Authentic Crystals"
  description="Every piece features genuine, ethically sourced crystals"
  size="lg" // sm | md | lg
/>;
```

### Gradient Dividers

```tsx
import { GradientDivider, TwoToneDivider } from '@/components/ui/themed-components';

<GradientDivider />  // Single color
<TwoToneDivider />   // Two-tone gradient
```

## Migration Examples

### Before (Repeated Styles)

```tsx
<Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
  <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
    <CardTitle className="text-troves-turquoise flex items-center space-x-3">
      <Icon className="text-ornate-frame-gold" />
      Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    Content with repeated style={{ color: 'hsl(var(--text-secondary))' }}{' '}
    everywhere
  </CardContent>
</Card>
```

### After (Centralized)

```tsx
<Card variant="elevated" theme="gradient">
  <CardHeader variant="gradient">
    <CardTitle>
      <Icon className="h-6 w-6" />
      Title
    </CardTitle>
  </CardHeader>
  <CardContent>Content with automatic theming</CardContent>
</Card>
```

## Benefits

1. **Single source of truth** - Update colors in `index.css` and everything updates
2. **Type safety** - Variants are typed and checked
3. **Less code** - No more repeating the same style props
4. **Easier maintenance** - Change gradient in one place, updates everywhere
5. **Consistent spacing** - All cards use the same padding, shadows, borders

## Next Steps

Refactor remaining pages to use these components:

- ✅ Returns.tsx (started)
- ⏳ Contact.tsx
- ⏳ About.tsx
- ⏳ JewelryCare.tsx
- ⏳ Warranty.tsx
- ⏳ SizeGuide.tsx
- ⏳ Financing.tsx

Each page should follow the pattern:

1. Replace `shadow-2xl backdrop-blur-sm` with `variant="elevated"`
2. Replace gradient styles with `theme="gradient"`
3. Replace `CardHeader` gradient styles with `variant="gradient"`
4. Use `StepCard`, `ThemeCard`, or `InfoCircleCard` where appropriate
