# Logo Implementation Design Document

**Date:** 2026-03-08
**Author:** Design Review
**Status:** Approved for Implementation

## Overview

Create a comparison page demonstrating three methods for implementing the Troves & Coves logo, based on client-provided reference materials showing ornate, mystical typography.

## Client Reference Materials

- **Logo Image:** `attached_assets/reference-images/image_1749400164032.png`
- **Typography References:** `typog-1.jpg`, `typography.jpg`
- **Key Characteristics:**
  - Ornate serif font for "Troves" with decorative flourishes
  - Elegant script font for "Coves" with swashes
  - Diamond/crystal symbol as separator
  - Mystical, luxurious aesthetic

## Implementation Methods

### Method A: Image Asset

- Use client's logo directly as `<img>` element
- Fastest implementation, exact visual match
- Limited scalability, harder to animate

### Method B: SVG Recreation

- Hand-coded SVG matching logo 1:1
- Perfectly scalable, animatable
- Higher upfront development cost

### Method C: CSS Typography

- Web fonts approximating the style
- Most flexible, text-based
- May not achieve exact match

## Font Selection

| Element   | Current         | Target                       |
| --------- | --------------- | ---------------------------- |
| Troves    | Source Sans Pro | Cinzel Decor / Abril Fatface |
| Coves     | Dancing Script  | Great Vibes / Allura         |
| Separator | Standard &      | Diamond/crystal SVG element  |

## Component Structure

```
client/src/components/
├── LogoComparison.tsx         # Main comparison page
├── logo-variants/
│   ├── LogoImage.tsx         # Image asset version
│   ├── LogoSvg.tsx           # SVG recreation
│   └── LogoCss.tsx           # CSS typography version
└── Logo.tsx                  # Main logo (to be updated)
```

## Deliverables

1. Logo comparison page at `/logo-comparison`
2. Three variant implementations
3. Responsive sizing demonstrations
4. Dark/light background variants
