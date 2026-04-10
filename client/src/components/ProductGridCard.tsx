/**
 * Product grid card with Pretext-powered smart truncation.
 * Uses useSmartTruncate to compute exact 2-line cutoff without CSS line-clamp guessing.
 */
import { useSmartTruncate } from '@/lib/pretext';
import type { ProductWithCategory } from '@shared/types';

interface ProductGridCardProps {
  product: ProductWithCategory;
}

export default function ProductGridCard({ product }: ProductGridCardProps) {
  // Pretext smart truncation: compute exact 2-line text at ~280px width
  const descFont = "14px 'Montserrat', sans-serif";
  const descMaxWidth = 280;
  const descLineHeight = 20;

  const { displayText, isTruncated } = useSmartTruncate(
    product.description || '',
    descFont,
    descMaxWidth,
    2,
    descLineHeight
  );

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <a
      href={`/product/${product.id}`}
      className="group block product-card-stagger"
      data-testid="product-card"
    >
      <div
        className="rounded-lg shadow-sm hover:shadow-md transition-shadow h-full p-6"
        style={{ backgroundColor: 'hsl(var(--bg-card))' }}
      >
        {/* Product Image */}
        <div
          className="relative aspect-square mb-6 overflow-hidden bg-gradient-to-br from-[hsla(var(--bg-primary),0.3)] to-[hsla(var(--bg-secondary),0.5)]"
          style={{ border: '1px solid hsla(var(--border-light))' }}
        >
          <img
            src={product.imageUrl || '/api/placeholder/300/300'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsla(var(--bg-overlay),0.8)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {product.category && (
            <div
              className="absolute top-2 right-2 px-2 py-0.5 text-[10px] tracking-wider uppercase rounded-full backdrop-blur-sm"
              style={{
                backgroundColor: 'hsla(var(--accent-vibrant), 0.9)',
                color: '#fff',
              }}
            >
              {product.category.name}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="text-center">
          <h3
            className="text-xl font-semibold mb-2 group-hover:text-turquoise-bright transition-colors duration-300"
            style={{
              fontFamily: "'Libre Baskerville', serif",
              color: 'hsl(var(--text-primary))',
            }}
          >
            {product.name}
          </h3>

          {/* Pretext-truncated description */}
          <p
            className="text-sm mb-4"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              color: 'hsl(var(--text-muted))',
              minHeight: descLineHeight * 2,
            }}
          >
            {displayText}
            {isTruncated && (
              <span style={{ color: 'hsl(var(--gold-medium) / 0.6)' }}>…</span>
            )}
          </p>

          <div
            className="flex items-center justify-between pt-4"
            style={{ borderTop: '1px solid hsla(var(--accent-vibrant),0.15)' }}
          >
            <span
              className="text-lg font-semibold"
              style={{
                fontFamily: "'Libre Baskerville', serif",
                color: 'hsl(var(--gold-medium))',
              }}
            >
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
