/**
 * Shared Pretext utilities for site-wide text measurement.
 *
 * Provides hooks and helpers for zero-CLS text height pre-computation,
 * smart truncation, and multi-column editorial layout — all without
 * touching the DOM.
 *
 * Pretext has its own internal measurement cache, so we don't
 * duplicate it here. Just call the APIs directly.
 */
import { useState, useEffect, useMemo } from 'react';
import {
  prepare,
  layout,
  prepareWithSegments,
  layoutWithLines,
  walkLineRanges,
  layoutNextLine,
  clearCache as pretextClearCache,
  profilePrepare,
} from '@chenglou/pretext';

/* ------------------------------------------------------------------ */
/*  Core measurement functions (non-hook, call anywhere)               */
/* ------------------------------------------------------------------ */

/**
 * Compute text height at a given width without touching the DOM.
 */
export function measureTextHeight(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number
): { height: number; lineCount: number } {
  if (!text || maxWidth <= 0) return { height: 0, lineCount: 0 };
  try {
    const prepared = prepare(text, font);
    return layout(prepared, maxWidth, lineHeight);
  } catch {
    return { height: 0, lineCount: 0 };
  }
}

/**
 * Compute per-line layout data for canvas or column rendering.
 */
export function measureTextLines(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number
) {
  if (!text || maxWidth <= 0) return null;
  try {
    const prepared = prepareWithSegments(text, font);
    return layoutWithLines(prepared, maxWidth, lineHeight);
  } catch {
    return null;
  }
}

/**
 * Count lines at a given width (lightweight, no text materialization).
 */
export function countLines(
  text: string,
  font: string,
  maxWidth: number
): number {
  if (!text || maxWidth <= 0) return 0;
  try {
    const prepared = prepareWithSegments(text, font);
    let count = 0;
    walkLineRanges(prepared, maxWidth, () => {
      count++;
    });
    return count;
  } catch {
    return 0;
  }
}

/**
 * Profile the prepare() phase for diagnostics.
 */
export function getPrepareProfile(text: string, font: string) {
  try {
    return profilePrepare(text, font);
  } catch {
    return null;
  }
}

/**
 * Get lines one at a time for variable-width wrapping.
 */
export function getNextLine(
  text: string,
  font: string,
  start: { segmentIndex: number; graphemeIndex: number },
  maxWidth: number
) {
  if (!text || maxWidth <= 0) return null;
  try {
    const prepared = prepareWithSegments(text, font);
    return layoutNextLine(prepared, start, maxWidth);
  } catch {
    return null;
  }
}

export { pretextClearCache };

/* ------------------------------------------------------------------ */
/*  React Hooks                                                        */
/* ------------------------------------------------------------------ */

/**
 * Hook: pre-compute text height for zero-CLS rendering.
 * Returns height and lineCount without any DOM read.
 *
 * Usage:
 *   const { height } = useTextHeight(product.name, font, 300, 24);
 *   <div style={{ height: height || undefined }}>{product.name}</div>
 */
export function useTextHeight(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number
): { height: number; lineCount: number } {
  const [result, setResult] = useState({ height: 0, lineCount: 0 });

  useEffect(() => {
    setResult(measureTextHeight(text, font, maxWidth, lineHeight));
  }, [text, font, maxWidth, lineHeight]);

  return result;
}

/**
 * Hook: compute smart truncation — returns text that fits in N lines.
 *
 * Usage:
 *   const { displayText, isTruncated } = useSmartTruncate(
 *     product.name, "500 20px 'Libre Baskerville', serif", 300, 2, 28
 *   );
 */
export function useSmartTruncate(
  text: string,
  font: string,
  maxWidth: number,
  maxLines: number,
  lineHeight: number
): { displayText: string; isTruncated: boolean; actualLineCount: number } {
  return useMemo(() => {
    if (!text || maxWidth <= 0)
      return { displayText: text, isTruncated: false, actualLineCount: 0 };

    try {
      const result = measureTextLines(text, font, maxWidth, lineHeight);
      if (!result || result.lines.length <= maxLines) {
        return {
          displayText: text,
          isTruncated: false,
          actualLineCount: result?.lineCount ?? 0,
        };
      }

      const truncatedLines = result.lines.slice(0, maxLines);
      const lastLine = truncatedLines[truncatedLines.length - 1];
      const truncated = truncatedLines
        .map(l => l.text)
        .join(' ')
        .trimEnd();

      if (lastLine.text.length < 10) {
        const prevText = truncatedLines
          .slice(0, -1)
          .map(l => l.text)
          .join(' ')
          .trimEnd();
        return {
          displayText: prevText + '...',
          isTruncated: true,
          actualLineCount: result.lineCount,
        };
      }

      return {
        displayText: truncated + '...',
        isTruncated: true,
        actualLineCount: result.lineCount,
      };
    } catch {
      return { displayText: text, isTruncated: false, actualLineCount: 0 };
    }
  }, [text, font, maxWidth, maxLines, lineHeight]);
}

/**
 * Hook: distribute text across N columns with balanced heights.
 * Returns an array of column text slices.
 *
 * Usage:
 *   const columns = useColumnLayout(aboutText, font, 280, 24, 3);
 *   columns.map(col => <div>{col.text}</div>)
 */
export function useColumnLayout(
  text: string,
  font: string,
  columnWidth: number,
  lineHeight: number,
  columnCount: number
): Array<{ text: string; height: number; lineCount: number }> {
  return useMemo(() => {
    if (!text || columnWidth <= 0 || columnCount <= 0) {
      return Array.from({ length: columnCount }, () => ({
        text: '',
        height: 0,
        lineCount: 0,
      }));
    }

    try {
      const result = measureTextLines(text, font, columnWidth, lineHeight);
      if (!result || result.lines.length === 0) {
        return Array.from({ length: columnCount }, () => ({
          text: '',
          height: 0,
          lineCount: 0,
        }));
      }

      // Greedy distribution: assign each line to the shortest column
      type Col = { text: string; height: number; lineCount: number };
      const columns: Col[] = Array.from({ length: columnCount }, () => ({
        text: '',
        height: 0,
        lineCount: 0,
      }));

      for (const line of result.lines) {
        const shortestIdx = columns.reduce(
          (min, col, i) => (col.height < columns[min].height ? i : min),
          0
        );

        const separator = columns[shortestIdx].text ? ' ' : '';
        columns[shortestIdx].text += separator + line.text;
        columns[shortestIdx].height += lineHeight;
        columns[shortestIdx].lineCount += 1;
      }

      return columns;
    } catch {
      return Array.from({ length: columnCount }, () => ({
        text,
        height: 0,
        lineCount: 0,
      }));
    }
  }, [text, font, columnWidth, lineHeight, columnCount]);
}
