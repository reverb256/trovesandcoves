/**
 * Canvas rendering lifecycle hook.
 * Handles DPR scaling, animation frames, and cleanup.
 */
import { useRef, useEffect, useCallback } from 'react';

export interface CanvasRenderer {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
}

export function useCanvasRenderer(
  drawFn: (renderer: CanvasRenderer) => void,
  deps: unknown[],
  options: {
    width?: number;
    height?: number;
    animate?: boolean;
  } = {}
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = options.width ?? canvas.clientWidth;
    const height = options.height ?? canvas.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    return { ctx, width, height, dpr };
  }, [options.width, options.height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = setup();
    if (!renderer) return;

    const { ctx, width, height, dpr } = renderer;

    if (options.animate) {
      let running = true;
      const loop = () => {
        if (!running) return;
        ctx.clearRect(0, 0, width, height);
        drawFn({ ctx, width, height, dpr });
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
      return () => {
        running = false;
        cancelAnimationFrame(rafRef.current);
      };
    } else {
      ctx.clearRect(0, 0, width, height);
      drawFn({ ctx, width, height, dpr });
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return canvasRef;
}
