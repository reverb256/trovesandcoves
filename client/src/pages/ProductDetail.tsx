import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import {
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  Gem,
  Star,
  ArrowLeft,
  Minus,
  Plus,
  Share2,
  ChevronRight,
} from 'lucide-react';
import type { ProductWithCategory } from '@shared/schema';

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const productId = parseInt(params.id!);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<ProductWithCategory>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId && !isNaN(productId),
  });

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product.id, quantity);
    toast({
      title: 'Added to Cart',
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  const handleWishlist = () => {
    if (!product) return;

    toast({
      title: 'Added to Wishlist',
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="flex space-x-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-serif font-bold text-navy mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or may have been
              removed.
            </p>
            <Button
              onClick={() => setLocation('/products')}
              className="bg-navy hover:bg-rich-blue text-white"
            >
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const images =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : [product.imageUrl];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-warm via-pearl-cream to-moonstone">
      <div className="bg-gradient-to-r from-crystal-accents/90 to-pearl-cream/90 border-b-2 border-ornate-frame-gold/30 shadow-lg backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/products')}
                className="text-troves-turquoise hover:text-skull-turquoise hover:bg-skull-turquoise/10 border border-troves-turquoise/30 rounded-lg transition-all duration-200 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Crystal Collections
              </Button>
              <ChevronRight className="h-4 w-4 text-ornate-frame-gold" />
              {product.category && (
                <>
                  <Link
                    href={`/products/${product.category.slug}`}
                    className="text-coves-cursive-blue hover:text-skull-turquoise transition-colors font-medium"
                  >
                    {product.category.name}
                  </Link>
                  <ChevronRight className="h-4 w-4 text-ornate-frame-gold" />
                </>
              )}
              <span
                className="text-troves-turquoise font-bold max-w-[300px] truncate"
                title={product.name}
              >
                {product.name}
              </span>
            </div>

            {/* Quick Share Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-turquoise-600"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-turquoise-600"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-lg luxury-shadow-lg bg-white">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
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
              {product.isFeatured && (
                <Badge className="absolute top-4 right-4 bg-elegant-gold text-navy">
                  Featured
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden transition-all ${
                      selectedImage === index
                        ? 'border-elegant-gold'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <Badge
                variant="outline"
                className="text-elegant-gold border-elegant-gold"
              >
                {product.category.name}
              </Badge>
            )}

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-navy">
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-3xl font-bold text-elegant-gold">
              {formatPrice(product.price)}
            </div>

            {/* Materials and Gemstones */}
            <div className="space-y-2">
              {product.materials && product.materials.length > 0 && (
                <p className="text-gray-700">
                  <span className="font-medium">Materials:</span>{' '}
                  {product.materials.join(', ')}
                </p>
              )}
              {product.gemstones && product.gemstones.length > 0 && (
                <p className="text-gray-700">
                  <span className="font-medium">Gemstones:</span>{' '}
                  {product.gemstones.join(', ')}
                </p>
              )}
              {product.weight && (
                <p className="text-gray-700">
                  <span className="font-medium">Weight:</span> {product.weight}g
                </p>
              )}
              <p className="text-gray-700">
                <span className="font-medium">SKU:</span> {product.sku}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-navy">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setQuantity(Math.min(product.stockQuantity, quantity + 1))
                    }
                    disabled={quantity >= product.stockQuantity}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stock Status */}
              {product.stockQuantity > 0 ? (
                <p className="text-green-600 text-sm">
                  ✓ In stock ({product.stockQuantity} available)
                </p>
              ) : (
                <p className="text-red-600 text-sm">✗ Out of stock</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                {(product as any).etsyLink ? (
                  <Button
                    onClick={() =>
                      window.open((product as any).etsyLink, '_blank')
                    }
                    disabled={product.stockQuantity === 0}
                    className="flex-1 bg-navy text-white hover:bg-rich-blue h-12"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {product.stockQuantity === 0
                      ? 'Out of Stock'
                      : 'Buy on Etsy'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                    className="flex-1 bg-navy text-white hover:bg-rich-blue h-12"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {product.stockQuantity === 0
                      ? 'Out of Stock'
                      : 'Add to Cart'}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleWishlist}
                  className="border-navy text-navy hover:bg-navy hover:text-white h-12 px-6"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => setLocation('/contact')}
                className="w-full border-elegant-gold text-elegant-gold hover:bg-elegant-gold hover:text-navy h-12"
              >
                Schedule Consultation
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <Truck className="h-6 w-6 text-elegant-gold mx-auto mb-2" />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-elegant-gold mx-auto mb-2" />
                <p className="text-xs text-gray-600">Lifetime Warranty</p>
              </div>
              <div className="text-center">
                <Gem className="h-6 w-6 text-elegant-gold mx-auto mb-2" />
                <p className="text-xs text-gray-600">Ethically Sourced</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-lg">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="care">Care Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-navy mb-3">
                        Specifications
                      </h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">SKU:</dt>
                          <dd className="font-medium">{product.sku}</dd>
                        </div>
                        {product.weight && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Weight:</dt>
                            <dd className="font-medium">{product.weight}g</dd>
                          </div>
                        )}
                        {product.materials && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Materials:</dt>
                            <dd className="font-medium">
                              {product.materials.join(', ')}
                            </dd>
                          </div>
                        )}
                        {product.gemstones && product.gemstones.length > 0 && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Gemstones:</dt>
                            <dd className="font-medium">
                              {product.gemstones.join(', ')}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy mb-3">
                        Certifications
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>✓ Ethically sourced materials</li>
                        <li>✓ Conflict-free diamonds</li>
                        <li>✓ Quality assurance certified</li>
                        <li>✓ Lifetime warranty included</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="care" className="mt-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-navy mb-2">
                        Care Instructions
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Clean with a soft, lint-free cloth</li>
                        <li>
                          • Store in individual pouches to prevent scratching
                        </li>
                        <li>• Avoid exposure to chemicals and perfumes</li>
                        <li>• Remove before swimming or exercising</li>
                        <li>• Professional cleaning recommended annually</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy mb-2">
                        Customer Support
                      </h3>
                      <p className="text-gray-700">
                        Our crystal experts are available online to provide care
                        guidance and answer questions about your jewelry.
                        Contact us through our website for personalized
                        assistance with your crystal pieces.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts
        categoryId={product.categoryId}
        currentProductId={product.id}
      />
    </div>
  );
}

// Related Products Component for Enhanced UX Flow
function RelatedProducts({
  categoryId,
  currentProductId,
}: {
  categoryId: number | null;
  currentProductId: number;
}) {
  const { data: relatedProducts, isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ['/api/products', { category: categoryId, limit: 4 }],
    enabled: !!categoryId,
  });

  const filteredProducts = relatedProducts
    ?.filter(p => p.id !== currentProductId)
    .slice(0, 3);

  if (isLoading || !filteredProducts || filteredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-stone-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="glass-jewelry mb-4 px-4 py-2 highlight-amethyst">
            <Star className="h-3 w-3 mr-2" />
            You Might Also Love
          </Badge>
          <h2 className="text-display text-3xl md:text-4xl mb-4 layered-styling">
            <span className="text-crystal">Similar</span> Pieces
          </h2>
          <p className="text-body text-foreground-muted max-w-xl mx-auto">
            Discover more crystalline treasures from our curated collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="mystical-card hover:gold-glow transition-all duration-500 group cursor-pointer h-full skull-accent">
                <CardContent className="p-6">
                  <div className="aspect-square mb-4 rounded-lg overflow-hidden raw-crystal-texture">
                    <img
                      src={product.imageUrl || '/api/placeholder/300/300'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-display text-lg mb-2 group-hover:text-rose-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-body text-foreground-muted text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-display text-lg font-semibold text-gold-500">
                      ${product.price}
                    </span>
                    {product.category && (
                      <Badge className="highlight-rose-quartz text-xs">
                        {product.category.name}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Enhanced Navigation CTA */}
        <div className="text-center mt-12">
          <Link href="/products">
            <Button className="btn-organic px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
              Explore Full Collection
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
