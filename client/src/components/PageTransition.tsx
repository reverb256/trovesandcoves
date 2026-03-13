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

import { useEffect, useRef } from 'react';

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
export function useSectionReveal(options: {
  rootMargin?: string;
  threshold?: number;
} = {}) {
  const { rootMargin = '0px 0px -100px 0px', threshold = 0.1 } = options;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Immediately show all sections if reduced motion is preferred
    if (prefersReducedMotion) {
      const elements = document.querySelectorAll('.page-section, .page-section-hero, .product-card-stagger');
      elements.forEach((el) => {
        if (el.isConnected) {
          el.classList.add('visible');
        }
      });
      return;
    }

    // Create the observer with proper error handling
    const observer = new IntersectionObserver(
      (entries) => {
        // Use requestAnimationFrame to avoid manipulating DOM during React's render phase
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            // Double-check that the target is still connected to the DOM
            // This prevents errors when React has already started unmounting
            if (entry.target.isConnected && observerRef.current === observer) {
              if (entry.isIntersecting) {
                try {
                  entry.target.classList.add('visible');
                  // Stop observing once visible (one-time animation)
                  if (observerRef.current) {
                    observerRef.current.unobserve(entry.target);
                  }
                } catch {
                  // Element was removed, ignore error
                }
              }
            }
          });
        });
      },
      { rootMargin, threshold }
    );

    observerRef.current = observer;

    // Function to observe all sections
    const observeSections = () => {
      const elements = document.querySelectorAll('.page-section, .page-section-hero, .product-card-stagger');
      elements.forEach((el) => {
        if (el.isConnected) {
          try {
            observer.observe(el);
          } catch {
            // Element was removed or invalid, ignore
          }
        }
      });
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      observeSections();
    });

    // Store cleanup function
    cleanupRef.current = () => {
      // Cancel pending observation
      cancelAnimationFrame(rafId);

      // Disconnect observer synchronously
      // This MUST happen before React removes DOM nodes
      if (observerRef.current) {
        try {
          observerRef.current.disconnect();
        } catch {
          // Observer already disconnected or invalid
        }
        observerRef.current = null;
      }
    };

    // Return cleanup function
    return cleanupRef.current;
  }, [rootMargin, threshold]);

  // Ensure cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);
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
