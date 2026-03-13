import { useEffect } from 'react';

/**
 * Core Web Vitals Monitoring
 *
 * Tracks and reports on Core Web Vitals:
 * - LCP (Largest Contentful Paint) < 2.5s
 * - FID (First Input Delay) < 100ms
 * - CLS (Cumulative Layout Shift) < 0.1
 *
 * Helps maintain performance standards and user experience
 */

export function PerformanceMonitor() {
  useEffect(() => {
    if (import.meta.env.DEV || typeof window === 'undefined') {
      return;
    }

    // Monitor Core Web Vitals
    monitorWebVitals();

    // Setup performance observer
    setupPerformanceObserver();
  }, []);

  return null;
}

function monitorWebVitals() {
  // Use basic performance monitoring
  // web-vitals library can be added later if needed
  fallbackMetrics();
}

function fallbackMetrics() {
  // Basic Performance API monitoring
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const ttfb = navEntry.responseStart - navEntry.requestStart;
            console.log('⚡ TTFB:', Math.round(ttfb), 'ms');
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }
}

function setupPerformanceObserver() {
  if (!('PerformanceObserver' in window)) {
    return;
  }

  // Check supported entryTypes before observing
  const supportedEntryTypes = PerformanceObserver.supportedEntryTypes || [];

  try {
    // Monitor Largest Contentful Paint (widely supported)
    if (supportedEntryTypes.includes('largest-contentful-paint')) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('🖼️  LCP:', Math.round(lastEntry.startTime), 'ms');
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // Monitor layout shifts (check support first)
    if (supportedEntryTypes.includes('layout-shift')) {
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            clsValue += (entry as any).value;
          }
          console.log('📊 CLS:', clsValue.toFixed(3));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch {
        // layout-shift not supported in this browser
      }
    }

    // Monitor long tasks (check support first)
    if (supportedEntryTypes.includes('longtask')) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log('⚠️  Long Task:', Math.round(entry.duration), 'ms');
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch {
        // longtask not supported in this browser
      }
    }

  } catch (error) {
    console.warn('Performance monitoring error:', error);
  }
}

/**
 * Log performance metrics for debugging
 */
export function logPerformanceMetrics() {
  if (!('performance' in window)) {
    return;
  }

  const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  const metrics = {
    // Network metrics
    dns: Math.round(perfData.domainLookupEnd - perfData.domainLookupStart),
    tcp: Math.round(perfData.connectEnd - perfData.connectStart),
    ttfb: Math.round(perfData.responseStart - perfData.requestStart),
    download: Math.round(perfData.responseEnd - perfData.responseStart),

    // Rendering metrics
    domLoad: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
    windowLoad: Math.round(perfData.loadEventEnd - perfData.loadEventStart),

    // Total load time
    totalLoad: Math.round(perfData.loadEventEnd - perfData.fetchStart),
  };

  console.table(metrics);
  return metrics;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export default PerformanceMonitor;
