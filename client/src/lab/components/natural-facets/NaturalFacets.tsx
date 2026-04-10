/**
 * Natural Facets — Section 2 of the Crystal Typography Lab
 *
 * Shrink-wrapped product cards where text containers precisely hug their
 * content using Pretext measurement. Three interactive concept modes:
 *
 *   - Specimen Mount: Crystal-clipped image + wrapping text
 *   - Geode Reveal: Click-to-expand card with animated height
 *   - Crystal Cluster: Masonry grid of varying-height cards
 */
import { useState, useRef, useEffect } from 'react';
import { prepare, layout } from '@chenglou/pretext';
import { usePretext } from '../../hooks/usePretext';
import { useFontReady } from '../../hooks/useFontReady';
import { useIntersectionSection } from '../../hooks/useIntersectionSection';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NaturalFacetsProps {
  onVisible: () => void;
}

type FacetMode = 'specimen' | 'geode' | 'cluster';

interface Product {
  name: string;
  description: string;
  price: string;
  gemstones: string[];
  color: string;
}

// ---------------------------------------------------------------------------
// Sample products
// ---------------------------------------------------------------------------

const SAMPLE_PRODUCTS: Product[] = [
  {
    name: 'Celestial Amethyst Pendant',
    description:
      'A stunning pendant featuring a raw amethyst crystal set in 14k gold-filled wire wrapping. The natural purple hues catch light beautifully.',
    price: '$89',
    gemstones: ['Amethyst'],
    color: 'hsl(270, 50%, 65%)',
  },
  {
    name: 'Ocean Turquoise Bracelet',
    description:
      'Genuine turquoise stones strung on sterling silver with a delicate 14k gold-filled clasp. Each stone is unique in its matrix patterns and sky-blue color.',
    price: '$65',
    gemstones: ['Turquoise'],
    color: 'hsl(180, 55%, 55%)',
  },
  {
    name: 'Rose Quartz Crystal Necklace',
    description:
      'A polished rose quartz point hangs from a handcrafted gold-filled chain. The gentle pink tones evoke unconditional love and inner peace.',
    price: '$78',
    gemstones: ['Rose Quartz'],
    color: 'hsl(340, 40%, 75%)',
  },
  {
    name: 'Citrine Sunburst Earrings',
    description: 'Faceted citrine drops catch the light. Warm golden tones.',
    price: '$52',
    gemstones: ['Citrine'],
    color: 'hsl(40, 80%, 60%)',
  },
  {
    name: 'Labradorite Moon Phase Cuff',
    description:
      'A wide cuff bracelet featuring labradorite stones that flash blue and green in changing light, set alongside engraved moon phase symbols in gold-filled metal. Each labradorite has its own unique flash pattern.',
    price: '$110',
    gemstones: ['Labradorite'],
    color: 'hsl(210, 30%, 55%)',
  },
  {
    name: 'Black Tourmaline Protection Anklet',
    description: 'Raw black tourmaline chips on a gold-filled chain.',
    price: '$45',
    gemstones: ['Tourmaline'],
    color: 'hsl(0, 0%, 25%)',
  },
];

// ---------------------------------------------------------------------------
// Font constants
// ---------------------------------------------------------------------------

const FONT_NAME = "'Libre Baskerville', serif";
const FONT_DESC = "'Montserrat', sans-serif";
const LINE_HEIGHT = 22;
const DESC_LINE_HEIGHT = 20;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Shared crystal-shaped image placeholder */
function CrystalPlaceholder({ color, size }: { color: string; size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
        background: `linear-gradient(135deg, ${color}, ${adjustBrightness(color, -15)})`,
        flexShrink: 0,
      }}
    />
  );
}

/** Specimen Mount card */
function SpecimenCard({
  product,
  containerWidth,
}: {
  product: Product;
  containerWidth: number;
}) {
  const imageWidth = 120;
  const textMaxWidth = Math.max(containerWidth - imageWidth - 24, 100);

  const nameFont = `700 16px ${FONT_NAME}`;
  const descFont = `400 13px ${FONT_DESC}`;

  const nameMeasurement = usePretext({
    text: product.name,
    font: nameFont,
    maxWidth: textMaxWidth,
    lineHeight: LINE_HEIGHT,
  });

  const descMeasurement = usePretext({
    text: product.description,
    font: descFont,
    maxWidth: textMaxWidth,
    lineHeight: DESC_LINE_HEIGHT,
  });

  const nameHeight = nameMeasurement?.height ?? 0;
  const descHeight = descMeasurement?.height ?? 0;
  const totalTextHeight = nameHeight + 8 + descHeight + 8; // gaps + price
  const cardHeight = Math.max(totalTextHeight + 24, 140); // 24px padding

  return (
    <div
      style={{
        background: 'hsl(var(--bg-card))',
        borderRadius: '8px',
        border: '1px solid hsl(var(--border-primary) / 0.15)',
        padding: '12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        height: cardHeight,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <CrystalPlaceholder
        color={product.color}
        size={Math.min(imageWidth - 16, 100)}
      />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          paddingTop: '2px',
        }}
      >
        <h3
          style={{
            fontFamily: FONT_NAME,
            fontSize: '16px',
            fontWeight: 700,
            color: 'hsl(var(--text-primary))',
            lineHeight: `${LINE_HEIGHT}px`,
            margin: 0,
            height: nameHeight || undefined,
            overflow: 'hidden',
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontFamily: FONT_DESC,
            fontSize: '13px',
            color: 'hsl(var(--text-secondary))',
            lineHeight: `${DESC_LINE_HEIGHT}px`,
            margin: `${8}px 0 0 0`,
            height: descHeight || undefined,
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>
        <span
          style={{
            display: 'inline-block',
            marginTop: '8px',
            fontFamily: FONT_DESC,
            fontSize: '14px',
            fontWeight: 600,
            color: 'hsl(var(--gold-medium))',
          }}
        >
          {product.price}
        </span>
      </div>
    </div>
  );
}

/** Geode Reveal card */
function GeodeCard({
  product,
  containerWidth,
}: {
  product: Product;
  containerWidth: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const descFont = `400 13px ${FONT_DESC}`;
  const textMaxWidth = Math.max(containerWidth - 48, 100);

  const descMeasurement = usePretext({
    text: product.description,
    font: descFont,
    maxWidth: textMaxWidth,
    lineHeight: DESC_LINE_HEIGHT,
    enabled: true,
  });

  const revealHeight = descMeasurement?.height ?? 0;

  return (
    <div
      onClick={() => setIsOpen(prev => !prev)}
      style={{
        background: isOpen
          ? `linear-gradient(180deg, hsl(270, 50%, 12%) 0%, hsl(280, 40%, 18%) 60%, hsl(270, 50%, 12%) 100%)`
          : 'hsl(var(--bg-card))',
        borderRadius: '10px',
        border: isOpen
          ? '1px solid hsl(270, 50%, 35%)'
          : '1px solid hsl(var(--border-primary) / 0.15)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'background 0.4s ease, border-color 0.4s ease',
        boxShadow: isOpen
          ? '0 0 24px hsl(270, 50%, 20%)'
          : '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      {/* Visible header — always shown */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CrystalPlaceholder color={product.color} size={44} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontFamily: FONT_NAME,
                fontSize: '16px',
                fontWeight: 700,
                color: isOpen
                  ? 'hsl(270, 50%, 80%)'
                  : 'hsl(var(--text-primary))',
                margin: 0,
                transition: 'color 0.3s',
              }}
            >
              {product.name}
            </h3>
            <span
              style={{
                fontFamily: FONT_DESC,
                fontSize: '13px',
                fontWeight: 600,
                color: isOpen
                  ? 'hsl(270, 40%, 65%)'
                  : 'hsl(var(--gold-medium))',
                transition: 'color 0.3s',
              }}
            >
              {product.price}
            </span>
          </div>
          <div
            style={{
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isOpen
                ? 'hsl(270, 50%, 65%)'
                : 'hsl(var(--text-secondary) / 0.5)',
              transition: 'transform 0.3s, color 0.3s',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 11L3 6h10l-5 5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expandable geode cavity */}
      <div
        style={{
          maxHeight: isOpen && revealHeight > 0 ? revealHeight + 32 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          style={{
            padding: '0 20px 16px 20px',
            borderTop: '1px solid hsl(270, 40%, 25%)',
            marginTop: '0',
            paddingTop: '12px',
          }}
        >
          <p
            style={{
              fontFamily: FONT_DESC,
              fontSize: '13px',
              lineHeight: `${DESC_LINE_HEIGHT}px`,
              color: 'hsl(270, 30%, 75%)',
              margin: 0,
            }}
          >
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Crystal Cluster card */
function ClusterCard({
  product,
  containerWidth,
}: {
  product: Product;
  containerWidth: number;
}) {
  const nameFont = `700 14px ${FONT_NAME}`;
  const descFont = `400 12px ${FONT_DESC}`;
  const textMaxWidth = Math.max(containerWidth - 32, 80);

  const nameMeasurement = usePretext({
    text: product.name,
    font: nameFont,
    maxWidth: textMaxWidth,
    lineHeight: 20,
  });

  const descMeasurement = usePretext({
    text: product.description,
    font: descFont,
    maxWidth: textMaxWidth,
    lineHeight: 18,
  });

  const nameHeight = nameMeasurement?.height ?? 0;
  const descHeight = descMeasurement?.height ?? 0;
  const totalHeight = nameHeight + descHeight + 60; // image + gaps + price + padding

  return (
    <div
      style={{
        background: 'hsl(var(--bg-card))',
        borderRadius: '6px',
        border: '1px solid hsl(var(--border-primary) / 0.12)',
        padding: '14px',
        height: totalHeight,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: `0 1px 8px rgba(0,0,0,0.06),
          inset 0 0 0 1px ${product.color}15
        `,
      }}
    >
      {/* Crystal accent line at top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${product.color}60, transparent)`,
          borderRadius: '1px',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '4px',
            background: `linear-gradient(135deg, ${product.color}, ${adjustBrightness(product.color, -20)})`,
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: FONT_DESC,
            fontSize: '12px',
            fontWeight: 600,
            color: product.color,
          }}
        >
          {product.price}
        </span>
      </div>

      <h4
        style={{
          fontFamily: FONT_NAME,
          fontSize: '14px',
          fontWeight: 700,
          color: 'hsl(var(--text-primary))',
          lineHeight: '20px',
          margin: '0 0 6px 0',
          height: nameHeight || undefined,
          overflow: 'hidden',
        }}
      >
        {product.name}
      </h4>
      <p
        style={{
          fontFamily: FONT_DESC,
          fontSize: '12px',
          color: 'hsl(var(--text-secondary))',
          lineHeight: '18px',
          margin: 0,
          height: descHeight || undefined,
          overflow: 'hidden',
        }}
      >
        {product.description}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mode selector buttons
// ---------------------------------------------------------------------------

const MODES: { key: FacetMode; label: string; icon: string }[] = [
  { key: 'specimen', label: 'Specimen Mount', icon: '\u25C6' },
  { key: 'geode', label: 'Geode Reveal', icon: '\u25C8' },
  { key: 'cluster', label: 'Crystal Cluster', icon: '\u2756' },
];

function ModeSelector({
  active,
  onChange,
}: {
  active: FacetMode;
  onChange: (mode: FacetMode) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      {MODES.map(mode => {
        const isActive = active === mode.key;
        return (
          <button
            key={mode.key}
            onClick={() => onChange(mode.key)}
            style={{
              fontFamily: FONT_DESC,
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              padding: '8px 18px',
              borderRadius: '6px',
              border: isActive
                ? '1px solid hsl(var(--accent-vibrant) / 0.5)'
                : '1px solid hsl(var(--border-primary) / 0.2)',
              background: isActive
                ? 'hsl(var(--accent-vibrant) / 0.08)'
                : 'transparent',
              color: isActive
                ? 'hsl(var(--accent-vibrant))'
                : 'hsl(var(--text-secondary))',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{mode.icon}</span>
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function NaturalFacets({ onVisible }: NaturalFacetsProps) {
  const [mode, setMode] = useState<FacetMode>('specimen');
  const { sectionRef, isVisible } = useIntersectionSection(0.15);

  const fontsReady = useFontReady(['Libre Baskerville', 'Montserrat']);

  // Notify parent when section becomes visible
  const hasNotified = useRef(false);
  useEffect(() => {
    if (isVisible && !hasNotified.current) {
      hasNotified.current = true;
      onVisible();
    }
  }, [isVisible, onVisible]);

  // Card width estimate for Pretext measurement
  // Specimen/Geode: ~50% of 900px max container minus padding
  // Cluster: ~33% of 900px minus padding
  const cardWidth = mode === 'cluster' ? 260 : 420;

  return (
    <section
      id="section-natural-facets"
      ref={sectionRef}
      style={{
        padding: '80px 24px',
        maxWidth: '960px',
        margin: '0 auto',
        minHeight: '400px',
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div
          style={{
            fontFamily: FONT_DESC,
            fontSize: '12px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'hsl(var(--text-secondary) / 0.5)',
            marginBottom: '12px',
          }}
        >
          Section 02
        </div>

        <h2
          style={{
            fontFamily: FONT_NAME,
            fontSize: '36px',
            fontWeight: 700,
            color: 'hsl(var(--text-primary))',
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <span style={{ color: 'hsl(var(--accent-vibrant))' }}>&#x25C6;</span>
          Natural Facets
          <span style={{ color: 'hsl(var(--accent-vibrant))' }}>&#x25C6;</span>
        </h2>

        <p
          style={{
            fontFamily: FONT_DESC,
            fontSize: '15px',
            color: 'hsl(var(--text-secondary))',
            maxWidth: '560px',
            margin: '0 auto 32px auto',
            lineHeight: '1.6',
          }}
        >
          Shrink-wrapped product cards where text containers precisely hug their
          content. Each card's geometry is computed by Pretext — no wasted
          space, no layout shift.
        </p>

        <ModeSelector active={mode} onChange={setMode} />
      </div>

      {/* Content — gated behind font readiness */}
      {!fontsReady ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 0',
            fontFamily: FONT_DESC,
            fontSize: '14px',
            color: 'hsl(var(--text-secondary) / 0.5)',
          }}
        >
          Loading fonts for precise measurement...
        </div>
      ) : !isVisible ? null : mode === 'specimen' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '16px',
          }}
        >
          {SAMPLE_PRODUCTS.map(product => (
            <SpecimenCard
              key={product.name}
              product={product}
              containerWidth={cardWidth}
            />
          ))}
        </div>
      ) : mode === 'geode' ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '520px',
            margin: '0 auto',
          }}
        >
          {SAMPLE_PRODUCTS.map(product => (
            <GeodeCard
              key={product.name}
              product={product}
              containerWidth={cardWidth}
            />
          ))}
        </div>
      ) : (
        /* Crystal Cluster — masonry grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridAutoRows: '10px',
            gap: '12px',
          }}
        >
          {SAMPLE_PRODUCTS.map((product, i) => {
            const nameFont = `700 14px ${FONT_NAME}`;
            const descFont = `400 12px ${FONT_DESC}`;
            const textMaxWidth = Math.max(cardWidth - 32, 80);
            const spanRows = getClusterRowSpan(
              product,
              nameFont,
              descFont,
              textMaxWidth
            );
            return (
              <div
                key={product.name}
                style={{
                  gridColumn: `auto`,
                  gridRow: `span ${spanRows}`,
                  // Organic overlapping edges
                  marginTop: i % 2 === 0 ? '-4px' : '4px',
                  marginBottom: i % 3 === 0 ? '-6px' : '0',
                }}
              >
                <ClusterCard product={product} containerWidth={cardWidth} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/**
 * Adjust brightness of an hsl() color string.
 * Only handles `hsl(h, s%, l%)` format.
 */
function adjustBrightness(hsl: string, amount: number): string {
  const match = hsl.match(
    /hsl\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)/
  );
  if (!match) return hsl;
  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]);
  const l = Math.max(0, Math.min(100, parseFloat(match[3]) + amount));
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Compute the number of 10px grid rows a cluster card should span.
 * Uses Pretext's prepare() + layout() directly (not hooks) for exact
 * height measurement at the given width.
 */
function getClusterRowSpan(
  product: Product,
  nameFont: string,
  descFont: string,
  textMaxWidth: number
): number {
  try {
    const namePrepared = prepare(product.name, nameFont);
    const nameResult = layout(namePrepared, textMaxWidth, 20);
    const descPrepared = prepare(product.description, descFont);
    const descResult = layout(descPrepared, textMaxWidth, 18);
    const totalHeight = nameResult.height + descResult.height + 60;
    return Math.max(Math.ceil(totalHeight / 10), 8);
  } catch {
    // Fallback estimation if canvas context unavailable
    const descLines = Math.ceil(
      product.description.length / Math.max(1, Math.floor(textMaxWidth / 6.5))
    );
    const nameLines = Math.ceil(
      product.name.length / Math.max(1, Math.floor(textMaxWidth / 7.5))
    );
    const totalHeight = nameLines * 20 + descLines * 18 + 60;
    return Math.max(Math.ceil(totalHeight / 10), 8);
  }
}
