# Troves & Coves Design Specification

## Brand Identity

**Brand Voice:** Mystical, transformative, empowering, elegant

**Core Message:** "Discover the power of transformation with our handcrafted crystal jewelry. Each piece is designed to elevate your style and spirit."

---

## Color Palette

### Primary Brand Colors (Robin's Exact Specifications)

| Color Name | Hex | HSLA | Usage |
|------------|-----|------|-------|
| Turquoise | `#4abfbf` | `hsla(174, 85%, 45%, 1)` | TROVES text, primary actions, links, accents |
| Gold 1 | `#deb55b` | `hsla(43, 95%, 55%, 1)` | & symbol, prices, icons, decorative elements |
| Gold 2 | `#e1af2f` | `hsla(38, 80%, 53%, 1)` | Coves text, gemstone labels |
| Linen | `#faf8f3` | N/A | Background (off-white/cream) |

### Semantic Color Mappings

```
--troves-turquoise: #4abfbf
--gold-primary: #deb55b
--gold-secondary: #e1af2f
```

### WCAG Compliant Variants

For small text and accessibility requirements:
- Dark turquoise: `#2c6f6f` (WCAG AA compliant for body text)
- Dark gold 1: `#b8943d` (WCAG AA compliant)
- Dark gold 2: `#a08022` (WCAG AA compliant)

---

## Typography

### Font Families

| Purpose | Font | Weight | Style |
|---------|------|--------|-------|
| Brand/Titles | **Libre Baskerville** | 700 (Bold) | Uppercase, text-transform |
| Accent/Script | **Alex Brush** | Regular | Cursive, decorative |
| Body/UI | **Montserrat** | 400-600 | Sans-serif |

### Typography Hierarchy

```
HERO TITLE (TROVES)
├── Font: Libre Baskerville
├── Weight: 700 (Bold)
├── Color: #4abfbf
├── Transform: Uppercase
└── Size: 4xl → 6xl (responsive)

& SYMBOL
├── Font: Alex Brush
├── Color: #deb55b
└── Size: 3xl → 5xl

HERO TITLE (Coves)
├── Font: Alex Brush
├── Color: #e1af2f
└── Size: 4xl → 6xl

TAGLINE/SUBTITLE
├── Font: Montserrat
├── Color: #4abfbf
└── Weight: 400

BODY TEXT
├── Font: Montserrat
├── Color: hsl(var(--text-primary))
└── Weight: 400-500

PRICES
├── Font: Libre Baskerville
├── Color: #deb55b
└── Weight: 700 (Bold)

GEMSTONE LABELS
├── Font: Alex Brush
├── Color: #e1af2f
└── Size: text-xs
```

---

## Visual Effects

### Mystical Background Effects

```css
/* Turquoise glow - large ambient */
background: hsla(174, 85%, 45%, 0.05);
border-radius: 50%;
filter: blur(80px);

/* Gold glow - accent */
background: hsla(43, 95%, 55%, 0.03);
border-radius: 50%;
filter: blur(60px);

/* Crystal particles */
width: 1px;
height: 1px;
background: hsla(174, 85%, 45%, 0.6);
animation: float 5-10s ease-in-out infinite;
```

### Border Gradients

```css
/* Top/Bottom mystical borders */
background: linear-gradient(
  90deg,
  transparent 0%,
  hsla(174, 85%, 45%, 0.5) 50%,
  transparent 100%
);
height: 1px;
```

### Gem Icon Gradient

```svg
<radialGradient id="gemGradient" cx="20%" cy="20%" r="70%">
  <stop offset="0%" stopColor="#deb55b" stopOpacity="1" />
  <stop offset="100%" stopColor="#deb55b" stopOpacity="0" />
</radialGradient>
```

### Hover Effects

```css
/* Icon glow on hover */
.icon-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: hsla(174, 85%, 45%, 0.2);
  filter: blur(8px);
  opacity: 0;
  transition: opacity 0.3s;
}

.icon-wrapper:hover::after {
  opacity: 1;
}
```

---

## Component Patterns

### Hero Section

```
┌─────────────────────────────────────────────┐
│         [Mystical Background Glows]         │
│  ┌──────────────┐                            │
│  │   💎         │  [Gem Icon: 128px]        │
│  │              │  Position: Left of TROVES  │
│  │   TROVES &   │  Font: Libre + Alex Brush │
│  │   Coves      │  Color: #4abfbf, golds    │
│  └──────────────┘                            │
│                                              │
│  Handcrafted Crystal Jewellery               │
│  [Optional: Descriptive subtitle]            │
│                                              │
│                    ▼                         │
└─────────────────────────────────────────────┘
```

### Product Card

```
┌─────────────────────────────┐
│  [Product Image]            │
│  💔 Featured Badge          │
│                             │
│  Category Badge             │
│  Product Name               │
│  Materials                  │
│  Gemstones (Alex Brush)     │
│                             │
│  Price (#deb55b)    [Cart]  │
│              (#4abfbf btn)  │
└─────────────────────────────┘
```

### Features Bar

```
┌──────────────────────────────────────────────┐
│  [Turquoise Glow Border]                    │
│                                              │
│   🚚  Free Shipping Across Canada           │
│   🛡️  Lifetime Warranty                     │
│   💎  Ethically Sourced                      │
│                                              │
│  [Gold Glow Border]                         │
└──────────────────────────────────────────────┘
```

### Footer Logo

```
Troves & Coves
(Libre Baskerville, Alex Brush)
Colors: #4abfbf, #deb55b, #e1af2f
```

---

## Copy Guidelines

### Brand Voice

- **Mystical** - Use words like "transform," "energy," "intention," "crystal wisdom"
- **Empowering** - Focus on elevation, amplification, inner light
- **Elegant** - Sophisticated language, avoid slang

### Sample Copy

**Hero Tagline:**
"Handcrafted Crystal Jewellery"

**Transformation Message:**
"Discover the power of transformation with our handcrafted crystal jewelry. Each piece is designed to elevate your style and spirit, blending the elegance of 14k gold-plated chains with the raw beauty of natural crystals."

**Value Proposition:**
"Our statement necklaces and bracelets offer more than just luxury—they're crafted with intention to empower your energy and enhance your unique presence."

**Call to Action:**
"Embrace bold femininity and masculine strength with our exquisite collection, where every detail resonates with abundance and confidence."

---

## Responsive Breakpoints

```
Mobile:   < 768px   (base styles)
Tablet:   768px - 1024px  (md:)
Desktop:  > 1024px  (lg:)
Large:    > 1280px  (xl:)
```

---

## Animation Timing

```css
/* Gentle mystical animations */
float: 6-10s ease-in-out infinite
glow-breathe: 4-6s ease-in-out infinite
pulse-glow: 2-3s ease-in-out infinite
transition: 300ms (standard hover states)
```

---

## Accessibility Notes

- Use Robin's exact colors (`#4abfbf`, `#deb55b`, `#e1af2f`) for large text only
- Use WCAG-compliant dark variants for body text
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text
- All interactive elements must have visible hover/focus states

---

## Implementation Checklist

- [ ] Use `#4abfbf` for all turquoise accents (no variations)
- [ ] Use `#deb55b` for primary gold elements (prices, icons)
- [ ] Use `#e1af2f` for Coves text and secondary gold accents
- [ ] Apply Libre Baskerville for brand text
- [ ] Apply Alex Brush for script/accent text
- [ ] Apply Montserrat for body/UI text
- [ ] Include mystical background glows on major sections
- [ ] Use turquoise/gold gradient borders
- [ ] Add gem icons with radial gradients
- [ ] Ensure hover effects use brand colors

---

## File References

- Hero Component: `client/src/components/Hero.tsx`
- Header Component: `client/src/components/Header.tsx`
- Product Card: `client/src/components/ProductCard.tsx`
- Features Bar: `client/src/components/FeaturesBar.tsx`
- Footer: `client/src/components/Footer.tsx`
- Theme CSS: `client/src/index.css`
- Brand Config: `shared/brand-config.ts`
