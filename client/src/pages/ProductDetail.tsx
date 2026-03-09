import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation, Link } from 'wouter';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import {
  Heart,
  ShoppingBag,
  Shield,
  Gem,
  Star,
  ArrowLeft,
  Minus,
  Plus,
  Sparkles,
  Truck,
} from 'lucide-react';
import type { ProductWithCategory } from '@shared/types';

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const productId = parseInt((params as Record<string, string>).id || '0');
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
      <div className="min-h-screen bg-mystical-gradient flex items-center justify-center content-layer">
        <div className="crystal-card p-16">
          <div className="w-20 h-20 border-4 border-[hsla(var(--accent-vibrant),0.2)] border-t-[hsla(var(--accent-vibrant),0.8)] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-mystical-gradient flex items-center justify-center content-layer">
        <div className="crystal-card p-16 text-center max-w-md">
          <Gem className="w-16 h-16 text-turquoise-bright opacity-50 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Crystal Not Found
          </h2>
          <p className="text-primary opacity-60 mb-8">
            The crystal you seek does not exist or has transcended to another realm.
          </p>
          <button onClick={() => setLocation('/products')} className="btn-mystical">
            Browse Collections
          </button>
        </div>
      </div>
    );
  }

  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl];

  return (
    <div className="min-h-screen bg-mystical-gradient content-layer">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-turquoise-light">
        <div className="chamber-container py-4">
          <div className="flex items-center gap-3 text-sm overflow-x-auto">
            <button
              onClick={() => setLocation('/products')}
              className="flex items-center gap-2 text-turquoise-bright hover:text-[hsl(var(--accent-vibrant))] transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Collections</span>
            </button>
            <span className="text-[hsla(var(--gold-medium),0.5)]">/</span>
            {product.category && (
              <>
                <Link
                  href={`/products/${product.category.slug}`}
                  className="text-primary hover:text-turquoise-bright transition-colors whitespace-nowrap"
                >
                  {product.category.name}
                </Link>
                <span className="text-[hsla(var(--gold-medium),0.5)]">/</span>
              </>
            )}
            <span className="text-primary opacity-60 truncate max-w-[200px]" title={product.name}>
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="chamber-container py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="crystal-card p-2">
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[hsla(var(--bg-primary),0.3)] to-[hsla(var(--bg-secondary),0.5)] border border-turquoise-light">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Stock Badge */}
                {product.stockQuantity !== undefined && product.stockQuantity !== null ? (
                  product.stockQuantity <= 5 && product.stockQuantity > 0 ? (
                    <div className="absolute top-4 left-4 px-3 py-1 text-xs tracking-wider uppercase bg-gold-medium border border-gold-soft text-gold-bright rounded-full backdrop-blur-sm">
                      Only {product.stockQuantity} left
                    </div>
                  ) : product.stockQuantity === 0 && (
                    <div className="absolute top-4 left-4 px-3 py-1 text-xs tracking-wider uppercase bg-[hsla(var(--bg-tertiary),0.3)] border border-[hsla(var(--border-medium),0.4)] text-primary rounded-full backdrop-blur-sm">
                      Out of Stock
                    </div>
                  )
                ) : !product.inStock && (
                  <div className="absolute top-4 left-4 px-3 py-1 text-xs tracking-wider uppercase bg-[hsla(var(--bg-tertiary),0.3)] border border-[hsla(var(--border-medium),0.4)] text-primary rounded-full backdrop-blur-sm">
                    Out of Stock
                  </div>
                )}
                {product.isFeatured && (
                  <div className="absolute top-4 right-4 px-3 py-1 text-xs tracking-wider uppercase bg-gold-medium border border-gold-soft text-gold-bright rounded-full backdrop-blur-sm flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 overflow-hidden transition-colors duration-300 ${
                      selectedImage === index
                        ? 'border-[hsl(174,85%,45%)] glow-turquoise'
                        : 'border-[hsla(var(--accent-vibrant),0.2)] hover:border-[hsla(var(--accent-vibrant),0.4)]'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Category Badge */}
            {product.category && (
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-turquoise-soft rounded-full bg-turquoise-soft">
                <Sparkles className="w-4 h-4 text-turquoise-bright" />
                <span className="text-xs tracking-wider uppercase text-turquoise-bright">
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-4xl font-bold text-gold-bright glow-gold">
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            <p className="text-lg text-primary opacity-80 leading-relaxed">
              {product.description}
            </p>

            {/* Materials and Gemstones */}
            {(product.materials || product.gemstones || product.weight) && (
              <div className="space-y-3 p-6 crystal-card">
                {product.materials && product.materials.length > 0 && (
                  <div>
                    <span className="text-sm tracking-wider uppercase text-primary opacity-60">
                      Materials:{' '}
                    </span>
                    <span className="text-primary">{product.materials.join(', ')}</span>
                  </div>
                )}
                {product.gemstones && product.gemstones.length > 0 && (
                  <div>
                    <span className="text-sm tracking-wider uppercase text-primary opacity-60">
                      Gemstones:{' '}
                    </span>
                    <span className="text-primary">{product.gemstones.join(', ')}</span>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <span className="text-sm tracking-wider uppercase text-primary opacity-60">
                      Weight:{' '}
                    </span>
                    <span className="text-primary">{product.weight}g</span>
                  </div>
                )}
                <div>
                  <span className="text-sm tracking-wider uppercase text-primary opacity-60">
                    SKU:{' '}
                  </span>
                  <span className="text-primary">{product.sku}</span>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <span className="text-sm tracking-wider uppercase text-primary opacity-60">
                  Quantity
                </span>
                <div className="flex items-center border border-turquoise-soft rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-turquoise-bright hover:bg-turquoise-soft transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 min-w-[4rem] text-center text-primary font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity ?? 99, quantity + 1))}
                    disabled={quantity >= (product.stockQuantity ?? 99)}
                    className="p-3 text-turquoise-bright hover:bg-turquoise-soft transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              {product.stockQuantity !== undefined && product.stockQuantity !== null ? (
                product.stockQuantity > 0 ? (
                  <p className="text-sm text-turquoise-bright">
                    ✓ In stock ({product.stockQuantity} available)
                  </p>
                ) : (
                  <p className="text-sm text-primary opacity-60">
                    ✗ Out of stock
                  </p>
                )
              ) : product.inStock ? (
                <p className="text-sm text-turquoise-bright">✓ In stock</p>
              ) : (
                <p className="text-sm text-primary opacity-60">✗ Out of stock</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className="flex-1 btn-mystical justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={handleWishlist}
                  className="p-4 border border-gold-soft rounded-lg text-gold-bright hover:bg-gold-soft transition-colors duration-300"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <Link href="/contact">
                <button className="w-full btn-mystical-outline justify-center">
                  Schedule Consultation
                </button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-turquoise-light">
              <div className="text-center">
                <Truck className="w-6 h-6 text-gold-bright mx-auto mb-2" />
                <p className="text-xs text-primary opacity-60">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-gold-bright mx-auto mb-2" />
                <p className="text-xs text-primary opacity-60">Lifetime Warranty</p>
              </div>
              <div className="text-center">
                <Gem className="w-6 h-6 text-gold-bright mx-auto mb-2" />
                <p className="text-xs text-primary opacity-60">Ethically Sourced</p>
              </div>
            </div>
          </div>
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

// Related Products Component
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
    ?.filter((p) => p.id !== currentProductId)
    .slice(0, 3);

  if (isLoading || !filteredProducts || filteredProducts.length === 0) {
    return null;
  }

  return (
    <section className="chamber-section border-t border-turquoise-light">
      <div className="chamber-container">
        <div className="text-center mb-12">
          {/* Mystical Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-gold-soft rounded-full bg-gold-soft">
            <Star className="w-4 h-4 text-gold-bright" />
            <span className="text-xs tracking-widest uppercase text-primary">
              You Might Also Love
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-shimmer">Similar Pieces</span>
          </h2>
          <p className="text-primary opacity-60 max-w-xl mx-auto">
            Discover more crystalline treasures from our curated collection
          </p>
        </div>

        <div className="crystal-grid">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group block">
              <div className="crystal-card h-full p-6">
                <div className="aspect-square mb-4 overflow-hidden bg-gradient-to-br from-[hsla(var(--bg-primary),0.3)] to-[hsla(var(--bg-secondary),0.5)] border border-turquoise-light">
                  <img
                    src={product.imageUrl || '/api/placeholder/300/300'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-turquoise-bright transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-primary opacity-60 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-turquoise-light">
                  <span className="text-lg font-semibold text-gold-bright">
                    ${product.price}
                  </span>
                  {product.category && (
                    <span className="text-xs px-3 py-1 bg-turquoise-soft border border-[hsla(var(--accent-vibrant),0.2)] text-turquoise-bright rounded-full">
                      {product.category.name}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <button className="btn-mystical-outline group">
              <span>Explore Full Collection</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
