# Visual Coherence Audit Findings (2026-03-11)

## Critical Issues Found

### 1. Typography Inconsistencies

- **Problem**: Product names on Home/Products pages use `Montserrat` font
- **Spec**: DESIGN_SPEC requires `Libre Baskerville` for headings (line 86)
- **Files**: `client/src/pages/Home.tsx:114`, `client/src/pages/Products.tsx`

### 2. Container Class Inconsistencies

- **Status**: ✅ FIXED - All pages now use `chamber-container`
- **Home/Products**: Use `chamber-container`
- **About/Contact**: Now use `chamber-container` (was `container mx-auto`)

### 3. Hero Section Padding Inconsistencies

- **Status**: ✅ FIXED - All pages now use py-24
- **Hero component**: py-24
- **Products page**: py-20 (note: Products uses different section structure)
- **About page**: py-24 (was py-24 md:py-32)
- **Contact page**: py-24 (was py-20)

### 4. Section Badge Inconsistencies

- **Status**: ✅ FIXED - About page now has Sparkles icon
- **Home**: Badge with Sparkles icon "Curated With Intention"
- **Products**: Badge with Sparkles icon "The Collection"
- **About**: Badge with Sparkles icon "Our Story" (now has icon)
- **Contact**: No badge (contact page has different structure)

### 5. Email Address Inconsistency

- **Status**: ✅ FIXED - Now standardized to info@trovesandcoves.ca

### 6. Old Gold Color Values

- **Status**: ✅ FIXED - Now using CSS variables

## All Issues Resolved

✓ Hero CTA text: "Shop the Collection"
✓ Category badges: Reduced size
✓ Mobile menu sparkle: No glow effect
✓ Header padding: Now consistent on scroll
✓ Brand tagline: "Handcrafted Crystal Jewelry"
✓ Main heading fonts: Libre Baskerville
✓ Product name fonts: Now using Libre Baskerville (was Montserrat)
✓ Gold accent: Using CSS variables hsl(var(--gold-medium))
✓ Turquoise accent: Using CSS variables hsl(var(--accent-vibrant))
✓ Container classes: All pages use chamber-container
✓ Hero padding: Standardized to py-24
✓ Section badges: Consistent Sparkles icon usage
✓ Email address: Standardized to info@trovesandcoves.ca
✓ Old gold rgba values: Replaced with CSS variables
