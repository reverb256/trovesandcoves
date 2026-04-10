/**
 * IntersectionObserver hook for lazy-initializing sections.
 * Only renders content when the section is visible.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

export function useIntersectionSection(threshold: number = 0.1): {
  sectionRef: (el: HTMLElement | null) => void;
  isVisible: boolean;
} {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sectionRef = useCallback(
    (el: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!el) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observerRef.current?.unobserve(el);
          }
        },
        { threshold, rootMargin: '200px' }
      );

      observerRef.current.observe(el);
    },
    [threshold]
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { sectionRef, isVisible };
}
