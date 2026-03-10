import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { memo } from "react";
import type { ProductWithCategory } from "@shared/types";

interface ProductCardProps {
  product: ProductWithCategory;
  featured?: boolean;
}

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { memo, useState } from "react";
import type { ProductWithCategory } from "@shared/types";

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
      className="group cursor-pointer overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl"
      style={{
        backgroundColor: '#ffffff',
        border: featured ? '2px solid #e1af2f' : '1px solid #f0f0f0',
        borderRadius: '8px',
      }}
      onClick={() => setLocation(`/product/${product.id}`)}
    >
      {/* Image Container - Luxury Framed */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 1.1' }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Subtle Wishlist Icon - Top Right */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: isWishlisted ? '#e1af2f' : 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart 
            className="w-4 h-4 transition-colors duration-300" 
            style={{ 
              color: isWishlisted ? '#ffffff' : '#1f1f1f',
              fill: isWishlisted ? '#ffffff' : 'none'
            }} 
          />
        </button>

        {/* Out of Stock Overlay - Elegant */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <span 
              className="text-sm tracking-widest uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif", color: '#5f5f5f' }}
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
            style={{ fontFamily: "'Montserrat', sans-serif", color: '#5f5f5f' }}
          >
            {product.category.name}
          </p>
        )}

        {/* Product Name - Luxury Serif */}
        <h3 
          className="text-lg leading-snug mb-3 line-clamp-2 transition-colors duration-300"
          style={{ 
            fontFamily: "'Libre Baskerville', serif", 
            color: '#1f1f1f',
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
              color: '#e1af2f',
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
              color: '#e1af2f' 
            }}
          >
            {formatPrice(product.price)}
          </span>

          {/* Add to Cart - Minimal Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="px-5 py-2.5 text-sm tracking-wider uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              backgroundColor: isAdded ? '#4abfbf' : '#1f1f1f',
              color: '#faf8f3',
              border: 'none',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => {
              if (!isAdded && !isOutOfStock) {
                e.currentTarget.style.backgroundColor = '#4abfbf';
              }
            }}
            onMouseLeave={(e) => {
              if (!isAdded && !isOutOfStock) {
                e.currentTarget.style.backgroundColor = '#1f1f1f';
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
      style={{
        backgroundColor: 'hsl(var(--bg-card))',
        boxShadow: '0 4px 12px hsla(var(--border-medium), 0.2)',
      }}
      onClick={() => setLocation(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image w-full h-64 object-cover"
          loading="lazy"
          decoding="async"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3" style={{ backgroundColor: 'hsla(var(--bg-primary), 0.2)' }}>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleWishlist}
            style={{ backgroundColor: 'hsl(var(--bg-card))' }}
            className="hover:opacity-90"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleAddToCart}
            style={{ backgroundColor: 'hsl(var(--gold-medium))', color: 'hsl(var(--text-primary))' }}
            className="hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>

        {/* Wishlist Button - Always Visible on Mobile */}
        <Button
          size="sm"
          variant="secondary"
          onClick={handleWishlist}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: 'hsl(var(--bg-card))' }}
        >
          <Heart className="h-4 w-4" style={{ color: 'hsl(var(--text-secondary))' }} />
        </Button>

        {/* Stock Badge */}
        {(product.stockQuantity === undefined || product.stockQuantity === null) ? (
          product.inStock === false && (
            <Badge variant="secondary" className="absolute top-4 left-4">
              Out of Stock
            </Badge>
          )
        ) : product.stockQuantity <= 5 && product.stockQuantity > 0 ? (
          <Badge variant="turquoise" className="absolute top-4 left-4">
            Only {product.stockQuantity} left
          </Badge>
        ) : product.stockQuantity === 0 && (
          <Badge variant="secondary" className="absolute top-4 left-4">
            Out of Stock
          </Badge>
        )}

        {featured && (
          <Badge variant="gold" className="absolute bottom-4 left-4">
            Featured
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        <div className="mb-2">
          {product.category && (
            <Badge variant="outline" className="text-xs mb-2">
              {product.category.name}
            </Badge>
          )}
        </div>

        <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2" style={{ color: 'hsl(var(--text-primary))' }}>
          {product.name}
        </h3>

        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'hsl(var(--text-secondary))' }}>
          {product.materials?.join(", ")}
          {product.gemstones && product.gemstones.length > 0 && (
            <span className="block text-xs font-medium tracking-wide" style={{ color: 'hsl(var(--gold-medium))', fontFamily: "'Alex Brush', cursive" }}>
              {product.gemstones.join(", ")}
            </span>
          )}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold" style={{ color: 'hsl(var(--gold-medium))', fontFamily: "'Libre Baskerville', serif" }}>
            {formatPrice(product.price)}
          </span>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            style={{
              backgroundColor: 'hsl(var(--accent-vibrant))',
              color: 'hsl(var(--bg-primary))',
              fontFamily: "'Montserrat', sans-serif"
            }}
            className="hover:opacity-90 transition-all duration-300"
          >
            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Memoize component to prevent unnecessary re-renders
// Only re-render when product.id or product.price changes
export default memo(ProductCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.stockQuantity === nextProps.product.stockQuantity &&
    prevProps.featured === nextProps.featured
  );
});
