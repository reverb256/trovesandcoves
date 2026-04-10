/**
 * Scroll progress hook for a section.
 * Returns a value [0, 1] representing how far the user has scrolled
 * through the element. Uses a callback ref for compatibility.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

export function useScrollProgress(): {
  sectionRef: (el: HTMLElement | null) => void;
  progress: number;
} {
  const [progress, setProgress] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);

  const sectionRef = useCallback((el: HTMLElement | null) => {
    elementRef.current = el;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const el = elementRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;

      const start = windowHeight;
      const end = -elementHeight;
      const current = rect.top;

      const p = (start - current) / (start - end);
      setProgress(Math.max(0, Math.min(1, p)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { sectionRef, progress };
}
