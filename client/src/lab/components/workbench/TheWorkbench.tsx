/**
 * Section 4: The Workbench — Interactive Pretext Playground
 *
 * A split-view studio where users manipulate Pretext parameters and see
 * results in real-time across three synchronized views:
 * DOM Render, Canvas Render, and Debug Overlay.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { usePretext, usePretextLines } from '../../hooks/usePretext';
// LineData is used implicitly through usePretextLines return type
import { useFontReady } from '../../hooks/useFontReady';
import {
  useCanvasRenderer,
  type CanvasRenderer,
} from '../../hooks/useCanvasRenderer';
import { useIntersectionSection } from '../../hooks/useIntersectionSection';
import { cacheSize } from '../../utils/pretextCache';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TheWorkbenchProps {
  onVisible: () => void;
}

type Mode = 'height' | 'lines';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_TEXT =
  'The crystal catches light in ways that defy ordinary geometry. \u6625\u5929\u5230\u4e86 \ud83c\udf3f';

const FONT_OPTIONS: ReadonlyArray<{
  label: string;
  value: string;
}> = [
  { label: 'Baskerville', value: "'Libre Baskerville', serif" },
  { label: 'Montserrat', value: "'Montserrat', sans-serif" },
  { label: 'Alex Brush', value: "'Alex Brush', cursive" },
];

const PRESETS = {
  short: { text: 'Crystal Elegance', fontSize: 32 },
  cjk: {
    text: '\u6625\u5929\u5230\u4e86 \u82b1\u5f00\u65f6\u8282 \u6c34\u6676\u4e4b\u7f8e Crystal Beauty \u6625\u5929\u5230\u4e86',
    fontSize: 24,
  },
  emoji: {
    text: '\ud83d\udc8e \u2728 \ud83d\udd2e Crystal magic \u2726 ethereal beauty \ud83c\udf3f nature \ud83e\udea8',
    fontSize: 28,
  },
  long: {
    text: 'At Troves & Coves, we believe that every crystal carries a story written over millions of years in the slow alchemy of the earth. Our mission is to honor that story by pairing each stone with craftsmanship that lets its natural beauty speak. Founded in Winnipeg, Manitoba.',
    fontSize: 20,
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function buildFont(family: string, size: number): string {
  return `${size}px ${family}`;
}

function measureDOMHeight(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number
): { height: number; time: number } {
  const t0 = performance.now();
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.left = '-9999px';
  div.style.top = '-9999px';
  div.style.width = `${maxWidth}px`;
  div.style.font = font;
  div.style.lineHeight = `${lineHeight}`;
  div.style.whiteSpace = 'pre-wrap';
  div.style.overflowWrap = 'break-word';
  div.textContent = text;
  document.body.appendChild(div);
  const height = div.getBoundingClientRect().height;
  document.body.removeChild(div);
  const time = performance.now() - t0;
  return { height, time };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TheWorkbench({ onVisible }: TheWorkbenchProps) {
  const { sectionRef, isVisible } = useIntersectionSection(0.05);

  // Notify parent when visible
  useEffect(() => {
    if (isVisible) onVisible();
  }, [isVisible, onVisible]);

  return (
    <section
      id="section-the-workbench"
      ref={sectionRef}
      className="relative py-20 px-4 md:px-8"
      style={{ minHeight: '80vh' }}
    >
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span
            className="text-2xl"
            style={{ color: 'hsl(var(--accent-vibrant))' }}
          >
            &#9881;
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{
              fontFamily: "'Libre Baskerville', serif",
              color: 'hsl(var(--text-primary))',
            }}
          >
            The Workbench
          </h2>
        </div>
        <p
          className="text-sm md:text-base max-w-xl mx-auto leading-relaxed"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: 'hsl(var(--text-secondary))',
          }}
        >
          Manipulate Pretext parameters and watch the results update across DOM,
          Canvas, and Debug views in real-time.
        </p>
      </header>

      {/* Content — only mount heavy bits when visible */}
      {isVisible && <WorkbenchContent />}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Inner Content (lazy-mounted)                                       */
/* ------------------------------------------------------------------ */

function WorkbenchContent() {
  // State: controls
  const [text, setText] = useState(DEFAULT_TEXT);
  const [fontFamily, setFontFamily] = useState<string>(FONT_OPTIONS[0].value);
  const [fontSize, setFontSize] = useState(24);
  const [containerWidth, setContainerWidth] = useState(500);
  const [lineHeight, setLineHeight] = useState(1.4);
  const [mode, setMode] = useState<Mode>('height');

  // Derived font string
  const font = buildFont(fontFamily, fontSize);
  const lineHeightPx = fontSize * lineHeight;

  // Font readiness gate
  const fontReady = useFontReady([
    'Libre Baskerville',
    'Montserrat',
    'Alex Brush',
  ]);

  // Pretext hooks
  const measurement = usePretext({
    text,
    font,
    maxWidth: containerWidth,
    lineHeight: lineHeightPx,
    enabled: fontReady,
  });

  const lineData = usePretextLines(
    text,
    font,
    containerWidth,
    lineHeightPx,
    fontReady
  );

  // DOM comparison measurement
  const [domResult, setDomResult] = useState<{
    height: number;
    time: number;
  } | null>(null);

  useEffect(() => {
    if (!fontReady) return;
    const r = measureDOMHeight(text, font, containerWidth, lineHeightPx);
    setDomResult(r);
  }, [text, font, containerWidth, lineHeightPx, fontReady]);

  // Canvas refs for drawing
  const domRenderRef = useRef<HTMLDivElement>(null);
  const [domMeasured, setDomMeasured] = useState<{
    height: number;
    lineCount: number;
  } | null>(null);

  // Measure actual DOM height from the render box
  useEffect(() => {
    const el = domRenderRef.current;
    if (!el) return;
    const firstChild = el.firstElementChild as HTMLElement | null;
    if (!firstChild) return;
    const ro = new ResizeObserver(() => {
      setDomMeasured({
        height: firstChild.offsetHeight,
        lineCount: Math.round(firstChild.offsetHeight / lineHeightPx),
      });
    });
    ro.observe(firstChild);
    return () => ro.disconnect();
  }, [lineHeightPx]);

  // Canvas render (View 2)
  const canvasDrawFn = useCallback(
    (renderer: CanvasRenderer) => {
      const { ctx, width, height: canvasHeight } = renderer;
      if (!lineData || lineData.lines.length === 0) return;

      ctx.clearRect(0, 0, width, canvasHeight);
      ctx.font = font;

      for (const line of lineData.lines) {
        // Draw each character with subtle teal color
        for (const seg of line.segments) {
          ctx.fillStyle = 'hsl(176 42% 39%)';
          ctx.fillText(seg.text, seg.x, line.y + fontSize);
        }
      }
    },
    [lineData, font, fontSize]
  );

  const canvasRef = useCanvasRenderer(
    canvasDrawFn,
    [lineData, font, fontSize],
    {
      width: containerWidth,
      height: lineData
        ? Math.max(
            lineData.lines[lineData.lines.length - 1].y + lineHeightPx + 20,
            60
          )
        : 60,
    }
  );

  // Debug canvas (View 3)
  const debugDrawFn = useCallback(
    (renderer: CanvasRenderer) => {
      const { ctx, width, height: canvasHeight } = renderer;
      if (!lineData || lineData.lines.length === 0) return;

      ctx.clearRect(0, 0, width, canvasHeight);
      ctx.font = font;

      for (const line of lineData.lines) {
        // Character bounding boxes — use Pretext-computed segment positions
        for (const seg of line.segments) {
          // Faint bounding rectangle
          ctx.strokeStyle = 'hsl(var(--accent-vibrant) / 0.25)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(line.x + seg.x, line.y, seg.width, lineHeightPx);

          // Draw character faintly
          ctx.fillStyle = 'hsl(var(--text-secondary) / 0.3)';
          ctx.fillText(seg.text, line.x + seg.x, line.y + fontSize);
        }

        // Line break position — red dot at end
        ctx.beginPath();
        ctx.arc(
          line.x + line.width + 4,
          line.y + lineHeightPx / 2,
          3,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'hsl(0 80% 55%)';
        ctx.fill();

        // Width indicator line
        ctx.strokeStyle = 'hsl(var(--gold-medium) / 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(0, line.y + lineHeightPx - 0.5);
        ctx.lineTo(line.width, line.y + lineHeightPx - 0.5);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Comparison text at bottom
      const pretextHeight =
        lineData.lines[lineData.lines.length - 1].y + lineHeightPx;
      const domH = domResult?.height ?? 0;
      const delta = Math.abs(pretextHeight - domH).toFixed(1);

      ctx.fillStyle = 'hsl(var(--text-secondary) / 0.6)';
      ctx.font = `11px 'Montserrat', sans-serif`;
      ctx.fillText(
        `Pretext height: ${pretextHeight.toFixed(1)}px  |  DOM height: ${domH.toFixed(1)}px  |  Delta: ${delta}px`,
        4,
        canvasHeight - 6
      );
    },
    [lineData, font, fontSize, lineHeightPx, domResult]
  );

  const debugCanvasRef = useCanvasRenderer(
    debugDrawFn,
    [lineData, font, fontSize, domResult],
    {
      width: containerWidth,
      height: lineData
        ? Math.max(
            lineData.lines[lineData.lines.length - 1].y + lineHeightPx + 40,
            80
          )
        : 80,
    }
  );

  // Cache size
  const [entries, setEntries] = useState(0);
  useEffect(() => {
    setEntries(cacheSize());
  }, [text, fontFamily, fontSize, containerWidth, lineHeight]);

  // Loading gate
  if (!fontReady) {
    return (
      <div className="flex items-center justify-center py-20">
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: 'hsl(var(--text-secondary))',
          }}
        >
          Loading fonts...
        </p>
      </div>
    );
  }

  /* ---- Computed readout values ---- */
  const pretextTime =
    (measurement?.preparedTime ?? 0) + (measurement?.layoutTime ?? 0);
  const domTime = domResult?.time ?? 0;
  const speedMultiplier =
    domTime > 0 ? (domTime / (pretextTime || 0.001)).toFixed(1) : '-';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ---- LEFT PANEL: Controls ---- */}
        <div
          className="lg:w-[300px] shrink-0 rounded-lg p-5 space-y-5"
          style={{
            backgroundColor: 'hsl(var(--bg-card))',
            border: '1px solid hsl(var(--accent-vibrant) / 0.12)',
          }}
        >
          {/* Custom Text */}
          <ControlGroup label="Custom Text">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              className="w-full rounded px-3 py-2 text-sm resize-y"
              style={{
                backgroundColor: 'hsl(var(--bg-primary))',
                color: 'hsl(var(--text-primary))',
                border: '1px solid hsl(var(--accent-vibrant) / 0.2)',
                fontFamily: "'Montserrat', sans-serif",
                lineHeight: 1.5,
              }}
            />
          </ControlGroup>

          {/* Font Family */}
          <ControlGroup label="Font Family">
            <div className="flex gap-1.5 flex-wrap">
              {FONT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFontFamily(opt.value)}
                  className="px-3 py-1 rounded-full text-xs transition-colors"
                  style={{
                    fontFamily: opt.value,
                    backgroundColor:
                      fontFamily === opt.value
                        ? 'hsl(var(--accent-vibrant))'
                        : 'transparent',
                    color:
                      fontFamily === opt.value
                        ? 'hsl(var(--bg-primary))'
                        : 'hsl(var(--text-secondary))',
                    border: `1px solid ${
                      fontFamily === opt.value
                        ? 'hsl(var(--accent-vibrant))'
                        : 'hsl(var(--accent-vibrant) / 0.25)'
                    }`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </ControlGroup>

          {/* Font Size */}
          <ControlGroup label={`Font Size: ${fontSize}px`}>
            <input
              type="range"
              min={12}
              max={72}
              value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'hsl(var(--accent-vibrant))' }}
            />
          </ControlGroup>

          {/* Container Width */}
          <ControlGroup label={`Container Width: ${containerWidth}px`}>
            <input
              type="range"
              min={200}
              max={800}
              value={containerWidth}
              onChange={e => setContainerWidth(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'hsl(var(--accent-vibrant))' }}
            />
          </ControlGroup>

          {/* Line Height */}
          <ControlGroup label={`Line Height: ${lineHeight.toFixed(1)}`}>
            <input
              type="range"
              min={1.0}
              max={2.5}
              step={0.1}
              value={lineHeight}
              onChange={e => setLineHeight(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'hsl(var(--accent-vibrant))' }}
            />
          </ControlGroup>

          {/* Mode Toggle */}
          <ControlGroup label="Mode">
            <div className="flex gap-1.5">
              <ModeButton
                active={mode === 'height'}
                onClick={() => setMode('height')}
              >
                Height Measurement
              </ModeButton>
              <ModeButton
                active={mode === 'lines'}
                onClick={() => setMode('lines')}
              >
                Line Layout
              </ModeButton>
            </div>
          </ControlGroup>

          {/* Presets */}
          <ControlGroup label="Presets">
            <div className="flex gap-1.5 flex-wrap">
              {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map(
                key => (
                  <button
                    key={key}
                    onClick={() => {
                      setText(PRESETS[key].text);
                      setFontSize(PRESETS[key].fontSize);
                    }}
                    className="px-2.5 py-1 rounded text-xs transition-colors"
                    style={{
                      color: 'hsl(var(--accent-vibrant))',
                      border: '1px solid hsl(var(--accent-vibrant) / 0.3)',
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    {key === 'short'
                      ? 'Short text'
                      : key === 'cjk'
                        ? 'CJK mixed'
                        : key === 'emoji'
                          ? 'Emoji heavy'
                          : 'Long paragraph'}
                  </button>
                )
              )}
            </div>
          </ControlGroup>
        </div>

        {/* ---- RIGHT PANEL: Preview Views ---- */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* View 1 — DOM Render */}
          <PreviewBox label="View 1 — DOM Render" badge="HTML">
            <div
              ref={domRenderRef}
              style={{ width: Math.min(containerWidth, 800) }}
            >
              <div
                style={{
                  width: Math.min(containerWidth, 800),
                  fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: `${lineHeight}`,
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  color: 'hsl(var(--text-primary))',
                }}
              >
                {text}
              </div>
            </div>
            <div
              className="mt-3 text-xs"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: 'hsl(var(--text-secondary))',
              }}
            >
              Measured height: {domMeasured?.height ?? '-'}px | Lines:{' '}
              {domMeasured?.lineCount ?? '-'}
            </div>
          </PreviewBox>

          {/* View 2 — Canvas Render */}
          <PreviewBox label="View 2 — Canvas Render" badge="Pretext">
            <canvas
              ref={canvasRef}
              style={{
                width: Math.min(containerWidth, 800),
                maxWidth: '100%',
                height: lineData
                  ? Math.max(
                      lineData.lines[lineData.lines.length - 1].y +
                        lineHeightPx +
                        20,
                      60
                    )
                  : 60,
              }}
            />
            <div
              className="mt-3 text-xs"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: 'hsl(var(--text-secondary))',
              }}
            >
              Pretext-computed height:{' '}
              {measurement ? `${measurement.height.toFixed(1)}px` : '-'} |
              Lines: {measurement?.lineCount ?? '-'}
            </div>
          </PreviewBox>

          {/* View 3 — Debug Overlay */}
          <PreviewBox label="View 3 — Debug Overlay" badge="Internal">
            <canvas
              ref={debugCanvasRef}
              style={{
                width: Math.min(containerWidth, 800),
                maxWidth: '100%',
                height: lineData
                  ? Math.max(
                      lineData.lines[lineData.lines.length - 1].y +
                        lineHeightPx +
                        40,
                      80
                    )
                  : 80,
              }}
            />
          </PreviewBox>
        </div>
      </div>

      {/* ---- STATUS BAR ---- */}
      <div
        className="mt-8 rounded-lg px-5 py-3 flex flex-wrap items-center justify-between gap-4"
        style={{
          backgroundColor: 'hsl(var(--bg-card))',
          border: '1px solid hsl(var(--accent-vibrant) / 0.1)',
        }}
      >
        <div
          className="flex flex-wrap items-center gap-5 text-xs"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: 'hsl(var(--text-secondary))',
          }}
        >
          <span>
            prepare(): {measurement?.preparedTime.toFixed(2) ?? '-'}ms
          </span>
          <span>layout(): {measurement?.layoutTime.toFixed(2) ?? '-'}ms</span>
          <span>DOM equivalent: {domResult?.time.toFixed(2) ?? '-'}ms</span>
        </div>
        <div
          className="flex items-center gap-5 text-xs"
          style={{
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          <span
            style={{
              color: 'hsl(var(--accent-vibrant))',
              fontWeight: 600,
            }}
          >
            Pretext is {speedMultiplier}x faster
          </span>
          <span style={{ color: 'hsl(var(--text-secondary))' }}>
            Cache: {entries} entries
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ControlGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block text-xs mb-1.5 tracking-wide"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          color: 'hsl(var(--text-secondary))',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 rounded text-xs transition-colors"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        backgroundColor: active
          ? 'hsl(var(--accent-vibrant) / 0.15)'
          : 'transparent',
        color: active
          ? 'hsl(var(--accent-vibrant))'
          : 'hsl(var(--text-secondary))',
        border: `1px solid ${
          active
            ? 'hsl(var(--accent-vibrant) / 0.4)'
            : 'hsl(var(--accent-vibrant) / 0.15)'
        }`,
      }}
    >
      {children}
    </button>
  );
}

function PreviewBox({
  label,
  badge,
  children,
}: {
  label: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        border: '1px solid hsl(var(--accent-vibrant) / 0.15)',
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          backgroundColor: 'hsl(var(--bg-card))',
          borderBottom: '1px solid hsl(var(--accent-vibrant) / 0.1)',
        }}
      >
        <span
          className="text-xs font-medium"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: 'hsl(var(--text-primary))',
          }}
        >
          {label}
        </span>
        <span
          className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: 'hsl(var(--accent-vibrant))',
            backgroundColor: 'hsl(var(--accent-vibrant) / 0.08)',
          }}
        >
          {badge}
        </span>
      </div>
      <div className="p-4 overflow-x-auto">{children}</div>
    </div>
  );
}
