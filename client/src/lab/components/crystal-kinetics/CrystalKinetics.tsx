/**
 * Crystal Kinetics — Section 5: Mouse-reactive per-character physics
 *
 * Every character is individually positioned by Pretext. On hover, characters
 * scatter away from the cursor like disturbed crystal shards, then spring
 * back with damping when the mouse leaves. A crystalline trail follows.
 *
 * Three modes:
 *  - Fracture: Characters blast outward from cursor
 *  - Ripple: Wave propagates from cursor position
 *  - Vortex: Characters orbit the cursor in a spiral
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { usePretextLines, type LineData } from '../../hooks/usePretext';
import { useFontReady } from '../../hooks/useFontReady';
import { useIntersectionSection } from '../../hooks/useIntersectionSection';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type KineticsMode = 'fracture' | 'ripple' | 'vortex';
interface CharState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  rotation: number;
  targetRotation: number;
  scale: number;
  targetScale: number;
}

interface CrystalKineticsProps {
  onVisible: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TITLE_FONT = "bold 64px 'Libre Baskerville', serif";
const BODY_FONT = "22px 'Montserrat', sans-serif";

const TITLE_TEXT = 'Every Crystal Tells a Story';
const BODY_TEXT = 'Handcrafted with intention in Winnipeg, Manitoba';

const MODES: { key: KineticsMode; label: string; icon: string }[] = [
  { key: 'fracture', label: 'Fracture', icon: '◆' },
  { key: 'ripple', label: 'Ripple', icon: '◎' },
  { key: 'vortex', label: 'Vortex', icon: '❋' },
];

const SPRING = 0.08;
const DAMPING = 0.82;
const FONT_BODY = "'Montserrat', sans-serif";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CrystalKinetics({ onVisible }: CrystalKineticsProps) {
  const [mode, setMode] = useState<KineticsMode>('fracture');
  const fontsReady = useFontReady(['Libre Baskerville', 'Montserrat']);
  const { sectionRef, isVisible } = useIntersectionSection(0.1);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const charsRef = useRef<CharState[]>([]);
  const rafRef = useRef<number>(0);
  const containerWidthRef = useRef(0);

  // Fire onVisible
  const hasFired = useRef(false);
  useEffect(() => {
    if (isVisible && !hasFired.current) {
      hasFired.current = true;
      onVisible();
    }
  }, [isVisible, onVisible]);

  // Measure container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      containerWidthRef.current = entries[0].contentRect.width;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pretext line layouts
  const titleLines = usePretextLines(
    TITLE_TEXT,
    TITLE_FONT,
    containerWidthRef.current || 700,
    80,
    fontsReady
  );

  const bodyLines = usePretextLines(
    BODY_TEXT,
    BODY_FONT,
    containerWidthRef.current || 700,
    32,
    fontsReady
  );

  // Build character list from pretext data
  useEffect(() => {
    if (!titleLines || !bodyLines || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const allChars: CharState[] = [];
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = containerWidthRef.current || 700;

    const blocks: {
      lines: LineData[];
      font: string;
      fontSize: number;
      lh: number;
    }[] = [];

    if (titleLines)
      blocks.push({
        lines: titleLines.lines,
        font: TITLE_FONT,
        fontSize: 64,
        lh: 80,
      });
    if (bodyLines)
      blocks.push({
        lines: bodyLines.lines,
        font: BODY_FONT,
        fontSize: 22,
        lh: 32,
      });

    // Calculate total height for centering
    let totalHeight = 0;
    for (const block of blocks) {
      totalHeight += block.lines.length * block.lh;
      totalHeight += 20;
    }

    const canvasHeight = Math.max(totalHeight + 60, 300);
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.width = displayWidth * dpr;
    canvas.height = canvasHeight * dpr;

    const startY = Math.max(10, (canvasHeight - totalHeight) / 2);

    let currentY = startY;
    for (const block of blocks) {
      ctx.font = block.font;
      for (const line of block.lines) {
        const lineStartX = (displayWidth - line.width) / 2;
        let charX = lineStartX;

        for (const seg of line.segments) {
          const tx = charX;
          const ty = currentY;
          allChars.push({
            x: tx,
            y: ty,
            vx: 0,
            vy: 0,
            targetX: tx,
            targetY: ty,
            rotation: 0,
            targetRotation: 0,
            scale: 1,
            targetScale: 1,
          });
          charX += seg.width;
        }
        currentY += block.lh;
      }
      currentY += 20;
    }

    charsRef.current = allChars;
  }, [titleLines, bodyLines, fontsReady]);

  // Mouse handlers
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isVisible || !fontsReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let running = true;

    const animate = () => {
      if (!running) return;
      const chars = charsRef.current;
      if (chars.length === 0) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;

      // Update physics
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];

        if (mouse.active) {
          const dx = c.targetX - mouse.x;
          const dy = c.targetY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = 120;

          if (dist < radius) {
            const force = (1 - dist / radius) * 35;

            if (mode === 'fracture') {
              // Blast outward from cursor
              const angle = Math.atan2(dy, dx);
              c.vx += Math.cos(angle) * force;
              c.vy += Math.sin(angle) * force;
              c.targetRotation = (Math.random() - 0.5) * 45;
              c.targetScale = 0.7 + Math.random() * 0.5;
            } else if (mode === 'ripple') {
              // Vertical wave
              const wave =
                Math.sin(dist * 0.05 + performance.now() * 0.005) * force;
              c.vy += wave * 0.5;
              c.vx += (Math.random() - 0.5) * force * 0.3;
              c.targetRotation = wave * 2;
              c.targetScale = 1 + Math.sin(dist * 0.08) * 0.15;
            } else if (mode === 'vortex') {
              // Orbital motion
              const angle = Math.atan2(dy, dx) + Math.PI / 2;
              c.vx += Math.cos(angle) * force * 0.6;
              c.vy += Math.sin(angle) * force * 0.6;
              // Slight pull inward
              c.vx -= dx * 0.002;
              c.vy -= dy * 0.002;
              c.targetRotation += 5;
              c.targetScale = 0.85;
            }
          }
        }

        // Spring back to target
        const dx = c.targetX - c.x;
        const dy = c.targetY - c.y;
        c.vx += dx * SPRING;
        c.vy += dy * SPRING;
        c.vx *= DAMPING;
        c.vy *= DAMPING;
        c.x += c.vx;
        c.y += c.vy;

        // Rotation spring
        const rd = c.targetRotation - c.rotation;
        c.rotation += rd * 0.1;
        if (!mouse.active) c.targetRotation *= 0.95;

        // Scale spring
        const sd = c.targetScale - c.scale;
        c.scale += sd * 0.1;
        if (!mouse.active) c.targetScale = 1;
      }

      // Rebuild text for rendering
      ctx.textBaseline = 'top';
      const allLineData = [
        ...(titleLines?.lines ?? []).map(l => ({
          ...l,
          font: TITLE_FONT,
          fontSize: 64,
          lh: 80,
        })),
        ...(bodyLines?.lines ?? []).map(l => ({
          ...l,
          font: BODY_FONT,
          fontSize: 22,
          lh: 32,
        })),
      ];

      let charIdx = 0;
      for (const line of allLineData) {
        ctx.font = line.font;
        for (const seg of line.segments) {
          if (charIdx >= chars.length) break;
          const c = chars[charIdx];

          ctx.save();
          ctx.translate(c.x + seg.width / 2, c.y + line.fontSize / 2);
          ctx.rotate((c.rotation * Math.PI) / 180);
          ctx.scale(c.scale, c.scale);

          // Color based on distance from rest
          const displacement = Math.sqrt(
            (c.x - c.targetX) ** 2 + (c.y - c.targetY) ** 2
          );
          const hue = 170 + displacement * 2;
          const lightness = 75 + displacement * 0.5;
          const alpha = Math.min(1, 0.6 + displacement * 0.02);

          ctx.fillStyle = `hsla(${hue}, 50%, ${lightness}%, ${alpha})`;
          ctx.fillText(seg.text, -seg.width / 2, -line.fontSize / 2);
          ctx.restore();

          charIdx++;
        }
      }

      // Draw crystalline cursor trail
      if (mouse.active) {
        const trailCount = 5;
        for (let t = 0; t < trailCount; t++) {
          const offset = (performance.now() * 0.02 + t * 30) % 360;
          const trailX =
            mouse.x + Math.cos((offset * Math.PI) / 180) * (20 + t * 8);
          const trailY =
            mouse.y + Math.sin((offset * Math.PI) / 180) * (20 + t * 8);
          ctx.beginPath();
          ctx.arc(trailX, trailY, 2 + t, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(170, 50%, 75%, ${0.3 - t * 0.05})`;
          ctx.fill();
        }
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, fontsReady, titleLines, bodyLines, mode]);

  return (
    <section
      id="section-crystal-kinetics"
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
            color: 'hsl(var(--accent-vibrant))',
          }}
        >
          ◇
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
          Crystal Kinetics
        </h2>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 16,
            color: 'hsl(var(--text-primary) / 0.7)',
            margin: 0,
            maxWidth: 560,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}
        >
          Each character is individually positioned by Pretext, then set free
          with spring physics. Hover to disturb the crystal lattice.
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
          const active = mode === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              style={{
                fontFamily: FONT_BODY,
                fontSize: 13,
                fontWeight: active ? 700 : 400,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '10px 20px',
                border: active
                  ? '1px solid hsl(var(--accent-vibrant))'
                  : '1px solid hsl(var(--text-primary) / 0.15)',
                borderRadius: 4,
                backgroundColor: active
                  ? 'hsl(var(--accent-vibrant) / 0.12)'
                  : 'transparent',
                color: active
                  ? 'hsl(var(--accent-vibrant))'
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
        ref={containerRef}
        style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}
      >
        {isVisible && (
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              display: 'block',
              width: '100%',
              height: 300,
              borderRadius: 8,
              cursor: 'crosshair',
            }}
          />
        )}
      </div>

      {/* Interaction hint */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 24,
          fontFamily: FONT_BODY,
          fontSize: 13,
          color: 'hsl(var(--gold-medium) / 0.7)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Hover to interact
      </div>
    </section>
  );
}
