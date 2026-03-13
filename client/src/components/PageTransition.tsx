/**
 * Page Transition Component
 * Handles smooth page transitions following Web Interface Guidelines:
 * - Animate transform/opacity only (compositor-friendly)
 * - No transition: all - list properties explicitly
 * - Honor prefers-reduced-motion
 */

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionClass, setTransitionClass] = useState('');
  const transitionEndRef = useRef(false);
  const prevLocationRef = useRef(location);

  useEffect(() => {
    // Skip transition on first render
    if (!transitionEndRef.current) {
      transitionEndRef.current = true;
      setDisplayChildren(children);
      prevLocationRef.current = location;
      return;
    }

    // Only animate if location actually changed
    if (location === prevLocationRef.current) {
      setDisplayChildren(children);
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // No animation, just swap content
      setDisplayChildren(children);
      prevLocationRef.current = location;
      return;
    }

    // Start exit animation
    setTransitionClass('page-transition-exit page-transition-exit-active');

    const exitTimer = setTimeout(() => {
      // Change content after exit animation
      setDisplayChildren(children);
      prevLocationRef.current = location;

      // Start enter animation
      setTransitionClass('page-transition-enter');

      requestAnimationFrame(() => {
        setTransitionClass('page-transition-enter page-transition-enter-active');
      });

      // Clear transition class after animation completes
      const enterTimer = setTimeout(() => {
        setTransitionClass('');
      }, 500);

      return () => clearTimeout(enterTimer);
    }, 200); // Match exit animation duration

    return () => clearTimeout(exitTimer);
  }, [location, children]);

  return (
    <div className="page-transition-container">
      <div className={transitionClass}>
        {displayChildren}
      </div>
    </div>
  );
}

/**
 * Hook to trigger section reveal animations on scroll
 * Usage: Add 'page-section' class to sections and call this hook in parent
 */
export function useSectionReveal(options: {
  rootMargin?: string;
  threshold?: number;
} = {}) {
  const { rootMargin = '0px 0px -100px 0px', threshold = 0.1 } = options;

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Delay observation to let DOM settle
    const initialTimer = setTimeout(() => {
      observeSections();
    }, 100);

    function observeSections() {
      // Respect prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        // Immediately show all sections
        document.querySelectorAll('.page-section, .page-section-hero, .product-card-stagger')
          .forEach(el => el.classList.add('visible'));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              // Stop observing once visible (one-time animation)
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin, threshold }
      );

      // Observe all sections
      document.querySelectorAll('.page-section, .page-section-hero, .product-card-stagger')
        .forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }

    observeSections();
    return () => {
      clearTimeout(initialTimer);
    };
  }, [rootMargin, threshold]);
}

/**
 * Component wrapper that automatically sets up section reveal animations
 */
export function SectionReveal({ children }: { children: React.ReactNode }) {
  useSectionReveal();
  return <>{children}</>;
}

export default PageTransition;
