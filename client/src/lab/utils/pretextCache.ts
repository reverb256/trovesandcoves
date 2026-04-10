/**
 * LRU cache for Pretext prepare() results.
 * prepare() is the expensive call (~19ms) — same text+font always
 * produces the same result, so we cache by composite key.
 */

type PreparedText = unknown; // Pretext doesn't export types yet

const cache = new Map<string, PreparedText>();
const MAX_CACHE_SIZE = 500;

export function getCacheKey(text: string, font: string): string {
  return `${text}::${font}`;
}

export function getCached(key: string): PreparedText | undefined {
  return cache.get(key);
}

export function setCached(key: string, value: PreparedText): void {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(key, value);
}

export function clearCache(): void {
  cache.clear();
}

export function cacheSize(): number {
  return cache.size;
}
