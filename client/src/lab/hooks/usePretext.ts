/**
 * Core hooks wrapping Pretext's API surfaces.
 *
 * - usePretext:        prepare() + layout() — height measurement only
 * - usePretextLines:   prepareWithSegments() + layoutWithLines() — full per-line data
 * - usePretextWalker:  walkLineRanges() + layoutNextLine() — incremental iteration
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  prepare,
  layout,
  prepareWithSegments,
  layoutWithLines,
  walkLineRanges,
  layoutNextLine,
} from '@chenglou/pretext';
import { getCacheKey, getCached, setCached } from '../utils/pretextCache';

/* ------------------------------------------------------------------ */
/*  Height-only measurement                                            */
/* ------------------------------------------------------------------ */

export interface PretextMeasurement {
  height: number;
  lineCount: number;
  preparedTime: number;
  layoutTime: number;
}

export interface UsePretextOptions {
  text: string;
  font: string;
  maxWidth: number;
  lineHeight: number;
  enabled?: boolean;
}

export function usePretext({
  text,
  font,
  maxWidth,
  lineHeight,
  enabled = true,
}: UsePretextOptions): PretextMeasurement | null {
  const [measurement, setMeasurement] = useState<PretextMeasurement | null>(
    null
  );

  useEffect(() => {
    if (!enabled || !text || !font || maxWidth <= 0) {
      setMeasurement(null);
      return;
    }

    const key = getCacheKey(text, font);
    const startPrepare = performance.now();
    let prepared = getCached(key) as ReturnType<typeof prepare> | undefined;

    if (!prepared) {
      prepared = prepare(text, font);
      setCached(key, prepared);
    }
    const preparedTime = performance.now() - startPrepare;

    const startLayout = performance.now();
    const result = layout(prepared, maxWidth, lineHeight);
    const layoutTime = performance.now() - startLayout;

    setMeasurement({
      height: result.height,
      lineCount: result.lineCount,
      preparedTime,
      layoutTime,
    });
  }, [text, font, maxWidth, lineHeight, enabled]);

  return measurement;
}

/* ------------------------------------------------------------------ */
/*  Full per-line layout                                                */
/* ------------------------------------------------------------------ */

export interface PretextLine {
  text: string;
  width: number;
  start: { segmentIndex: number; graphemeIndex: number };
  end: { segmentIndex: number; graphemeIndex: number };
}

export interface LineData {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  segments: Array<{
    text: string;
    x: number;
    width: number;
  }>;
}

export function usePretextLines(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
  enabled: boolean = true
): { lines: LineData[]; totalTime: number } | null {
  return useMemo(() => {
    if (!enabled || !text || !font || maxWidth <= 0) return null;

    const start = performance.now();

    try {
      // prepareWithSegments preserves segment text so layoutWithLines
      // can materialize per-line text content.
      const key = getCacheKey(text, font);
      let prepared = getCached(key) as
        | ReturnType<typeof prepareWithSegments>
        | undefined;

      if (!prepared) {
        prepared = prepareWithSegments(text, font);
        setCached(key, prepared);
      }

      const result = layoutWithLines(prepared, maxWidth, lineHeight);
      const totalTime = performance.now() - start;

      // Map Pretext's native line data to our LineData shape with
      // y-position and per-segment positioning computed from the font.
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.font = font;

      const lines: LineData[] = result.lines.map((line, i) => {
        // Build segments by measuring each character with canvas
        // to get per-character x offsets. Pretext gave us the line
        // text and total width — we split for rendering.
        const chars = line.text;
        const segments: LineData['segments'] = [];
        let charX = 0;

        for (let c = 0; c < chars.length; c++) {
          const ch = chars[c];
          const charW = ctx.measureText(ch).width;
          segments.push({ text: ch, x: charX, width: charW });
          charX += charW;
        }

        return {
          text: line.text,
          x: 0,
          y: i * lineHeight,
          width: line.width,
          height: lineHeight,
          segments,
        };
      });

      return { lines, totalTime };
    } catch {
      return null;
    }
  }, [text, font, maxWidth, lineHeight, enabled]);
}

/* ------------------------------------------------------------------ */
/*  Incremental walker — walkLineRanges + layoutNextLine                */
/* ------------------------------------------------------------------ */

export interface LineRange {
  width: number;
  start: { segmentIndex: number; graphemeIndex: number };
  end: { segmentIndex: number; graphemeIndex: number };
}

/**
 * Walk all line ranges for a prepared text at a given width.
 * Returns lightweight range data (no text materialization).
 * Useful for counting lines per column, computing heights, etc.
 */
export function useWalkLineRanges(
  text: string,
  font: string,
  maxWidth: number,
  enabled: boolean = true
): LineRange[] | null {
  return useMemo(() => {
    if (!enabled || !text || !font || maxWidth <= 0) return null;

    try {
      const key = getCacheKey(text, font);
      let prepared = getCached(key) as
        | ReturnType<typeof prepareWithSegments>
        | undefined;

      if (!prepared) {
        prepared = prepareWithSegments(text, font);
        setCached(key, prepared);
      }

      const ranges: LineRange[] = [];
      walkLineRanges(prepared, maxWidth, range => {
        ranges.push(range);
      });

      return ranges;
    } catch {
      return null;
    }
  }, [text, font, maxWidth, enabled]);
}

/**
 * Returns a callback that iterates lines one at a time starting from
 * a given cursor position. Useful for variable-width wrapping where
 * each "row" has a different maxWidth.
 *
 * Usage:
 *   const nextLine = useLayoutNextLine(text, font, enabled);
 *   const line1 = nextLine(0, 300);  // first line at 300px
 *   const line2 = nextLine(line1.end, 250);  // second line at 250px
 */
export function useLayoutNextLine(
  text: string,
  font: string,
  enabled: boolean = true
) {
  const prepared = useMemo(() => {
    if (!enabled || !text || !font) return null;

    try {
      const key = getCacheKey(text, font);
      let p = getCached(key) as
        | ReturnType<typeof prepareWithSegments>
        | undefined;

      if (!p) {
        p = prepareWithSegments(text, font);
        setCached(key, p);
      }
      return p;
    } catch {
      return null;
    }
  }, [text, font, enabled]);

  return useCallback(
    (
      start: { segmentIndex: number; graphemeIndex: number },
      maxWidth: number
    ) => {
      if (!prepared || maxWidth <= 0) return null;
      return layoutNextLine(prepared, start, maxWidth) as PretextLine | null;
    },
    [prepared]
  );
}
