/**
 * Page Transition Component
 *
 * Handles smooth page transitions following Web Interface Guidelines:
 * - Animate transform/opacity only (compositor-friendly)
 * - No transition: all - list properties explicitly
 * - Honor prefers-reduced-motion
 *
 * IMPORTANT: IntersectionObserver cleanup must happen synchronously
 * before React unmounts DOM nodes to avoid "removeChild" errors.
 */

import { useEffect } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Simple page transition wrapper that doesn't hold state.
 * This avoids race conditions during route transitions.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return <>{children}</>;
}

/**
 * Hook to trigger section reveal animations on scroll.
 *
 * This hook uses IntersectionObserver to add 'visible' class to elements
 * when they enter the viewport. The observer is properly cleaned up
 * before React unmounts DOM nodes.
 *
 * USAGE: Add 'page-section', 'page-section-hero', or 'product-card-stagger'
 * classes to elements you want to animate.
 */
export function useSectionReveal(
  options: {
    rootMargin?: string;
    threshold?: number;
  } = {}
) {
  // Destructure options at the function level for dependency array
  const { rootMargin = '0px 0px -100px 0px', threshold = 0.1 } = options;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      // Show all elements immediately for users who prefer reduced motion
      const elements = document.querySelectorAll(
        '.page-section, .page-section-hero, .product-card-stagger'
      );
      elements.forEach(el => {
        if (el.isConnected) el.classList.add('visible');
      });
      return;
    }

    // Store observer ref to check in callbacks
    const observerRef = { current: null as IntersectionObserver | null };

    const observer = new IntersectionObserver(
      entries => {
        requestAnimationFrame(() => {
          entries.forEach(entry => {
            // Only proceed if this is still our active observer
            if (observerRef.current !== observer) return;

            const target = entry.target as HTMLElement;
            if (target.isConnected) {
              if (entry.isIntersecting) {
                target.classList.add('visible');
                // Optional: stop observing once visible
                // observer.unobserve(target);
              }
            }
          });
        });
      },
      { rootMargin, threshold }
    );

    observerRef.current = observer;

    // Observe elements
    const elements = document.querySelectorAll(
      '.page-section, .page-section-hero, .product-card-stagger'
    );
    elements.forEach(el => {
      if (el.isConnected) {
        observer.observe(el);
      }
    });

    // Cleanup: disconnect observer synchronously
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [rootMargin, threshold]);

  return () => {
    // No-op - cleanup handled in useEffect
  };
}

/**
 * Component wrapper that automatically sets up section reveal animations.
 *
 * This component is rendered once at the app level and wraps all routes.
 * The useSectionReveal hook handles its own cleanup on route changes.
 */
export function SectionReveal({ children }: { children: React.ReactNode }) {
  useSectionReveal();
  return <>{children}</>;
}

export default PageTransition;
