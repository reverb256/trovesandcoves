/**
 * Font loading gate hook. Pretext measurement is only accurate
 * after fonts are loaded — this hook ensures that.
 */
import { useState, useEffect } from 'react';

export function useFontReady(fontFamilies: string[]): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = () => {
      if (cancelled) return;
      const allLoaded = fontFamilies.every(f =>
        document.fonts.check(`16px ${f}`)
      );
      if (allLoaded) setReady(true);
    };

    // Check immediately (fonts may already be loaded)
    check();

    // Wait for all fonts to load
    document.fonts.ready.then(() => {
      if (!cancelled) {
        check();
        // Re-check after a small delay (some browsers need it)
        setTimeout(check, 100);
      }
    });

    // Listen for individual font load events
    const handleLoadingDone = () => check();
    document.fonts.addEventListener('loadingdone', handleLoadingDone);

    return () => {
      cancelled = true;
      document.fonts.removeEventListener('loadingdone', handleLoadingDone);
    };
  }, [fontFamilies.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  return ready;
}
