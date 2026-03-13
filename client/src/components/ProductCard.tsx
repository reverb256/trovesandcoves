import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { memo, useState } from "react";
import type { ProductWithCategory } from "@shared/types";
import { WebPImage } from "@/components/WebPImage";

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stockQuantity === 0) return;
    
    addToCart(product.id, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    
    toast({
      title: "Added to Cart",
      description: product.name,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
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
      className="group cursor-pointer overflow-hidden transition-shadow duration-500 ease-out hover:shadow-2xl"
      style={{
        backgroundColor: 'hsl(var(--bg-card))',
        border: featured ? '2px solid hsl(var(--gold-medium))' : '1px solid hsl(var(--border-light))',
        borderRadius: '8px',
      }}
      onClick={() => setLocation(`/product/${product.id}`)}
    >
      {/* Image Container - Luxury Framed */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 1.1' }}>
        <WebPImage
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={440}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Subtle Wishlist Icon - Top Right */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
          style={{
            backgroundColor: isWishlisted ? 'hsl(var(--gold-medium))' : 'hsl(var(--bg-card) / 0.9)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart 
            className="w-4 h-4 transition-colors duration-300" 
            style={{ 
              color: isWishlisted ? 'hsl(var(--bg-overlay))' : 'hsl(var(--text-primary))',
              fill: isWishlisted ? 'hsl(var(--bg-overlay))' : 'none'
            }} 
          />
        </button>

        {/* Out of Stock Overlay - Elegant */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: 'hsl(var(--bg-card) / 0.8)' }}>
            <span 
              className="text-sm tracking-widest uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--text-secondary))' }}
            >
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content - Clean and Minimal */}
      <CardContent className="p-6">
        {/* Category - Subtle */}
        {product.category && (
          <p 
            className="text-xs tracking-wider uppercase mb-2"
            style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--text-secondary))' }}
          >
            {product.category.name}
          </p>
        )}

        {/* Product Name - Luxury Serif */}
        <h3 
          className="text-lg leading-snug mb-3 line-clamp-2 transition-colors duration-300"
          style={{ 
            fontFamily: "'Libre Baskerville', serif", 
            color: 'hsl(var(--text-primary))',
            fontWeight: 500
          }}
        >
          {product.name}
        </h3>

        {/* Gemstones - Elegant Script Display */}
        {product.gemstones && product.gemstones.length > 0 && (
          <p 
            className="text-sm mb-4"
            style={{ 
              fontFamily: "'Alex Brush', cursive", 
              color: 'hsl(var(--gold-medium))',
              fontSize: '1.1rem'
            }}
          >
            {product.gemstones.join(", ")}
          </p>
        )}

        {/* Price and Add - Bottom Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Price - Gold Accent */}
          <span 
            className="text-xl font-semibold"
            style={{ 
              fontFamily: "'Libre Baskerville', serif", 
              color: 'hsl(var(--gold-medium))' 
            }}
          >
            {formatPrice(product.price)}
          </span>

          {/* Add to Cart - Minimal Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="px-5 py-2.5 text-sm tracking-wider uppercase transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              backgroundColor: isAdded ? 'hsl(var(--accent-vibrant))' : 'hsl(var(--text-primary))',
              color: 'hsl(var(--bg-primary))',
              border: 'none',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => {
              if (!isAdded && !isOutOfStock) {
                e.currentTarget.style.backgroundColor = 'hsl(var(--accent-vibrant))';
              }
            }}
            onMouseLeave={(e) => {
              if (!isAdded && !isOutOfStock) {
                e.currentTarget.style.backgroundColor = 'hsl(var(--text-primary))';
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