import { useState } from 'react';

interface WebPImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
}

/**
 * WebPImage component that serves WebP images with PNG fallback.
 * Automatically converts .png URLs to .webp and falls back to PNG if WebP fails.
 *
 * Usage: <WebPImage src="/images/product.png" alt="Product" className="w-full" />
 */
export function WebPImage({
  src,
  alt,
  className,
  style,
  ...imgProps
}: WebPImageProps) {
  const [useFallback, setUseFallback] = useState(false);

  // Convert PNG/JPG URLs to WebP
  const getWebpSrc = (url: string): string => {
    return url.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  };

  const webpSrc = getWebpSrc(src);

  // If not a PNG/JPG, or fallback triggered, use regular img
  if (useFallback || !src.match(/\.(png|jpg|jpeg)$/i)) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        {...imgProps}
      />
    );
  }

  return (
    <picture className={className} style={style}>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        {...imgProps}
        onError={() => {
          // Fallback if both WebP and PNG fail
          setUseFallback(true);
        }}
      />
    </picture>
  );
}
