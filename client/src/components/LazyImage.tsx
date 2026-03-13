import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  srcSet?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function LazyImage({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=',
  loading = 'lazy',
  priority = false,
  sizes,
  srcSet,
  width,
  height,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isMountedRef = useRef(true);

  // Skip intersection observer for priority images or eager loading
  useEffect(() => {
    isMountedRef.current = true;

    if (priority || loading === 'eager') {
      setIsLoaded(true);
      return;
    }

    const img = imgRef.current;
    if (!img || !isMountedRef.current) return;

    // Create the observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only process if component is still mounted
        if (!isMountedRef.current) return;

        if (entry.isIntersecting) {
          setIsLoaded(true);
          // Disconnect after triggering load
          if (observerRef.current) {
            try {
              observerRef.current.disconnect();
            } catch {
              // Ignore errors during disconnect
            }
            observerRef.current = null;
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px', // Start loading 50px before viewport
      }
    );

    observerRef.current = observer;

    // Observe the image with error handling
    try {
      if (img.isConnected) {
        observer.observe(img);
      }
    } catch {
      // Element might not be ready yet, retry after a delay
      requestAnimationFrame(() => {
        if (isMountedRef.current && img.isConnected && observerRef.current) {
          try {
            observerRef.current.observe(img);
          } catch {
            // Final retry with timeout
            const retryTimeoutId = setTimeout(() => {
              if (isMountedRef.current && img.isConnected && observerRef.current) {
                try {
                  observerRef.current.observe(img);
                } catch {
                  // All retries failed, just show the image
                  setIsLoaded(true);
                }
              }
            }, 100);
            
            // Store timeout ID for cleanup (using a property on the observer)
            if (observerRef.current) {
              (observerRef.current as any)._retryTimeout = retryTimeoutId;
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;

      // Clear any pending retry timeout
      if (observerRef.current && (observerRef.current as any)._retryTimeout) {
        clearTimeout((observerRef.current as any)._retryTimeout);
      }

      // Disconnect the observer
      if (observerRef.current) {
        try {
          observerRef.current.disconnect();
        } catch {
          // Observer already disconnected or in invalid state
        }
        observerRef.current = null;
      }
    };
  }, [src, priority, loading]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-surface-100 dark:bg-surface-800 ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-12 h-12 text-on-surface-variant dark:text-on-surface-variant"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : placeholder}
      alt={alt}
      loading={priority ? 'eager' : loading}
      decoding="async"
      sizes={sizes}
      srcSet={srcSet}
      width={width}
      height={height}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-50'} ${className}`}
      onLoad={() => setIsLoaded(true)}
      onError={() => setError(true)}
    />
  );
}