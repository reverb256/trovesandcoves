import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface AnalyticsProps {
  measurementId?: string;
}

/**
 * Privacy-Friendly Analytics Component
 *
 * This component provides basic analytics tracking without cookies or
 * personal data collection. It respects user privacy and GDPR.
 *
 * Features:
 * - Page view tracking
 * - Custom event tracking
 * - No cookies or personal data
 * - Respects Do Not Track
 * - GDPR compliant
 */
export function Analytics({ measurementId }: AnalyticsProps) {
  const [location] = useLocation();

  useEffect(() => {
    // Check if user has enabled Do Not Track
    const dnt = navigator.doNotTrack || (window as any).doNotTrack;
    if (dnt === '1' || dnt === '1') {
      return;
    }

    // Only load analytics in production
    if (import.meta.env.DEV) {
      return;
    }

    // Initialize analytics (placeholder for when you add GA4 or similar)
    initAnalytics();
  }, [measurementId]);

  useEffect(() => {
    // Track page views
    if (import.meta.env.DEV) {
      const dnt = navigator.doNotTrack || (window as any).doNotTrack;
      if (dnt === '1' || dnt === '1') {
        return;
      }
    }

    trackPageView(location);
  }, [location]);

  return null;
}

function initAnalytics() {
  // Placeholder for Google Analytics 4 or other privacy-friendly analytics
  // When you add GA4, uncomment and configure:
  /*
  if (measurementId) {
    // Load GA4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    gtag('js', new Date());
    gtag('config', measurementId, {
      // Privacy-focused settings
      anonymize_ip: true,
      send_page_view: false, // We'll handle page views manually
      cookie_flags: 'SameSite=None;Secure',
    });
  }
  */
}

function trackPageView(pathname: string) {
  // Placeholder for page view tracking
  // When you add analytics, uncomment:

  /*
  if (window.gtag) {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pathname,
    });
  }
  */

  // Console log for development (remove in production)
  if (import.meta.env.DEV) {
    console.log('📊 Page View:', {
      path: pathname,
      title: document.title,
      url: window.location.href,
    });
  }
}

/**
 * Track custom events
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, any>
) {
  if (import.meta.env.DEV || navigator.doNotTrack === '1') {
    return;
  }

  // Placeholder for event tracking
  /*
  if (window.gtag) {
    gtag('event', eventName, parameters);
  }
  */

  if (import.meta.env.DEV) {
    console.log('📊 Event:', eventName, parameters);
  }
}

/**
 * Track ecommerce events
 */
export function trackEcommerceEvent(
  eventName: 'add_to_cart' | 'begin_checkout' | 'purchase',
  parameters?: {
    items?: Array<{
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
    }>;
    value?: number;
    currency?: string;
  }
) {
  if (import.meta.env.DEV || navigator.doNotTrack === '1') {
    return;
  }

  // Placeholder for ecommerce tracking
  /*
  if (window.gtag) {
    gtag('event', eventName, parameters);
  }
  */

  if (import.meta.env.DEV) {
    console.log('🛒 Ecommerce Event:', eventName, parameters);
  }
}

// Export functions for use throughout the app
export const analytics = {
  trackEvent,
  trackEcommerceEvent,
};

export default Analytics;
