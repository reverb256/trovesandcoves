import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { memo, useState } from 'react';
import type { ProductWithCategory } from '@shared/types';
import { WebPImage } from '@/components/WebPImage';
import { useTextHeight } from '@/lib/pretext';

interface ProductCardProps {
  product: ProductWithCategory;
  featured?: boolean;
}

function ProductCardComponent({ product, featured = false }: ProductCardProps) {
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Pre-compute product name height for zero-CLS rendering.
  // Card content is ~280px wide in the 3-col grid; font is 20px Libre Baskerville.
  const nameFont = "500 20px 'Libre Baskerville', serif";
  const nameLineHeight = 28; // leading-snug ~1.4 at 20px
  const nameMaxWidth = 280;
  const nameHeight = useTextHeight(
    product.name,
    nameFont,
    nameMaxWidth,
    nameLineHeight
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stockQuantity === 0) return;

    addToCart(product.id, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);

    toast({
      title: 'Added to Cart',
      description: product.name,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
      description: product.name,
    });
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const isOutOfStock = product.stockQuantity === 0 || product.inStock === false;

  return (
    <Card
      data-testid="product-card"
      className="product-card-enhanced group cursor-pointer overflow-hidden"
      style={{
        backgroundColor: 'hsl(var(--bg-card))',
        border: featured
          ? '2px solid hsl(var(--gold-medium))'
          : '1px solid hsl(var(--border-light))',
        borderRadius: '12px',
      }}
      onClick={() => setLocation(`/product/${product.id}`)}
    >
      {/* Image Container - More Prominent */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '1 / 1.15' }}
      >
        <WebPImage
          src={product.imageUrl}
          alt={product.name}
          width={600}
          height={690}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Subtle Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsla(var(--bg-overlay),0.6)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Wishlist Icon - Top Right */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: isWishlisted
              ? 'hsl(var(--gold-medium))'
              : 'hsla(var(--bg-card),0.9)',
            boxShadow: '0 2px 12px hsla(0,0%,0%,0.15)',
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className="w-5 h-5 transition-colors duration-300"
            style={{
              color: isWishlisted
                ? 'hsl(var(--bg-card))'
                : 'hsl(var(--text-primary))',
              fill: isWishlisted ? 'hsl(var(--bg-card))' : 'none',
            }}
          />
        </button>

        {/* Out of Stock Overlay - Elegant */}
        {isOutOfStock && (
          <div
            className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: 'hsla(var(--bg-card),0.85)' }}
          >
            <span
              className="text-sm tracking-widest uppercase"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: 'hsl(var(--text-secondary))',
              }}
            >
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content - More Spacing */}
      <CardContent className="p-6">
        {/* Category - Subtle */}
        {product.category && (
          <p
            className="text-xs tracking-wider uppercase mb-3"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              color: 'hsl(var(--text-muted))',
              letterSpacing: '0.15em',
            }}
          >
            {product.category.name}
          </p>
        )}

        {/* Product Name - Luxury Serif — Pretext pre-computed height for zero CLS */}
        <h3
          className="text-xl leading-snug mb-4 line-clamp-2 transition-colors duration-300 group-hover:text-[hsl(var(--accent-vibrant))]"
          style={{
            fontFamily: "'Libre Baskerville', serif",
            color: 'hsl(var(--text-primary))',
            fontWeight: 500,
            minHeight: nameHeight.height ? `${nameHeight.height}px` : '3rem',
          }}
        >
          {product.name}
        </h3>

        {/* Gemstones - Elegant Script Display */}
        {product.gemstones && product.gemstones.length > 0 && (
          <p
            className="text-sm mb-5"
            style={{
              fontFamily: "'Alex Brush', cursive",
              color: 'hsl(var(--gold-medium))',
              fontSize: '1.15rem',
              lineHeight: '1.4',
            }}
          >
            {product.gemstones.join(' • ')}
          </p>
        )}

        {/* Premium Section Divider */}
        <div
          className="w-12 h-px mb-5"
          style={{
            background:
              'linear-gradient(90deg, hsl(var(--skull-turquoise)), hsl(var(--frame-gold)))',
            opacity: 0.4,
          }}
        />

        {/* Price and Add - Bottom Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Price - Gold Accent */}
          <span
            className="text-2xl font-semibold"
            style={{
              fontFamily: "'Libre Baskerville', serif",
              color: 'hsl(var(--gold-medium))',
            }}
          >
            {formatPrice(product.price)}
          </span>

          {/* Add to Cart - Minimal Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="px-6 py-3 text-sm tracking-wider uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              backgroundColor: isAdded
                ? 'hsl(var(--accent-vibrant))'
                : 'hsl(var(--text-primary))',
              color: 'hsl(var(--bg-card))',
              border: 'none',
              borderRadius: '6px',
            }}
            onMouseEnter={e => {
              if (!isAdded && !isOutOfStock) {
                e.currentTarget.style.backgroundColor =
                  'hsl(var(--accent-vibrant))';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              if (!isAdded && !isOutOfStock) {
                e.currentTarget.style.backgroundColor =
                  'hsl(var(--text-primary))';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isAdded ? 'Added' : 'Add'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// Memoize for performance
export default memo(ProductCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.stockQuantity === nextProps.product.stockQuantity &&
    prevProps.featured === nextProps.featured
  );
});
