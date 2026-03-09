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

function ProductCardComponent({ product, featured = false }: ProductCardProps) {
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, 1);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been added to your wishlist.`,
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

  return (
    <Card
      className={`card-uniform product-card-interactive hover-sparkle cursor-pointer overflow-hidden ${
        featured ? 'border-2' : ''
      }`}
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
            <span className="block text-xs font-medium tracking-wide" style={{ color: '#e1af2f', fontFamily: "'Alex Brush', cursive" }}>
              {product.gemstones.join(", ")}
            </span>
          )}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold" style={{ color: '#deb55b', fontFamily: "'Libre Baskerville', serif" }}>
            {formatPrice(product.price)}
          </span>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            style={{
              backgroundColor: '#4abfbf',
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
