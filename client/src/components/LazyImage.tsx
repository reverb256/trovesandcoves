import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=',
  loading = 'lazy'
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const image = new Image();
          image.onload = () => setIsLoaded(true);
          image.onerror = () => setError(true);
          image.src = src;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [src]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <span className="text-gray-400 text-sm">Failed to load</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : placeholder}
      alt={alt}
      loading={loading}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-50'} ${className}`}
      onLoad={() => setIsLoaded(true)}
      onError={() => setError(true)}
    />
  );
}