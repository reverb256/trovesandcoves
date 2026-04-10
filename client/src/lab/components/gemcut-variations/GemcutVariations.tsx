/**
 * Gemcut Variations — Section 6: Variable-width text wrapping into shapes
 *
 * Uses Pretext's layoutNextLine() to wrap text into a diamond/gem shape
 * where each row has a different width. The text literally takes the form
 * of a crystal, computed entirely by Pretext with zero DOM reads.
 *
 * Three cut shapes:
 *  - Brilliant Cut: Classic diamond shape
 *  - Emerald Cut: Rectangular with beveled corners
 *  - Pear Drop: Teardrop silhouette
 */
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  prepareWithSegments,
  layoutNextLine,
  type LayoutCursor,
} from '@chenglou/pretext';
import { useFontReady } from '../../hooks/useFontReady';
import { useIntersectionSection } from '../../hooks/useIntersectionSection';
import {
  useCanvasRenderer,
  type CanvasRenderer,
} from '../../hooks/useCanvasRenderer';
import { getCached, setCached, getCacheKey } from '../../utils/pretextCache';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CutShape = 'brilliant' | 'emerald' | 'pear';
interface GemcutVariationsProps {
  onVisible: () => void;
}
interface RowDef {
  maxWidth: number;
  label: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FONT_BODY = "'Montserrat', sans-serif";
const TEXT_FONT = "15px 'Montserrat', sans-serif";
const LABEL_FONT = "11px 'Montserrat', sans-serif";
const LINE_HEIGHT = 20;

const TEXT_CONTENT = [
  'At Troves & Coves, every crystal carries a story written over millions of years',
  'in the slow alchemy of the earth. Our mission is to honor that story by pairing',
  'each stone with craftsmanship that lets its natural beauty speak.',
  'Founded in Winnipeg, Manitoba, our studio is where geology meets artistry.',
  'We source genuine crystals and gemstones from ethical suppliers worldwide,',
  'selecting each stone for its exceptional clarity, color, and character.',
  'No two pieces are alike — and that is precisely the point.',
  'Our process begins with material selection. We work primarily with 14k',
  'gold-filled components, chosen for their durability and lasting beauty.',
  'Unlike gold plating, gold-filled jewelry can last a lifetime with proper',
  'care, making each piece an investment in everyday elegance.',
  'The design phase is where intuition meets technique. Each piece is',
  'thoughtfully planned to balance elegance with everyday wearability —',
  'jewelry that makes a statement without demanding one. We believe',
  'the best accessories enhance your presence without overwhelming it.',
  'Finally, every necklace, bracelet, and earring is carefully assembled',
  'by hand in our Winnipeg studio. This hands-on approach ensures',
  'attention to detail that machines simply cannot replicate.',
].join(' ');

const MODES: { key: CutShape; label: string; icon: string }[] = [
  { key: 'brilliant', label: 'Brilliant Cut', icon: '◇' },
  { key: 'emerald', label: 'Emerald Cut', icon: ' ▢' },
  { key: 'pear', label: 'Pear Drop', icon: ' ◁' },
];

// ---------------------------------------------------------------------------
// Shape generators — return array of { maxWidth, label } per row
// ---------------------------------------------------------------------------

function brilliantCut(rows: number, maxWidth: number): RowDef[] {
  const mid = Math.floor(rows / 2);
  return Array.from({ length: rows }, (_, i) => {
    const t = i <= mid ? i / mid : (rows - 1 - i) / mid;
    return {
      maxWidth: Math.max(40, Math.round(maxWidth * t * 0.95)),
      label: `${Math.round(maxWidth * t * 0.95)}px`,
    };
  });
}

function emeraldCut(rows: number, maxWidth: number): RowDef[] {
  const cornerRows = Math.max(2, Math.floor(rows * 0.15));
  return Array.from({ length: rows }, (_, i) => {
    let w = maxWidth;
    if (i < cornerRows) {
      w = maxWidth * 0.6 + (maxWidth * 0.4 * i) / cornerRows;
    } else if (i >= rows - cornerRows) {
      w = maxWidth * 0.6 + (maxWidth * 0.4 * (rows - 1 - i)) / cornerRows;
    }
    return {
      maxWidth: Math.max(60, Math.round(w)),
      label: `${Math.round(w)}px`,
    };
  });
}

function pearDrop(rows: number, maxWidth: number): RowDef[] {
  return Array.from({ length: rows }, (_, i) => {
    const t = i / (rows - 1);
    // Wider at top, narrow at bottom like a pear/teardrop
    const curve = Math.pow(1 - t, 0.6);
    const w = maxWidth * (0.15 + curve * 0.85);
    return {
      maxWidth: Math.max(40, Math.round(w)),
      label: `${Math.round(w)}px`,
    };
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GemcutVariations({ onVisible }: GemcutVariationsProps) {
  const [shape, setShape] = useState<CutShape>('brilliant');
  const fontsReady = useFontReady(['Montserrat']);
  const { sectionRef, isVisible } = useIntersectionSection(0.1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(600);

  // Fire onVisible
  const hasFired = useRef(false);
  useEffect(() => {
    if (isVisible && !hasFired.current) {
      hasFired.current = true;
      onVisible();
    }
  }, [isVisible, onVisible]);

  // Measure width
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      setCanvasWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const maxShapeWidth = Math.min(canvasWidth * 0.85, 560);
  const rowCount = 22;

  // Generate shape rows
  const rows = useMemo(() => {
    if (shape === 'brilliant') return brilliantCut(rowCount, maxShapeWidth);
    if (shape === 'emerald') return emeraldCut(rowCount, maxShapeWidth);
    return pearDrop(rowCount, maxShapeWidth);
  }, [shape, maxShapeWidth]);

  // Use layoutNextLine to wrap text into variable-width rows
  const wrappedLines = useMemo(() => {
    if (!fontsReady || !TEXT_CONTENT) return [];

    try {
      const key = getCacheKey(TEXT_CONTENT, TEXT_FONT);
      let prepared = getCached(key) as
        | ReturnType<typeof prepareWithSegments>
        | undefined;
      if (!prepared) {
        prepared = prepareWithSegments(TEXT_CONTENT, TEXT_FONT);
        setCached(key, prepared);
      }

      const lines: Array<{ text: string; width: number; rowWidth: number }> =
        [];
      let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

      for (const row of rows) {
        const result = layoutNextLine(prepared, cursor, row.maxWidth);
        if (!result) break;
        lines.push({
          text: result.text,
          width: result.width,
          rowWidth: row.maxWidth,
        });
        cursor = result.end;

        // Check if we've consumed all text
        if (cursor.segmentIndex === 0 && cursor.graphemeIndex === 0) break;
      }

      return lines;
    } catch {
      return [];
    }
  }, [fontsReady, rows]);

  // Canvas draw
  const drawFn = useCallback(
    (renderer: CanvasRenderer) => {
      const { ctx, width, height } = renderer;
      ctx.clearRect(0, 0, width, height);
      if (!fontsReady || wrappedLines.length === 0) return;

      ctx.textBaseline = 'top';

      const totalHeight = rows.length * LINE_HEIGHT;
      const startY = Math.max(10, (height - totalHeight) / 2);

      for (let i = 0; i < wrappedLines.length; i++) {
        const line = wrappedLines[i];
        const rowDef = rows[i];
        const y = startY + i * LINE_HEIGHT;

        // Center the line within its allocated width
        const x = (width - rowDef.maxWidth) / 2;

        // Draw row boundary (faint)
        ctx.strokeStyle = 'hsl(var(--accent-vibrant) / 0.08)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, rowDef.maxWidth, LINE_HEIGHT);

        // Draw width label
        ctx.font = LABEL_FONT;
        ctx.fillStyle = 'hsl(var(--text-secondary) / 0.25)';
        ctx.textAlign = 'right';
        ctx.fillText(rowDef.label, x - 6, y + 4);

        // Draw the text
        ctx.font = TEXT_FONT;
        ctx.textAlign = 'left';

        // Gradient fill per line based on position in the shape
        const t = i / wrappedLines.length;
        const hue = 170 + t * 40;
        const lightness = 75 + (rowDef.maxWidth / maxShapeWidth) * 10;
        ctx.fillStyle = `hsl(${hue}, 40%, ${lightness}%)`;
        ctx.fillText(line.text, x, y + 2);

        // Tiny width indicator dot at line end
        ctx.beginPath();
        ctx.arc(x + line.width + 3, y + LINE_HEIGHT / 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'hsl(var(--accent-vibrant) / 0.4)';
        ctx.fill();
      }

      ctx.textAlign = 'left';
    },
    [fontsReady, wrappedLines, rows, maxShapeWidth]
  );

  const canvasHeight = rows.length * LINE_HEIGHT + 60;
  const canvasRef = useCanvasRenderer(drawFn, [drawFn], {
    height: canvasHeight,
  });

  // Count chars consumed
  const totalChars = TEXT_CONTENT.length;
  const consumedChars = wrappedLines.reduce((sum, l) => sum + l.text.length, 0);

  return (
    <section
      id="section-gemcut-variations"
      ref={sectionRef}
      style={{ padding: '80px 0', minHeight: '500px' }}
    >
      {/* Section Header */}
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
          marginBottom: 40,
        }}
      >
        <div
          style={{
            fontSize: 28,
            marginBottom: 8,
            color: 'hsl(var(--gold-medium))',
          }}
        >
          ⬡
        </div>
        <h2
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: 32,
            fontWeight: 700,
            color: 'hsl(var(--text-primary))',
            margin: '0 0 12px 0',
          }}
        >
          Gemcut Variations
        </h2>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 16,
            color: 'hsl(var(--text-primary) / 0.7)',
            margin: 0,
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}
        >
          Pretext's{' '}
          <code
            style={{
              color: 'hsl(var(--accent-vibrant))',
              fontFamily: 'monospace',
              fontSize: 14,
            }}
          >
            layoutNextLine()
          </code>{' '}
          wraps text row-by-row into variable-width containers — forming a
          crystal silhouette. Each line gets a different maxWidth, computed
          independently.
        </p>
      </div>

      {/* Mode Selector */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {MODES.map(m => {
          const active = shape === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setShape(m.key)}
              style={{
                fontFamily: FONT_BODY,
                fontSize: 13,
                fontWeight: active ? 700 : 400,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '10px 20px',
                border: active
                  ? '1px solid hsl(var(--gold-medium))'
                  : '1px solid hsl(var(--text-primary) / 0.15)',
                borderRadius: 4,
                backgroundColor: active
                  ? 'hsl(var(--gold-medium) / 0.1)'
                  : 'transparent',
                color: active
                  ? 'hsl(var(--gold-medium))'
                  : 'hsl(var(--text-primary) / 0.6)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              <span style={{ marginRight: 8, fontSize: 16 }}>{m.icon}</span>
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Canvas */}
      <div
        ref={wrapperRef}
        style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}
      >
        {isVisible && (
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              width: '100%',
              height: canvasHeight,
              borderRadius: 8,
            }}
          />
        )}
      </div>

      {/* Stats */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 24,
          fontFamily: FONT_BODY,
          fontSize: 12,
          color: 'hsl(var(--text-secondary) / 0.5)',
          letterSpacing: '0.1em',
        }}
      >
        {wrappedLines.length} rows &middot; {consumedChars}/{totalChars} chars
        &middot; variable-width Pretext wrapping
      </div>
    </section>
  );
}
