# Vellees Product Page Design Analysis

**Source:** https://vellees.com/products/tensor-amulet-with-moonstone-gold-plated-brass
**Extracted:** 2026-03-30

---

## Executive Summary

Vellees uses a **content-rich, scrollable product page** with spiritual storytelling to create a premium, intentional feel. Key patterns:

1. **Split layout** - Image gallery left, sticky product info right
2. **Emoji section headers** - Visual anchors for content sections
3. **Multi-layer storytelling** - Crystal properties → Materials → Collection symbolism
4. **Generous whitespace** - 60-80px between sections
5. **Trust signals near CTA** - Shipping times, craftsmanship origin

---

## 1. Page Layout Structure

### Hero Section

```
┌─────────────────────────────────────────────────────┐
│  [IMAGE GALLERY - 50%]  │  [PRODUCT INFO - 50%]     │
│                         │                           │
│  ┌───┐                  │  # Product Title          │
│  │ 1 │ Large hero       │  Price: 296,00 zł        │
│  └───┘ image            │  ─────────────────────    │
│  ┌───┐                  │  Material icons           │
│  │ 2 │ Thumbnails       │  [Brass] [144MHz] [2] [5] │
│  └───┘                  │                           │
│  ┌───┐                  │  Quantity selector        │
│  │ 3 │                  │  [ - ] 1 [ + ]            │
│  └───┘                  │                           │
│                         │  [ ADD TO CART ]  ← full  │
│                         │                           │
│                         │  Shipping: 1-3 days       │
└─────────────────────────────────────────────────────┘
```

### Content Flow (Below Fold)

1. **Crystal Properties Section** - Emoji header + bullet benefits
2. **Origin & Nature** - Stone source, mineral group, hardness
3. **Which Souls It Affects** - Life path numbers
4. **Hand Geometry** - Technical specifications
5. **Collection Symbolism** - Design philosophy
6. **Summary** - TL;DR with fun fact

---

## 2. Image Handling Patterns

| Aspect            | Pattern                            |
| ----------------- | ---------------------------------- |
| **Hero ratio**    | Square (1:1)                       |
| **Gallery count** | 3-4 images                         |
| **Layout**        | Vertical stack with thumbnails     |
| **Zoom**          | Click opens modal with large image |
| **Mobile**        | Swipeable full-width gallery       |
| **Loading**       | Lazy-loaded with blur-up effect    |

---

## 3. Typography Hierarchy

```
H1: Product Name
    - Font: Serif or elegant sans-serif
    - Size: ~32-40px
    - Weight: 600-700

H2: Section Headers (with emoji)
    - Example: "🌔 Energetic properties and effects of moonstone"
    - Font: Bold sans-serif
    - Size: ~24-28px
    - Prefix emoji: 🌔 ✨ 💎 🧬 📌 🌍

Body Text:
    - Font: Clean sans-serif
    - Line-height: 1.6-1.8
    - Max-width: ~65ch for readability

Bold accents: Crystal property names, material names
```

---

## 4. Whitespace Patterns

| Element           | Spacing                   |
| ----------------- | ------------------------- |
| Section gaps      | 60-80px vertical          |
| Card padding      | 24-32px                   |
| Image spacing     | 8-12px between thumbnails |
| Paragraph spacing | 16-20px                   |
| List item spacing | 12-16px                   |

---

## 5. Storytelling Flow

### Crystal Properties Card

```html
<section>
  <h2>🌔 Energetic properties and effects of moonstone</h2>

  <p>
    <strong>Moonstone</strong> is a mineral of intuition, emotional harmony, and
    feminine wisdom. Its energy is soft yet deep...
  </p>

  <ul>
    <li>Enhances intuition and connection with the subconscious</li>
    <li>Calms emotions, especially in moments of tension</li>
    <li>Supports empathy and the ability to listen to the heart</li>
    <li>Helps in accepting changes by teaching fluidity</li>
    <li>Balances feminine and masculine energy</li>
    <li>Protects against emotional overload</li>
  </ul>

  <p>
    <em
      >This is a stone for those who wish to listen to the voice of
      intuition...</em
    >
  </p>
</section>
```

### Material Specifications Card

```html
<section>
  <h2>💎 Hand geometry – tensor amulet ROYAL QUBIT</h2>

  <ul>
    <li><strong>External diameter:</strong> 26 mm</li>
    <li><strong>Octagon-shaped connector:</strong> geometry of balance</li>
    <li><strong>Octagon (8):</strong> symbol of continuity and harmony</li>
    <li><strong>Clasp design:</strong> doesn't touch the tension ring</li>
  </ul>
</section>
```

### Collection Symbolism Card

```html
<section>
  <h2>✨ Symbolism of the ROYAL TERRA collection</h2>

  <p>
    <strong>ROYAL TERRA</strong> is a collection where the tensor pendant
    becomes <strong>an object of intention</strong>...
  </p>

  <p>
    The symbolic sign is the <strong>octagon (8)</strong> — a figure of balance
    and harmony of flow...
  </p>
</section>
```

---

## 6. Benefits/Intentions Section

### Structure

```
┌─────────────────────────────────────────┐
│ 🌔 Energetic Properties                  │
├─────────────────────────────────────────┤
│ Intro paragraph (2-3 sentences)          │
│                                          │
│ • Benefit 1                              │
│ • Benefit 2                              │
│ • Benefit 3                              │
│ • Benefit 4                              │
│ • Benefit 5                              │
│ • Benefit 6                              │
│                                          │
│ Summary sentence (italic)                │
└─────────────────────────────────────────┘
```

### Language Patterns

- "Enhances intuition" not "Makes you more intuitive"
- "Supports empathy" not "Helps you be more empathetic"
- "Protects against emotional overload"
- "Brings peace and tenderness towards oneself"

---

## 7. Trust Signals

| Signal             | Placement                | Format                                            |
| ------------------ | ------------------------ | ------------------------------------------------- |
| **Shipping time**  | Above CTA button         | "_Shipping usually within_ **1–3 business days**" |
| **Origin**         | Stone properties section | "**Country of origin:** India"                    |
| **Craftsmanship**  | Summary section          | "Family-run jewelry company since 1987"           |
| **Reviews**        | Below product info       | "376 Verified Reviews" badge                      |
| **Restock alerts** | Modal on sold-out items  | "Alert me if this item is restocked"              |

---

## 8. Color & Mood

| Element            | Treatment                              |
| ------------------ | -------------------------------------- |
| **Background**     | Clean white/cream (#FAFAF9 equivalent) |
| **Product images** | Dark, moody, dramatic lighting         |
| **Text**           | Dark charcoal, high contrast           |
| **Accents**        | Gold tones from product images         |
| **Overall mood**   | Minimal, spiritual, intentional        |

**Premium feel comes from:**

- High contrast between dark images and clean backgrounds
- Generous whitespace (no visual clutter)
- Elegant typography
- Dark/moody product photography

---

## 9. CTA Treatment

```
┌─────────────────────────────────────────┐
│ Regular price 296,00 zł                  │
│ Promotional price 296,00 zł              │
│                                          │
│ Quantity: [ − ] 1 [ + ]                  │
│                                          │
│ ┌─────────────────────────────────────┐  │
│ │        ADD TO CART                   │  │ ← Full width
│ └─────────────────────────────────────┘  │
│                                          │
│ Shipping usually within 1–3 business     │
│ days, extended by extra production time  │
└─────────────────────────────────────────┘
```

**Patterns:**

- Full-width button
- Price displayed above
- Shipping time immediately below
- No urgency elements (no countdown, no "only X left")

---

## 10. Mobile Responsiveness

| Element        | Mobile Treatment                              |
| -------------- | --------------------------------------------- |
| **Gallery**    | Full-width swipeable carousel                 |
| **Layout**     | Single column, sections stacked               |
| **CTA**        | Sticky bottom bar on scroll                   |
| **Typography** | Slightly smaller, hierarchy maintained        |
| **Spacing**    | Reduced but still generous (40-60px sections) |
| **Images**     | Full-width, no thumbnails                     |

---

## Actionable Adaptations for Troves & Coves

### High Priority

1. ✅ Add emoji section headers (🌔 ✨ 💎) to product pages
2. ✅ Create dedicated Crystal Properties section with bullet benefits
3. ✅ Add material specifications card
4. ✅ Add collection/brand story section
5. ✅ Display shipping time above CTA

### Medium Priority

6. ⬜ Implement 3-4 image gallery (not just 1 hero)
7. ⬜ Add origin information for each crystal
8. ⬜ Create "Which souls it affects" equivalent (zodiac, intentions)
9. ⬜ Add summary card with craftsmanship note

### Lower Priority

10. ⬜ Implement restock notification modal
11. ⬜ Add verified reviews section
12. ⬜ Create mobile sticky CTA bar

---

## File References

- **Knowledge base sources:** `Vellees Product Page`, `Vellees Homepage`
- **Search these in context:** `ctx_search(queries: [...], source: "Vellees Product Page")`
