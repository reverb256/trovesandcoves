/**
 * Section 1: Refracted Light
 * A canvas typography hero showcasing Pretext's per-line text layout API
 * through three crystal-themed effects: Crystallography, Liquid Crystal, Light Prism.
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { usePretextLines, type LineData } from '../../hooks/usePretext';
import { useFontReady } from '../../hooks/useFontReady';
import {
  useCanvasRenderer,
  type CanvasRenderer,
} from '../../hooks/useCanvasRenderer';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useIntersectionSection } from '../../hooks/useIntersectionSection';
import {
  drawCrystalGradientFill,
  drawBeveledText,
  drawSpectralFill,
  drawGlow,
  createParticle,
  updateParticle,
  drawParticle,
  type Particle,
} from '../../utils/canvasEffects';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CrystalMode = 'crystallography' | 'liquid-crystal' | 'light-prism';

interface RefractedLightProps {
  onVisible: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TITLE_FONT = "bold 72px 'Libre Baskerville', serif";
const SUBTITLE_FONT = "24px 'Montserrat', sans-serif";
const TAGLINE_FONT = "18px 'Montserrat', sans-serif";

const TITLE_TEXT = 'TROVES & COVES';
const SUBTITLE_TEXT = 'Handcrafted Crystal Jewelry';
const TAGLINE_TEXT = 'Made in Canada';

const MODES: { key: CrystalMode; label: string; icon: string }[] = [
  { key: 'crystallography', label: 'Crystallography', icon: '\u25C6' },
  { key: 'liquid-crystal', label: 'Liquid Crystal', icon: '\u25C7' },
  { key: 'light-prism', label: 'Light Prism', icon: '\u25B3' },
];

// ---------------------------------------------------------------------------
// Scatter seed helper — deterministic random offsets for Liquid Crystal mode
// ---------------------------------------------------------------------------

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RefractedLight({ onVisible }: RefractedLightProps) {
  const [mode, setMode] = useState<CrystalMode>('crystallography');

  // Font readiness gate
  const fontsReady = useFontReady(['Libre Baskerville', 'Montserrat']);

  // Intersection observer — fires onVisible & gates canvas rendering
  const { sectionRef, isVisible } = useIntersectionSection(0.1);

  // Fire the callback once when the section becomes visible
  const hasCalledVisible = useRef(false);
  useEffect(() => {
    if (isVisible && !hasCalledVisible.current) {
      hasCalledVisible.current = true;
      onVisible();
    }
  }, [isVisible, onVisible]);

  // Scroll progress within this section
  const { sectionRef: scrollSectionRef, progress: scrollProgress } =
    useScrollProgress();

  // Active particles list (mutable ref so draw closure stays fresh)
  const particlesRef = useRef<Particle[]>([]);

  // ---- Pretext line layouts for each text block ----
  // We need the container width for Pretext; start with a safe default and
  // recompute inside the draw callback where we have the real canvas width.
  // usePretextLines needs a stable width — we pass 0 until fonts are ready
  // and we know the canvas size.
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);

  useEffect(() => {
    if (!fontsReady || !isVisible) return;
    const measure = () => {
      const el = canvasWrapperRef.current;
      if (el) setCanvasWidth(el.clientWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [fontsReady, isVisible]);

  const titleLines = usePretextLines(
    TITLE_TEXT,
    TITLE_FONT,
    canvasWidth,
    90,
    fontsReady && canvasWidth > 0
  );

  const subtitleLines = usePretextLines(
    SUBTITLE_TEXT,
    SUBTITLE_FONT,
    canvasWidth,
    36,
    fontsReady && canvasWidth > 0
  );

  const taglineLines = usePretextLines(
    TAGLINE_TEXT,
    TAGLINE_FONT,
    canvasWidth,
    28,
    fontsReady && canvasWidth > 0
  );

  // ---- Draw function ----
  const drawFn = useCallback(
    (renderer: CanvasRenderer) => {
      const { ctx, width, height } = renderer;

      // Background
      ctx.fillStyle = 'hsl(var(--bg-primary, 220 20% 8%))';
      ctx.fillRect(0, 0, width, height);

      if (!fontsReady) return;

      // Aggregate all line data with y-offsets for vertical centering
      const allBlocks: Array<{
        lines: LineData[];
        font: string;
        baseFontSize: number;
      }> = [];

      if (titleLines)
        allBlocks.push({
          lines: titleLines.lines,
          font: TITLE_FONT,
          baseFontSize: 72,
        });
      if (subtitleLines)
        allBlocks.push({
          lines: subtitleLines.lines,
          font: SUBTITLE_FONT,
          baseFontSize: 24,
        });
      if (taglineLines)
        allBlocks.push({
          lines: taglineLines.lines,
          font: TAGLINE_FONT,
          baseFontSize: 18,
        });

      if (allBlocks.length === 0) return;

      // Compute total height of all blocks
      let totalHeight = 0;
      for (const block of allBlocks) {
        for (const line of block.lines) {
          totalHeight += line.height || block.baseFontSize;
        }
        totalHeight += 20; // gap between blocks
      }

      const startY = Math.max(30, (height - totalHeight) / 2);
      let currentY = startY;

      // Flatten into a renderable list with computed positions
      interface RenderLine {
        line: LineData;
        font: string;
        fontSize: number;
        drawX: number;
        drawY: number;
        charIndex: number; // global char index for prism mode
      }
      const renderLines: RenderLine[] = [];
      let globalCharIndex = 0;

      for (const block of allBlocks) {
        for (const line of block.lines) {
          const lineH = line.height || block.baseFontSize;
          const drawX = (width - line.width) / 2 + line.x;
          renderLines.push({
            line,
            font: block.font,
            fontSize: block.baseFontSize,
            drawX,
            drawY: currentY,
            charIndex: globalCharIndex,
          });
          globalCharIndex += line.text.length;
          currentY += lineH;
        }
        currentY += 20;
      }

      // Total character count for prism mode
      const totalChars = globalCharIndex;

      // ---- Spawn ambient particles ----
      if (particlesRef.current.length < 30 && Math.random() < 0.3) {
        particlesRef.current.push(
          createParticle(
            Math.random() * width,
            Math.random() * height,
            170 + Math.random() * 40
          )
        );
      }

      // Update & cull particles
      particlesRef.current = particlesRef.current
        .map(updateParticle)
        .filter(p => p.life > 0);

      // Draw particles behind text
      for (const p of particlesRef.current) {
        drawParticle(ctx, p);
      }

      // ---- Mode-specific rendering ----
      const progress = scrollProgress;

      for (const rl of renderLines) {
        ctx.font = rl.font;
        ctx.textBaseline = 'top';

        if (mode === 'crystallography') {
          // Crystal gradient fill with scroll-shifted light angle
          drawGlow(
            ctx,
            rl.drawX,
            rl.drawY,
            rl.line.width,
            rl.fontSize,
            'hsla(180, 50%, 60%, 0.08)',
            25
          );
          drawCrystalGradientFill(
            ctx,
            rl.line.text,
            rl.drawX,
            rl.drawY,
            rl.line.width,
            rl.fontSize,
            progress
          );
          drawBeveledText(ctx, rl.line.text, rl.drawX, rl.drawY, rl.fontSize);
        } else if (mode === 'liquid-crystal') {
          // Characters scatter/assemble based on scroll progress
          const chars = rl.line.text.split('');
          let charX = rl.drawX;

          for (let i = 0; i < chars.length; i++) {
            const seed = rl.charIndex + i;
            const scatterX = (seededRandom(seed) - 0.5) * width * 0.8;
            const scatterY = (seededRandom(seed + 1000) - 0.5) * height * 0.8;
            const charWidth = ctx.measureText(chars[i]).width;

            const finalX = charX;
            const finalY = rl.drawY;

            // Interpolate between scatter and final positions
            const t = progress;
            const eased = t * t * (3 - 2 * t); // smoothstep
            const px = scatterX + (finalX - scatterX) * eased;
            const py = scatterY + (finalY - scatterY) * eased;

            const alpha = 0.2 + 0.8 * eased;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = `hsl(${170 + i * 8}, 50%, 85%)`;
            ctx.fillText(chars[i], px, py);
            ctx.restore();

            charX += charWidth;
          }
        } else if (mode === 'light-prism') {
          // Vertical light beam sweeps left-to-right with scroll
          const beamX = progress * width;

          // Draw the beam itself
          const beamGrad = ctx.createLinearGradient(
            beamX - 30,
            0,
            beamX + 30,
            0
          );
          beamGrad.addColorStop(0, 'rgba(255,255,255,0)');
          beamGrad.addColorStop(0.5, 'rgba(255,255,255,0.12)');
          beamGrad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = beamGrad;
          ctx.fillRect(beamX - 30, 0, 60, height);

          // Draw text with spectral fill
          const chars = rl.line.text.split('');
          let charX = rl.drawX;

          for (let i = 0; i < chars.length; i++) {
            const charWidth = ctx.measureText(chars[i]).width;
            const beamNorm = beamX / width;

            drawSpectralFill(
              ctx,
              chars[i],
              charX,
              rl.drawY,
              charWidth,
              rl.charIndex + i,
              totalChars,
              beamNorm
            );

            charX += charWidth;
          }
        }
      }
    },
    [fontsReady, mode, scrollProgress, titleLines, subtitleLines, taglineLines]
  );

  // ---- Canvas hook ----
  const canvasRef = useCanvasRenderer(drawFn, [drawFn], {
    height: 500,
    animate: isVisible,
  });

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <section
      id="section-refracted-light"
      ref={(el: HTMLElement | null) => {
        sectionRef(el);
        scrollSectionRef(el);
      }}
      style={{
        position: 'relative',
        padding: '80px 0',
        minHeight: '700px',
        backgroundColor: 'hsl(var(--bg-primary, 220 20% 8%))',
      }}
    >
      {/* ---- Section Header ---- */}
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
            color: 'hsl(var(--accent-vibrant, 180 60% 70%))',
          }}
        >
          {'\u25C6'}
        </div>
        <h2
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: 32,
            fontWeight: 700,
            color: 'hsl(var(--text-primary, 0 0% 95%))',
            margin: '0 0 12px 0',
          }}
        >
          Refracted Light
        </h2>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 16,
            color: 'hsl(var(--text-primary, 0 0% 95%) / 0.7)',
            margin: 0,
            maxWidth: 560,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}
        >
          Pretext&apos;s per-line text layout API drives three crystal-themed
          canvas effects. Scroll to shift light, scatter characters, or sweep a
          spectral prism.
        </p>
      </div>

      {/* ---- Mode Selector ---- */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {MODES.map(m => {
          const active = mode === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 13,
                fontWeight: active ? 700 : 400,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '10px 20px',
                border: active
                  ? '1px solid hsl(var(--accent-vibrant, 180 60% 70%))'
                  : '1px solid hsl(var(--text-primary, 0 0% 95%) / 0.15)',
                borderRadius: 4,
                backgroundColor: active
                  ? 'hsl(var(--accent-vibrant, 180 60% 70%) / 0.12)'
                  : 'transparent',
                color: active
                  ? 'hsl(var(--accent-vibrant, 180 60% 70%))'
                  : 'hsl(var(--text-primary, 0 0% 95%) / 0.6)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              aria-label={`Switch to ${m.label} mode`}
            >
              <span style={{ marginRight: 8, fontSize: 16 }}>{m.icon}</span>
              {m.label}
            </button>
          );
        })}
      </div>

      {/* ---- Canvas ---- */}
      <div
        ref={canvasWrapperRef}
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height: 500,
            borderRadius: 8,
          }}
        />
      </div>

      {/* ---- Scroll Instruction ---- */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 24,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 13,
          color: 'hsl(var(--gold-medium, 45 65% 55%) / 0.7)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Scroll to interact
      </div>
    </section>
  );
}

export default RefractedLight;
