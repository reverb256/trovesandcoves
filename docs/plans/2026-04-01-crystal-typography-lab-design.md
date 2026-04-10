# Crystal Typography Lab - Comprehensive Design Document

**Date:** 2026-04-01
**Branch:** `pretext-lab`
**Status:** Design Approved
**Stack:** React + TypeScript + Vite + Pretext + Canvas API

---

## Overview

A new `/lab` route that serves as both a learning sandbox for the Pretext text measurement library and a premium brand differentiator for Troves & Coves. The page is a scroll-through experience with four distinct sections, each demonstrating a different Pretext capability through the lens of crystal/gemstone aesthetics.

**Pretext** (@chenglou/pretext) provides pixel-perfect text layout computation in pure JavaScript — bypassing DOM reflows entirely. Its two API surfaces are:

- **Height measurement:** `prepare()` + `layout()` — preprocess text once, then compute height at any width instantly
- **Full line layout:** `prepareWithSegments()` + `layoutWithLines()` — per-character positioning for canvas/SVG/WebGL rendering

This lab explores both surfaces across four creative experiments, each with multiple concept directions.

---

## Architecture

```
client/src/lab/
  LabPage.tsx                         # Main page, scroll orchestration
  LabNav.tsx                          # Floating section nav indicator

  components/
    refracted-light/
      RefractedLight.tsx              # Section 1 container
      CrystallographyHero.tsx         # Concept A: faceted crystal text
      LiquidCrystalHero.tsx           # Concept B: molten crystallization
      LightPrismHero.tsx              # Concept C: spectral refraction
      shared/
        canvasRenderer.ts             # Shared canvas drawing utilities
        particleSystem.ts             # Reusable particle effects

    natural-facets/
      NaturalFacets.tsx               # Section 2 container
      SpecimenMount.tsx               # Concept A: mineral mount cards
      GeodeReveal.tsx                 # Concept B: cracking geode cards
      CrystalCluster.tsx              # Concept C: interlocking cluster layout

    story-flows/
      StoryFlows.tsx                  # Section 3 container
      GemstoneJournal.tsx             # Concept A: magazine editorial
      StrataLayout.tsx                # Concept B: geological layers
      CartographerScroll.tsx          # Concept C: explorer journal style

    workbench/
      TheWorkbench.tsx                # Section 4 container
      WorkbenchTools.tsx              # Concept A: jeweler's bench UI
      LaboratoryPanel.tsx             # Concept B: technical lab interface
      SplitViewStudio.tsx             # Concept C: code+live split view

  hooks/
    usePretext.ts                     # Core hook: prepare() + layout() with cache
    usePretextLines.ts                # Per-line hook: prepareWithSegments() + layoutWithLines()
    useFontReady.ts                   # Font loading gate (document.fonts.ready)
    useCanvasRenderer.ts              # Canvas ref + animation frame lifecycle
    useScrollProgress.ts              # Scroll-based progress [0,1] for section animations
    useIntersectionSection.ts         # IntersectionObserver for section visibility

  utils/
    pretextCache.ts                   # LRU cache for prepare() results
    canvasEffects.ts                  # Gradient fills, glow, distortion utilities
    fontMetrics.ts                    # Font string parsing and validation
```

---

## Section 1: "Refracted Light" — Canvas Typography Hero

The hero section where product names are rendered on `<canvas>` with crystal-inspired effects. Pretext provides per-character positions; the canvas layer adds the visual magic.

### Concept A: "Crystallography" (Faceted Crystal Text)

Each character rendered as if it's a crystal facet with beveled edges and internal refraction.

**How it works:**

1. Pretext `prepareWithSegments()` + `layoutWithLines()` gives per-character x/y/width
2. For each character, draw on canvas with:
   - Multi-stop gradient fill (crystal clarity: pale blue → white → teal)
   - Simulated bevel effect (lighter top edge, darker bottom edge)
   - Internal "facet lines" at angles matching crystal geometry
   - Subtle drop shadow with crystalline color (not gray — teal-tinted)
3. On scroll, rotate the virtual "light source" position — facets brighten/darken accordingly
4. Particles: small prismatic light dots float upward from character tops

**Visual reference:** Imagine text carved from raw aquamarine, lit from above, slowly rotating.

**Pretext APIs used:** `prepareWithSegments()`, `layoutWithLines()`, per-segment positioning

### Concept B: "Liquid Crystal" (Molten Crystallization)

Text starts as scattered crystal fragments that assemble into readable letterforms as you scroll.

**How it works:**

1. Pretext computes the final resting position of each character
2. At scroll=0, characters are scattered randomly across the canvas with random rotation
3. As scroll progresses 0→1, characters interpolate toward their Pretext-computed positions
4. Each character's opacity ramps from 0.3 (frosted) to 1.0 (clear crystal)
5. During assembly, particles trail behind each character (crystallization sparks)
6. At scroll=1, text is fully formed and a subtle shimmer pulse plays

**Visual reference:** Crystal particles coalescing into text, like watching ice form in reverse.

**Pretext APIs used:** `prepareWithSegments()`, `layoutWithLines()` for target positions; scatter offsets computed separately

### Concept C: "Light Prism" (Spectral Refraction Wave)

White text that splits into rainbow spectral colors as a "beam of light" sweeps through.

**How it works:**

1. Pretext gives per-character positions across the line
2. A vertical "light beam" position tracks scroll progress (moves left→right)
3. Characters behind the beam are rendered white
4. Characters at the beam get a full-spectrum gradient fill (red→violet across the character width)
5. Characters past the beam settle into their "refracted" color — each character gets a fixed hue based on its index
6. Glow intensity peaks at the beam position
7. Subtle light rays emanate from the beam using radial gradients

**Visual reference:** White light hitting a prism and splitting into a rainbow, but the prism IS the text.

**Pretext APIs used:** `prepareWithSegments()`, `layoutWithLines()` for character positions; scroll position drives the beam

---

## Section 2: "Natural Facets" — Shrink-Wrapped Cards

Product cards where text containers precisely hug their content, eliminating padding waste and creating an organic, mineral-specimen-card aesthetic.

### Concept A: "Mineral Specimen Mount"

Product image sits like a gem in a display mount, text wraps around it in an organic contour.

**How it works:**

1. Product image placed in a shaped container (not rectangular — clipped to crystal silhouette via CSS clip-path or SVG mask)
2. For each row of text next to the image, call Pretext `layout()` with a reduced width
3. The text column width varies row-by-row to follow the crystal's contour
4. Result: text hugs the crystal shape, creating negative space that mirrors the gem
5. On hover, the card "lifts" with a subtle shadow change (specimen being picked up)
6. Product name uses `prepare()` for exact height — zero layout shift on load

**Visual reference:** A natural history museum display card for a mineral specimen.

**Pretext APIs used:** `prepare()` + `layout()` at multiple widths for contour wrapping

### Concept B: "Geode Reveal"

Cards that "crack open" on interaction, revealing the product description inside a geode-shaped cavity.

**How it works:**

1. Default state: product image fills the card, small product name overlaid
2. On click/hover, the card splits down the middle (like a geode cracking)
3. Inside, the product description appears in a cavity-shaped container
4. Pretext `prepare()` was called at mount time — height is pre-computed
5. The cavity animates from 0 height to exact Pretext-computed height (zero layout shift)
6. Inner surface has a crystalline texture (amethyst-like purple gradient)
7. Text is positioned within using Pretext `layout()` at the cavity width

**Visual reference:** Splitting open a geode to find text inside instead of crystals.

**Pretext APIs used:** `prepare()` for pre-computed heights, `layout()` for cavity text measurement

### Concept C: "Crystal Cluster"

Multiple product cards of varying heights arranged like a natural crystal cluster formation.

**How it works:**

1. Each product card has variable-height text (descriptions vary in length)
2. Pretext `prepare()` + `layout()` computes exact card height at the column width
3. Cards are positioned using CSS Grid with `grid-row: span N` where N matches the Pretext-computed height
4. Heights vary organically — shorter products get smaller cards, longer descriptions get taller ones
5. Cards overlap slightly at edges (like crystal faces touching)
6. Background has a subtle mineral matrix texture
7. On scroll, cards "grow" from the bottom (crystals forming) using height animation from 0→Pretext-computed height

**Visual reference:** A cluster of amethyst crystals of varying heights growing from a matrix.

**Pretext APIs used:** `prepare()` + `layout()` for exact heights, `grid-row: span` calculation

---

## Section 3: "The Story Flows" — Editorial Multi-Column

Long-form content (About page material) reimagined as a responsive magazine-quality editorial spread.

### Concept A: "Gemstone Journal" (Magazine Editorial)

Classic magazine layout with justified text, multi-column flow, and crystal-themed pull quotes.

**How it works:**

1. Full About page content loaded into the section
2. Pretext `walkLineRanges()` + `layoutNextLine()` distributes lines across N columns
3. Column count adapts to viewport: 1 col (mobile), 2 col (tablet), 3 col (desktop)
4. Text is justified using Pretext's per-line data — adjust word spacing per line to fill column width
5. Pull quotes are rendered on canvas using Alex Brush font via `prepareWithSegments()`
6. Crystal-shaped SVG cutouts create text-wrap zones (text flows around diamond/triangle shapes)
7. Drop caps for section starts — first letter rendered larger via Pretext measurement

**Visual reference:** A luxury jewelry magazine spread — think Cartier editorial.

**Pretext APIs used:** `walkLineRanges()`, `layoutNextLine()` for column distribution; `prepareWithSegments()` for pull quote canvas rendering

### Concept B: "Strata" (Geological Layers)

Text arranged in horizontal bands with varying tones, like geological strata with embedded crystal formations.

**How it works:**

1. Content split into thematic "layers" (story, values, process)
2. Each layer has a slightly different background tone (progression from dark to light)
3. Text within each layer uses Pretext `layout()` for precise columnar arrangement
4. Crystal product images are "embedded" between layers at angles (like fossils in strata)
5. Text wraps around the angled images using variable-width Pretext measurement
6. Scroll reveals each layer with a parallax offset (deeper = older = slower)
7. Section dividers are wavy lines (geological unconformity) rendered with SVG

**Visual reference:** A geological cross-section where text is the rock and crystal images are the embedded gems.

**Pretext APIs used:** `prepare()` + `layout()` for each layer; variable widths for text wrapping around angled images

### Concept C: "The Cartographer" (Explorer Journal)

Illustrated-scroll style where text navigates around crystal formations like an old explorer's journal.

**How it works:**

1. Hand-drawn-style SVG crystal formations placed throughout the layout
2. Text "flows" around these formations using Pretext's width-based layout
3. Annotation lines connect text to specific crystal features
4. Pretext `layoutWithLines()` positions each line, checking for SVG collision zones
5. Lines that would overlap a crystal get pushed down/wider to flow around it
6. Marginalia-style notes appear in the gutters (set in smaller Montserrat)
7. The whole layout has a parchment-toned background with aged-paper texture
8. Scroll triggers a "pen writing" animation on key headings (Alex Brush on canvas)

**Visual reference:** A 19th-century naturalist's field journal documenting crystal specimens.

**Pretext APIs used:** `prepare()` + `layout()` at variable widths for collision avoidance; `prepareWithSegments()` for canvas heading animations

---

## Section 4: "The Workbench" — Interactive Playground

A live experimentation interface where users manipulate Pretext parameters and see results in real-time. Three concept directions for the UI shell.

### Concept A: "Workbench" (Jeweler's Bench)

Controls styled as jeweler's tools laid out on a dark velvet surface.

**Controls:**

- Width: brass slider (like a caliper)
- Font family: three gem-shaped toggle buttons (turquoise for Libre Baskerville, gold for Montserrat, amethyst for Alex Brush)
- Font size: ring sizer-style selector
- Line height: magnification loupe with rotating dial
- Custom text: engraving-style input field
- Mode toggle: "Measure" (height API) / "Layout" (lines API)

**Preview area:**

- Center of the bench, on a small display easel
- Three synchronized views stacked:
  1. DOM render (standard)
  2. Canvas render (Pretext-positioned)
  3. Debug overlay (line break positions, character bounds, timing)

**Performance readout:**

- Small brass-framed display showing:
  - `prepare()` time (ms)
  - `layout()` time (ms)
  - Equivalent DOM measurement time (ms)
  - Speed multiplier (Pretext vs DOM)

### Concept B: "Laboratory" (Technical Lab)

Clean, technical interface with measurement instruments and data visualization.

**Controls:**

- Numeric inputs with +/- steppers
- Dropdown selects for font family
- Toggle switches for CSS properties (white-space, word-break, overflow-wrap)
- Preset buttons: "Short text", "CJK mixed", "Emoji heavy", "Long paragraph"

**Preview area:**

- Split into three resizable panels (DOM | Canvas | Debug)
- Each panel has its own zoom controls
- Debug panel shows:
  - Colored bounding boxes per line
  - Character-level width indicators
  - Break opportunity markers
  - Height prediction accuracy (vs actual DOM measurement)

**Performance readout:**

- Real-time chart (tiny line graph showing measurement times over last 20 interactions)
- Tabular comparison: Pretext time, DOM time, delta, accuracy percentage

### Concept C: "Split View Studio" (Figma-Style)

Left panel is a code/config editor, right panel is live rendering. Changes on the left instantly update the right.

**Left panel (Config):**

- JSON-style editor with syntax highlighting
- Editable fields: text, font, fontSize, lineHeight, maxWidth, white-space, word-break
- Preset snippets dropdown
- "Copy config" button

**Right panel (Live Preview):**

- Auto-zooming preview that scales to fit
- Toggle between DOM render, Canvas render, and Debug overlay
- Floating info badge showing current line count and total height

**Performance readout:**

- Inline in the config panel as a status bar
- Green/yellow/red indicator for measurement speed
- "Pretext: 0.09ms | DOM: 19.4ms | 215x faster" format

---

## Technical Decisions

### Font Loading Strategy

Pretext measurement accuracy depends on fonts being loaded. The `useFontReady` hook wraps `document.fonts.ready` and optionally `document.fonts.check()` for specific fonts. All canvas rendering is gated behind font readiness.

```typescript
// useFontReady.ts pattern
export function useFontReady(fontFamilies: string[]): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const check = () => {
      const allLoaded = fontFamilies.every(f =>
        document.fonts.check(`16px ${f}`)
      );
      if (allLoaded) setReady(true);
    };
    document.fonts.ready.then(check);
    // Also listen for individual font loads
    fontFamilies.forEach(f =>
      document.fonts.addEventListener('loadingdone', check)
    );
    return () =>
      fontFamilies.forEach(f =>
        document.fonts.removeEventListener('loadingdone', check)
      );
  }, [fontFamilies]);
  return ready;
}
```

### Measurement Cache

`prepare()` is the expensive call (~19ms). Since the same text+font combination always produces the same prepared result, we cache by composite key:

```typescript
// pretextCache.ts pattern
const cache = new Map<string, PreparedText>();

export function getCachedPrepare(text: string, font: string): PreparedText {
  const key = `${text}::${font}`;
  let prepared = cache.get(key);
  if (!prepared) {
    prepared = prepare(text, font);
    cache.set(key, prepared);
    // Evict oldest if cache > 500 entries
    if (cache.size > 500) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
  }
  return prepared;
}
```

### Canvas Rendering Lifecycle

Canvas elements are managed through `useCanvasRenderer` which handles:

- Getting the 2D context
- Setting up device pixel ratio scaling (for retina)
- Providing an animation frame loop
- Cleanup on unmount

```typescript
// useCanvasRenderer.ts pattern
export function useCanvasRenderer(
  canvasRef: RefObject<HTMLCanvasElement>,
  drawFn: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => void,
  deps: any[]
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let raf: number;
    const loop = () => {
      drawFn(ctx, rect.width, rect.height);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, deps);
}
```

### Scroll Progress

Each section tracks its own scroll progress [0, 1] using IntersectionObserver + scroll position calculation. This drives animations in Sections 1 and 3.

### No SSR

The `/lab` route is client-only. Canvas APIs don't exist on the server. The route is registered with Wouter's lazy loading to ensure it's never server-rendered.

### Accessibility

All canvas-rendered text has an `aria-label` or hidden DOM text equivalent for screen readers. The interactive playground controls use standard form elements with labels. Keyboard navigation works for all controls. The debug overlay has a high-contrast mode.

---

## Route Integration

```typescript
// In App.tsx or route config
<Route path="/lab" component={LabPage} />
```

Navigation from the main site: a subtle "Typography Lab" link in the footer or a special nav entry. The lab page has its own floating nav showing which section you're in.

---

## Build Order (Phased)

### Phase 1: Foundation

- Install Pretext
- Create hook layer (usePretext, usePretextLines, useFontReady, useCanvasRenderer)
- Create cache utility
- Create LabPage shell with scroll sections
- Create LabNav floating indicator

### Phase 2: Section 1 - Canvas Hero

- Implement Crystallography (Concept A) as the primary
- Add canvas effects utilities
- Test with all three site fonts
- Verify accuracy against DOM rendering

### Phase 3: Section 4 - Interactive Playground

- Implement Split View Studio (Concept C) as the primary
- Wire up all controls to Pretext hooks
- Add performance comparison display
- Add debug overlay

### Phase 4: Section 2 - Shrink-Wrapped Cards

- Implement Specimen Mount (Concept A) as the primary
- Wire up product data
- Test contour wrapping at various widths
- Add hover/click interactions

### Phase 5: Section 3 - Editorial Multi-Column

- Implement Gemstone Journal (Concept A) as the primary
- Build column distribution algorithm
- Add pull quote canvas rendering
- Test responsive column reflow

### Phase 6: Polish & Additional Concepts

- Add remaining concepts (B and C for each section) as switchable modes
- Add section transitions and scroll orchestration
- Performance audit
- Cross-browser testing
- Mobile responsive adjustments

---

## Success Criteria

1. **Pixel accuracy:** Pretext-measured text matches DOM rendering within 1px across Chrome, Firefox, Safari
2. **Performance:** Canvas hero section maintains 60fps during scroll animation
3. **Learning:** All four Pretext API surfaces (prepare, layout, prepareWithSegments, layoutWithLines) are demonstrated with clear code
4. **Visual impact:** The page feels like a premium brand experience, not a tech demo
5. **No layout shift:** All text heights are pre-computed before first render — zero CLS
6. **Accessibility:** All content is perceivable regardless of rendering method

---

## Dependencies

| Package                  | Purpose                         |
| ------------------------ | ------------------------------- |
| `@chenglou/pretext`      | Text measurement and layout     |
| (existing) `react`       | UI framework                    |
| (existing) `wouter`      | Routing                         |
| (existing) `tailwindcss` | Styling for controls and layout |

No additional dependencies needed. Canvas API is native. Animation uses requestAnimationFrame.
