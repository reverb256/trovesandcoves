import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import type { ProductWithCategory } from "@shared/schema";

interface ProductCardProps {
  product: ProductWithCategory;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
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
      className={`card-uniform product-card-interactive hover-sparkle cursor-pointer bg-warm-cream luxury-shadow hover:luxury-shadow-lg overflow-hidden ${
        featured ? 'border-elegant-gold border-2' : ''
      }`}
      onClick={() => setLocation(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="product-image w-full h-64 object-cover"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleWishlist}
            className="bg-white/90 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="button-interactive bg-elegant-gold hover:bg-yellow-400 text-navy"
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
          className="absolute top-4 right-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity duration-300"
        >
          <Heart className="h-4 w-4 text-gray-600 hover:text-deep-burgundy" />
        </Button>

        {/* Stock Badge */}
        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <Badge variant="destructive" className="absolute top-4 left-4">
            Only {product.stockQuantity} left
          </Badge>
        )}
        
        {product.stockQuantity === 0 && (
          <Badge variant="secondary" className="absolute top-4 left-4">
            Out of Stock
          </Badge>
        )}

        {featured && (
          <Badge className="absolute bottom-4 left-4 bg-elegant-gold text-navy">
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
        
        <h3 className="font-serif text-lg font-semibold text-navy mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.materials?.join(", ")}
          {product.gemstones && product.gemstones.length > 0 && (
            <span className="block text-xs text-elegant-gold font-medium">
              {product.gemstones.join(", ")}
            </span>
          )}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-elegant-gold">
            {formatPrice(product.price)}
          </span>
          
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className="bg-navy text-white hover:bg-rich-blue transition-colors"
          >
            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
