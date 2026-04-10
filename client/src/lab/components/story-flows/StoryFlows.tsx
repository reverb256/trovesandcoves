/**
 * Section 3: Story Flows — Editorial Multi-Column Layout
 *
 * Showcases Pretext's ability to distribute text across columns
 * with precise measurement. Three concept modes:
 * - Gemstone Journal: Magazine editorial with flowing columns
 * - Strata: Geological layer layout with floating crystal formations
 * - Cartographer: Explorer-journal style with marginalia and annotations
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { usePretext } from '../../hooks/usePretext';
import { useFontReady } from '../../hooks/useFontReady';
import { useIntersectionSection } from '../../hooks/useIntersectionSection';
import {
  useCanvasRenderer,
  type CanvasRenderer,
} from '../../hooks/useCanvasRenderer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StoryMode = 'journal' | 'strata' | 'cartographer';

interface StoryFlowsProps {
  onVisible: () => void;
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const EDITORIAL_CONTENT = {
  title: 'The Art of Crystal Craftsmanship',
  subtitle: 'Where nature meets artisan intention',
  paragraphs: [
    'At Troves & Coves, we believe that every crystal carries a story — a narrative written over millions of years in the slow alchemy of the earth. Our mission is to honor that story by pairing each stone with craftsmanship that lets its natural beauty speak.',
    'Founded in Winnipeg, Manitoba, our studio is where geology meets artistry. We source genuine crystals and gemstones from ethical suppliers worldwide, selecting each stone for its exceptional clarity, color, and character. No two pieces are alike — and that is precisely the point.',
    'Our process begins with material selection. We work primarily with 14k gold-filled components, chosen for their durability and lasting beauty. Unlike gold plating, gold-filled jewelry can last a lifetime with proper care, making each piece an investment in everyday elegance.',
    'The design phase is where intuition meets technique. Each piece is thoughtfully planned to balance elegance with everyday wearability — jewelry that makes a statement without demanding one. We believe the best accessories enhance your presence without overwhelming it.',
    'Finally, every necklace, bracelet, and earring is carefully assembled by hand in our Winnipeg studio. This hands-on approach ensures attention to detail that machines simply cannot replicate. The slight imperfections in handcrafted work are not flaws — they are the signature of human creation.',
  ],
  pullQuote:
    'Every crystal carries a story — a narrative written over millions of years in the slow alchemy of the earth.',
  values: [
    {
      title: 'Quality Materials',
      description:
        '14k gold-filled components and genuine crystals selected for their exceptional clarity and natural beauty.',
    },
    {
      title: 'Handcrafted',
      description:
        'Each piece is meticulously crafted by hand in our Winnipeg studio.',
    },
    {
      title: 'Authentic',
      description:
        'We use only genuine crystals and natural stones — never synthetic alternatives.',
    },
    {
      title: 'Canadian',
      description:
        'Proudly crafted in Winnipeg, Manitoba. Canadian quality in every piece.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Mode definitions
// ---------------------------------------------------------------------------

const MODES: { key: StoryMode; label: string; icon: string }[] = [
  { key: 'journal', label: 'Gemstone Journal', icon: '📖' },
  { key: 'strata', label: 'Strata', icon: '🗻' },
  { key: 'cartographer', label: 'Cartographer', icon: '🗺' },
];

// ---------------------------------------------------------------------------
// SVG Crystal Shapes (inline)
// ---------------------------------------------------------------------------

function DiamondCutout({ size = 140 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <path
        d="M70 5L135 70L70 135L5 70L70 5Z"
        stroke="hsl(var(--accent-vibrant) / 0.25)"
        strokeWidth="1.5"
        fill="hsl(var(--bg-primary) / 0.6)"
      />
      <path
        d="M70 25L115 70L70 115L25 70L70 25Z"
        stroke="hsl(var(--accent-vibrant) / 0.15)"
        strokeWidth="1"
        fill="none"
      />
      <line
        x1="70"
        y1="5"
        x2="70"
        y2="135"
        stroke="hsl(var(--accent-vibrant) / 0.1)"
        strokeWidth="0.5"
      />
      <line
        x1="5"
        y1="70"
        x2="135"
        y2="70"
        stroke="hsl(var(--accent-vibrant) / 0.1)"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function CrystalFormation({
  width = 60,
  height = 80,
  rotation = 0,
}: {
  width?: number;
  height?: number;
  rotation?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', transform: `rotate(${rotation}deg)` }}
    >
      {/* Main crystal body */}
      <polygon
        points="30,0 45,20 45,60 30,80 15,60 15,20"
        fill="hsl(var(--accent-vibrant) / 0.08)"
        stroke="hsl(var(--accent-vibrant) / 0.2)"
        strokeWidth="1"
      />
      {/* Inner facet */}
      <polygon
        points="30,8 40,22 40,55 30,72 20,55 20,22"
        fill="none"
        stroke="hsl(var(--gold-medium) / 0.15)"
        strokeWidth="0.5"
      />
      {/* Highlight line */}
      <line
        x1="30"
        y1="0"
        x2="30"
        y2="80"
        stroke="hsl(var(--gold-light) / 0.12)"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function SmallCrystalIllustration({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <polygon
        points="16,2 28,12 24,28 8,28 4,12"
        fill="hsl(var(--accent-vibrant) / 0.06)"
        stroke="hsl(var(--gold-medium) / 0.3)"
        strokeWidth="0.8"
      />
      <polygon
        points="16,6 24,13 22,25 10,25 8,13"
        fill="none"
        stroke="hsl(var(--accent-vibrant) / 0.15)"
        strokeWidth="0.4"
      />
    </svg>
  );
}

function WaveySeparator() {
  return (
    <svg
      width="100%"
      height="20"
      viewBox="0 0 800 20"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', height: '20px' }}
    >
      <path
        d="M0,10 C80,2 160,18 240,10 C320,2 400,18 480,10 C560,2 640,18 720,10 C760,6 780,14 800,10"
        stroke="hsl(var(--accent-vibrant) / 0.15)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M0,14 C100,6 200,22 300,14 C400,6 500,22 600,14 C700,6 750,18 800,14"
        stroke="hsl(var(--gold-medium) / 0.1)"
        strokeWidth="0.5"
        fill="none"
      />
    </svg>
  );
}

function AnnotationLine({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <svg
      style={{
        position: 'absolute',
        top: Math.min(y1, y2),
        left: Math.min(x1, x2),
        width: Math.abs(x2 - x1) || 1,
        height: Math.abs(y2 - y1) || 1,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <line
        x1={x1 - Math.min(x1, x2)}
        y1={y1 - Math.min(y1, y2)}
        x2={x2 - Math.min(x1, x2)}
        y2={y2 - Math.min(y1, y2)}
        stroke="hsl(35, 60%, 50% / 0.35)"
        strokeWidth="0.8"
        strokeDasharray="3,2"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Section header */
function SectionHeader() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          color: 'hsl(var(--accent-vibrant))',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ color: 'hsl(var(--gold-medium))' }}>※</span>
        Section 3
      </div>
      <h2
        style={{
          fontFamily: "'Libre Baskerville', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          color: 'hsl(var(--text-primary))',
          marginBottom: '0.5rem',
        }}
      >
        Story Flows
      </h2>
      <p
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '0.9rem',
          color: 'hsl(var(--text-secondary))',
          maxWidth: '480px',
          margin: '0 auto',
          lineHeight: 1.6,
        }}
      >
        Pretext distributes text across columns and wraps around shapes with
        sub-pixel precision.
      </p>
    </div>
  );
}

/** Mode selector buttons */
function ModeSelector({
  active,
  onChange,
}: {
  active: StoryMode;
  onChange: (m: StoryMode) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '2.5rem',
        flexWrap: 'wrap' as const,
      }}
    >
      {MODES.map(m => {
        const isActive = active === m.key;
        return (
          <button
            key={m.key}
            onClick={() => onChange(m.key)}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: `1px solid ${isActive ? 'hsl(var(--accent-vibrant) / 0.4)' : 'hsl(var(--border-primary))'}`,
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
              gap: '0.4rem',
            }}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gemstone Journal Mode
// ---------------------------------------------------------------------------

function GemstoneJournal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  // Determine column count based on width
  const columnCount = containerWidth < 640 ? 1 : containerWidth < 1024 ? 2 : 3;
  const gap = 28;
  const columnWidth = Math.max(
    100,
    (containerWidth - gap * (columnCount - 1)) / columnCount
  );

  // Measure each paragraph height at the column width
  const bodyFont = "15px 'Montserrat', sans-serif";
  const lineHeight = 24;

  const measurements = EDITORIAL_CONTENT.paragraphs.map(p =>
    usePretext({
      text: p,
      font: bodyFont,
      maxWidth: columnWidth,
      lineHeight,
      enabled: true,
    })
  );

  // Measure pull quote (height used for layout balancing)
  const pullQuoteFont = "20px 'Alex Brush', cursive";
  const pullQuoteLH = 32;
  usePretext({
    text: EDITORIAL_CONTENT.pullQuote,
    font: pullQuoteFont,
    maxWidth: columnWidth,
    lineHeight: pullQuoteLH,
    enabled: true,
  });

  // Observe container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Distribute paragraphs across columns using Pretext-measured heights
  // for balanced distribution (greedy: assign to shortest column).
  // Pull quote is inserted after paragraph index 1.
  const PULL_QUOTE_EST_HEIGHT = 80;

  type ColumnItem =
    | { type: 'paragraph'; index: number; height: number }
    | { type: 'pullQuote'; height: number };

  const columnItems: ColumnItem[] = EDITORIAL_CONTENT.paragraphs
    .map((_, i) => ({
      type: 'paragraph' as const,
      index: i,
      height: measurements[i]?.height ?? 100,
    }))
    .flatMap((item, i) => {
      if (i === 1) {
        return [
          item,
          { type: 'pullQuote' as const, height: PULL_QUOTE_EST_HEIGHT },
        ];
      }
      return [item];
    });

  // Greedy distribution: assign each item to the shortest column
  const columns: ColumnItem[][] = Array.from({ length: columnCount }, () => []);
  const colHeights = Array(columnCount).fill(0);
  for (const item of columnItems) {
    const shortestIdx = colHeights.indexOf(Math.min(...colHeights));
    columns[shortestIdx].push(item);
    colHeights[shortestIdx] += item.height;
  }

  return (
    <div ref={containerRef}>
      {/* Title area */}
      <div style={{ textAlign: 'center' as const, marginBottom: '2rem' }}>
        <h3
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: 'hsl(var(--text-primary))',
            marginBottom: '0.35rem',
          }}
        >
          {EDITORIAL_CONTENT.title}
        </h3>
        <p
          style={{
            fontFamily: "'Alex Brush', cursive",
            fontSize: '1.1rem',
            color: 'hsl(var(--gold-medium))',
          }}
        >
          {EDITORIAL_CONTENT.subtitle}
        </p>
      </div>

      {/* Multi-column editorial content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gap: `${gap}px`,
          position: 'relative' as const,
        }}
      >
        {columns.map((col, colIdx) => (
          <div key={colIdx} style={{ position: 'relative' as const }}>
            {/* Diamond cutout — float in first column */}
            {colIdx === 0 && (
              <div
                style={{
                  float: 'right' as const,
                  shapeOutside: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  width: '140px',
                  height: '140px',
                  marginLeft: '12px',
                  marginBottom: '8px',
                  position: 'relative' as const,
                }}
              >
                <DiamondCutout size={140} />
              </div>
            )}

            {col.map(item => {
              if (item.type === 'pullQuote') {
                return (
                  <blockquote
                    key="pullQuote"
                    style={{
                      fontFamily: "'Alex Brush', cursive",
                      fontSize: '1.15rem',
                      lineHeight: 1.7,
                      color: 'hsl(var(--gold-medium))',
                      borderLeft: '3px solid hsl(var(--gold-medium) / 0.4)',
                      paddingLeft: '1rem',
                      margin: '1.5rem 0',
                      fontStyle: 'italic' as const,
                    }}
                  >
                    &ldquo;{EDITORIAL_CONTENT.pullQuote}&rdquo;
                  </blockquote>
                );
              }

              const pIdx = item.index;
              const para = EDITORIAL_CONTENT.paragraphs[pIdx];
              const isFirst = pIdx === 0 && colIdx === 0;

              return (
                <p
                  key={`p-${pIdx}`}
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.9375rem',
                    lineHeight: 1.65,
                    color: 'hsl(var(--text-primary) / 0.85)',
                    textAlign: 'justify' as const,
                    marginBottom: '1rem',
                  }}
                >
                  {isFirst ? (
                    <>
                      <span
                        style={{
                          float: 'left' as const,
                          fontFamily: "'Libre Baskerville', serif",
                          fontSize: '3.2rem',
                          lineHeight: 0.8,
                          color: 'hsl(var(--accent-vibrant))',
                          marginRight: '0.15em',
                          marginTop: '0.1em',
                        }}
                      >
                        {para.charAt(0)}
                      </span>
                      {para.slice(1)}
                    </>
                  ) : (
                    para
                  )}
                </p>
              );
            })}
          </div>
        ))}
      </div>

      {/* Values row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
          gap: '1rem',
          marginTop: '2.5rem',
          paddingTop: '2rem',
          borderTop: '1px solid hsl(var(--border-primary))',
        }}
      >
        {EDITORIAL_CONTENT.values.map((v, i) => (
          <div key={i}>
            <h4
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: '0.85rem',
                color: 'hsl(var(--accent-vibrant))',
                marginBottom: '0.35rem',
              }}
            >
              {v.title}
            </h4>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '0.8rem',
                lineHeight: 1.55,
                color: 'hsl(var(--text-secondary))',
              }}
            >
              {v.description}
            </p>
          </div>
        ))}
      </div>

      {/* Measurement badge */}
      <div
        style={{
          marginTop: '1.5rem',
          textAlign: 'center' as const,
        }}
      >
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            color: 'hsl(var(--text-secondary) / 0.4)',
          }}
        >
          {columnCount} column{columnCount !== 1 ? 's' : ''} at{' '}
          {Math.round(columnWidth)}px &middot; Pretext balanced distribution
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Strata Mode
// ---------------------------------------------------------------------------

function StrataMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const bodyFont = "15px 'Montserrat', sans-serif";
  const lineHeight = 24;

  // Crystal formation positions (index, xOffset, rotation)
  const formations = [
    { paragraphIdx: 0, side: 'right' as const, xOffset: 20, rotation: 8 },
    { paragraphIdx: 1, side: 'left' as const, xOffset: 15, rotation: -12 },
    { paragraphIdx: 3, side: 'right' as const, xOffset: 25, rotation: 5 },
  ];

  // Layer tones: progression from dark to light
  const layerTones = [
    'hsl(var(--bg-primary))',
    'hsl(var(--bg-primary) / 0.95)',
    'hsl(var(--bg-card) / 0.3)',
    'hsl(var(--bg-card) / 0.5)',
    'hsl(var(--bg-card) / 0.7)',
  ];

  formations.reduce<Record<number, number>>((acc, f) => {
    acc[f.paragraphIdx] = containerWidth - 100;
    return acc;
  }, {});

  // Measure paragraphs
  const measurements = EDITORIAL_CONTENT.paragraphs.map((p, i) => {
    const hasFormation = formations.find(f => f.paragraphIdx === i);
    const w = hasFormation ? containerWidth - 120 : containerWidth - 40;
    return usePretext({
      text: p,
      font: bodyFont,
      maxWidth: Math.max(100, w),
      lineHeight,
      enabled: true,
    });
  });

  return (
    <div ref={containerRef}>
      {/* Title */}
      <div style={{ textAlign: 'center' as const, marginBottom: '2rem' }}>
        <h3
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
            color: 'hsl(var(--text-primary))',
          }}
        >
          Geological Strata
        </h3>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.8rem',
            color: 'hsl(var(--text-secondary))',
            marginTop: '0.3rem',
          }}
        >
          Content flows through layers, wrapping around crystal formations
        </p>
      </div>

      {/* Layers */}
      <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
        {EDITORIAL_CONTENT.paragraphs.map((para, i) => {
          const formation = formations.find(f => f.paragraphIdx === i);
          const h = measurements[i]?.height ?? 100;

          return (
            <div key={i}>
              {/* Layer band */}
              <div
                style={{
                  background: layerTones[i % layerTones.length],
                  padding: '1.5rem 1.25rem',
                  position: 'relative' as const,
                  minHeight: `${Math.max(80, h + 40)}px`,
                }}
              >
                {/* Crystal formation */}
                {formation && (
                  <div
                    style={{
                      position: 'absolute' as const,
                      top: '-30px',
                      ...(formation.side === 'right'
                        ? { right: `${formation.xOffset}px` }
                        : { left: `${formation.xOffset}px` }),
                      zIndex: 2,
                      opacity: 0.85,
                    }}
                  >
                    <CrystalFormation
                      width={60}
                      height={80}
                      rotation={formation.rotation}
                    />
                  </div>
                )}

                {/* Text */}
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                    color: 'hsl(var(--text-primary) / 0.8)',
                    maxWidth: formation ? `calc(100% - 90px)` : '100%',
                    ...(formation?.side === 'left'
                      ? { marginLeft: '90px' }
                      : {}),
                  }}
                >
                  {para}
                </div>

                {/* Layer label */}
                <span
                  style={{
                    position: 'absolute' as const,
                    right: '12px',
                    bottom: '6px',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.55rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase' as const,
                    color: 'hsl(var(--text-secondary) / 0.3)',
                  }}
                >
                  Layer {i + 1}
                </span>
              </div>

              {/* Wavy separator between layers */}
              {i < EDITORIAL_CONTENT.paragraphs.length - 1 && (
                <WaveySeparator />
              )}
            </div>
          );
        })}
      </div>

      {/* Measurement note */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center' as const }}>
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            color: 'hsl(var(--text-secondary) / 0.4)',
          }}
        >
          Variable-width text wrapping &middot; Pretext per-layer measurement
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cartographer Mode
// ---------------------------------------------------------------------------

function CartographerMode() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Marginalia annotations
  const marginalia = [
    { text: 'Ethically sourced', y: 85, side: 'left' as const },
    { text: '14k gold-filled', y: 210, side: 'right' as const },
    { text: 'Handcrafted in Canada', y: 340, side: 'left' as const },
    { text: 'One of a kind', y: 460, side: 'right' as const },
  ];

  // Canvas title renderer
  const drawTitle = useCallback((renderer: CanvasRenderer) => {
    const { ctx, width, height } = renderer;
    ctx.clearRect(0, 0, width, height);

    // Draw title text
    ctx.font = "36px 'Alex Brush', cursive";
    ctx.fillStyle = 'hsl(var(--gold-medium))';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(EDITORIAL_CONTENT.title, width / 2, height / 2);

    // Subtle underline flourish
    const textWidth = ctx.measureText(EDITORIAL_CONTENT.title).width;
    const startX = (width - textWidth) / 2;
    const endX = startX + textWidth;
    const lineY = height / 2 + 22;

    ctx.beginPath();
    ctx.moveTo(startX, lineY);
    ctx.bezierCurveTo(
      startX + textWidth * 0.3,
      lineY + 6,
      endX - textWidth * 0.3,
      lineY + 6,
      endX,
      lineY
    );
    ctx.strokeStyle = 'hsl(var(--gold-medium) / 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, []);

  const titleCanvasRef = useCanvasRenderer(drawTitle, [], {
    width: 500,
    height: 80,
  });

  return (
    <div
      ref={containerRef}
      style={{
        background: 'hsl(40, 30%, 90%)',
        borderRadius: '4px',
        border: '2px dashed hsl(35, 40%, 75%)',
        padding: '2rem',
        position: 'relative' as const,
        fontFamily: "'Montserrat', sans-serif",
        color: 'hsl(30, 25%, 25%)',
        overflow: 'hidden',
      }}
    >
      {/* Corner decorations */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => (
        <div
          key={corner}
          style={{
            position: 'absolute' as const,
            ...(corner.includes('top') ? { top: '8px' } : { bottom: '8px' }),
            ...(corner.includes('left') ? { left: '8px' } : { right: '8px' }),
            width: '16px',
            height: '16px',
            borderTop: corner.includes('top')
              ? '1.5px solid hsl(35, 50%, 55%)'
              : 'none',
            borderBottom: corner.includes('bottom')
              ? '1.5px solid hsl(35, 50%, 55%)'
              : 'none',
            borderLeft: corner.includes('left')
              ? '1.5px solid hsl(35, 50%, 55%)'
              : 'none',
            borderRight: corner.includes('right')
              ? '1.5px solid hsl(35, 50%, 55%)'
              : 'none',
          }}
        />
      ))}

      {/* Canvas-rendered title */}
      <div
        style={{
          textAlign: 'center' as const,
          marginBottom: '1.5rem',
        }}
      >
        <canvas
          ref={titleCanvasRef}
          style={{
            maxWidth: '100%',
            height: '80px',
            display: 'block',
            margin: '0 auto',
          }}
        />
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.8rem',
            fontStyle: 'italic' as const,
            color: 'hsl(30, 20%, 45%)',
            marginTop: '0.25rem',
          }}
        >
          {EDITORIAL_CONTENT.subtitle}
        </p>
      </div>

      {/* Content column with marginalia */}
      <div style={{ position: 'relative' as const }}>
        {/* Left marginalia */}
        {marginalia
          .filter(m => m.side === 'left')
          .map((m, i) => (
            <div
              key={`left-${i}`}
              style={{
                position: 'absolute' as const,
                left: '-8px',
                top: `${m.y}px`,
                transform: 'translateX(-100%)',
                textAlign: 'right' as const,
                paddingRight: '12px',
              }}
            >
              <SmallCrystalIllustration size={20} />
              <span
                style={{
                  display: 'block',
                  fontFamily: "'Alex Brush', cursive",
                  fontSize: '0.7rem',
                  color: 'hsl(35, 40%, 45%)',
                  whiteSpace: 'nowrap' as const,
                  marginTop: '2px',
                }}
              >
                {m.text}
              </span>
            </div>
          ))}

        {/* Right marginalia */}
        {marginalia
          .filter(m => m.side === 'right')
          .map((m, i) => (
            <div
              key={`right-${i}`}
              style={{
                position: 'absolute' as const,
                right: '-8px',
                top: `${m.y}px`,
                transform: 'translateX(100%)',
                paddingLeft: '12px',
              }}
            >
              <SmallCrystalIllustration size={20} />
              <span
                style={{
                  display: 'block',
                  fontFamily: "'Alex Brush', cursive",
                  fontSize: '0.7rem',
                  color: 'hsl(35, 40%, 45%)',
                  whiteSpace: 'nowrap' as const,
                  marginTop: '2px',
                }}
              >
                {m.text}
              </span>
            </div>
          ))}

        {/* Annotation lines */}
        <AnnotationLine x1={0} y1={95} x2={-70} y2={95} />
        <AnnotationLine x1={400} y1={220} x2={470} y2={220} />
        <AnnotationLine x1={0} y1={350} x2={-70} y2={350} />
        <AnnotationLine x1={400} y1={470} x2={470} y2={470} />

        {/* Central content column */}
        <div
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            padding: '0 2rem',
          }}
        >
          {EDITORIAL_CONTENT.paragraphs.map((para, i) => (
            <div key={i} style={{ marginBottom: '1.25rem' }}>
              {/* Small crystal ornament between paragraphs */}
              {i > 0 && (
                <div
                  style={{
                    textAlign: 'center' as const,
                    margin: '1rem 0',
                    opacity: 0.4,
                  }}
                >
                  <SmallCrystalIllustration size={18} />
                </div>
              )}

              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '0.875rem',
                  lineHeight: 1.75,
                  color: 'hsl(30, 25%, 25%)',
                  textAlign: 'justify' as const,
                  textIndent: i > 0 ? '1.5em' : undefined,
                }}
              >
                {i === 0 && (
                  <span
                    style={{
                      float: 'left' as const,
                      fontFamily: "'Libre Baskerville', serif",
                      fontSize: '2.8rem',
                      lineHeight: 0.85,
                      color: 'hsl(25, 50%, 40%)',
                      marginRight: '0.1em',
                      marginTop: '0.05em',
                    }}
                  >
                    {para.charAt(0)}
                  </span>
                )}
                {i === 0 ? para.slice(1) : para}
              </p>
            </div>
          ))}

          {/* Pull quote in cartographer style */}
          <div
            style={{
              borderTop: '1px solid hsl(35, 40%, 70%)',
              borderBottom: '1px solid hsl(35, 40%, 70%)',
              padding: '1rem 0',
              margin: '1.5rem 0',
              textAlign: 'center' as const,
            }}
          >
            <SmallCrystalIllustration size={24} />
            <p
              style={{
                fontFamily: "'Alex Brush', cursive",
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: 'hsl(25, 45%, 38%)',
                marginTop: '0.75rem',
                fontStyle: 'italic' as const,
              }}
            >
              &ldquo;{EDITORIAL_CONTENT.pullQuote}&rdquo;
            </p>
          </div>

          {/* Values as small explorer notes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              marginTop: '1.5rem',
            }}
          >
            {EDITORIAL_CONTENT.values.map((v, i) => (
              <div
                key={i}
                style={{
                  border: '1px dashed hsl(35, 35%, 72%)',
                  borderRadius: '3px',
                  padding: '0.6rem 0.75rem',
                }}
              >
                <h5
                  style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontSize: '0.75rem',
                    color: 'hsl(25, 45%, 38%)',
                    marginBottom: '0.2rem',
                  }}
                >
                  {v.title}
                </h5>
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.7rem',
                    lineHeight: 1.5,
                    color: 'hsl(30, 20%, 40%)',
                  }}
                >
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cartographer attribution */}
      <div
        style={{
          textAlign: 'center' as const,
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px dashed hsl(35, 35%, 72%)',
        }}
      >
        <span
          style={{
            fontFamily: "'Alex Brush', cursive",
            fontSize: '0.75rem',
            color: 'hsl(35, 35%, 55%)',
          }}
        >
          Canvas-rendered title &middot; Explorer journal layout &middot;
          Pretext annotation engine
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function StoryFlows({ onVisible }: StoryFlowsProps) {
  const [mode, setMode] = useState<StoryMode>('journal');
  const { sectionRef, isVisible } = useIntersectionSection(0.1);
  const fontsReady = useFontReady([
    'Libre Baskerville',
    'Montserrat',
    'Alex Brush',
  ]);

  // Fire onVisible when section enters viewport
  const hasFired = useRef(false);
  useEffect(() => {
    if (isVisible && !hasFired.current) {
      hasFired.current = true;
      onVisible();
    }
  }, [isVisible, onVisible]);

  return (
    <section
      ref={sectionRef}
      id="section-story-flows"
      style={{
        padding: '4rem 1.5rem',
        maxWidth: '900px',
        margin: '0 auto',
        minHeight: '60vh',
      }}
    >
      <SectionHeader />
      <ModeSelector active={mode} onChange={setMode} />

      {/* Gate behind font readiness */}
      {!fontsReady ? (
        <div
          style={{
            textAlign: 'center' as const,
            padding: '3rem 0',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.8rem',
            color: 'hsl(var(--text-secondary) / 0.5)',
          }}
        >
          Loading typography...
        </div>
      ) : !isVisible ? null : (
        <>
          {mode === 'journal' && <GemstoneJournal />}
          {mode === 'strata' && <StrataMode />}
          {mode === 'cartographer' && <CartographerMode />}
        </>
      )}
    </section>
  );
}
