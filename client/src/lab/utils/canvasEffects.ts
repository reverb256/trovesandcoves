/**
 * Canvas drawing utilities for crystal-themed text effects.
 * These work with positions computed by Pretext's layoutWithLines().
 */

/** Draw text with a multi-stop gradient fill (crystal clarity) */
export function drawCrystalGradientFill(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  scrollProgress: number = 0
) {
  const gradient = ctx.createLinearGradient(x, y - height, x + width, y);
  const hueShift = scrollProgress * 30;
  gradient.addColorStop(0, `hsl(${180 + hueShift}, 40%, 85%)`);
  gradient.addColorStop(0.3, `hsl(${180 + hueShift}, 30%, 95%)`);
  gradient.addColorStop(0.5, `hsl(${170 + hueShift}, 50%, 92%)`);
  gradient.addColorStop(0.7, `hsl(${175 + hueShift}, 35%, 88%)`);
  gradient.addColorStop(1, `hsl(${185 + hueShift}, 45%, 82%)`);

  ctx.fillStyle = gradient;
  ctx.fillText(text, x, y);
}

/** Draw text with a beveled crystal edge effect */
export function drawBeveledText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  _fontSize: number
) {
  // Shadow (bottom edge - darker)
  ctx.save();
  ctx.fillStyle = 'rgba(20, 80, 80, 0.3)';
  ctx.fillText(text, x + 1, y + 1);
  ctx.restore();

  // Highlight (top edge - lighter)
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText(text, x - 0.5, y - 0.5);
  ctx.restore();

  // Main fill
  ctx.fillStyle = 'hsl(180, 35%, 85%)';
  ctx.fillText(text, x, y);
}

/** Draw a spectral refraction gradient across a character */
export function drawSpectralFill(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  charIndex: number,
  totalChars: number,
  beamPosition: number // 0-1 across the text width
) {
  const charCenter = x + width / 2;
  const gradient = ctx.createLinearGradient(x, y, x + width, y);

  if (Math.abs(charCenter - beamPosition) < 50) {
    // At the beam — full spectrum
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(0.17, '#ff8800');
    gradient.addColorStop(0.33, '#ffff00');
    gradient.addColorStop(0.5, '#00ff00');
    gradient.addColorStop(0.67, '#0088ff');
    gradient.addColorStop(0.83, '#8800ff');
    gradient.addColorStop(1, '#ff00ff');
  } else {
    // Refracted — settled into a fixed hue based on index
    const hue = (charIndex / totalChars) * 300;
    gradient.addColorStop(0, `hsl(${hue}, 80%, 70%)`);
    gradient.addColorStop(1, `hsl(${hue + 20}, 80%, 60%)`);
  }

  ctx.fillStyle = gradient;
  ctx.fillText(text, x, y);
}

/** Draw a glow effect behind text */
export function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string = 'hsla(180, 60%, 70%, 0.15)',
  blur: number = 20
) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.fillStyle = color;
  ctx.fillRect(x, y - height * 0.8, width, height * 1.2);
  ctx.restore();
}

/** Simple particle for crystal effects */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export function createParticle(
  x: number,
  y: number,
  hue: number = 180
): Particle {
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 2,
    vy: -Math.random() * 1.5 - 0.5,
    life: 1,
    maxLife: 60 + Math.random() * 40,
    size: 1 + Math.random() * 2,
    hue,
  };
}

export function updateParticle(p: Particle): Particle {
  return {
    ...p,
    x: p.x + p.vx,
    y: p.y + p.vy,
    life: p.life - 1 / p.maxLife,
    vy: p.vy - 0.01, // slight upward drift
  };
}

export function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  if (p.life <= 0) return;
  ctx.save();
  ctx.globalAlpha = p.life * 0.6;
  ctx.fillStyle = `hsl(${p.hue}, 60%, 80%)`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
