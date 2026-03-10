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
          <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))' }}>
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
              className="flex items-center gap-2 hover:opacity-80 transition-colors whitespace-nowrap" style={{ color: 'hsl(var(--accent-vibrant))' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Collections</span>
            </button>
            <span style={{ color: 'hsl(var(--gold-medium))' }}>/</span>
            {product.category && (
              <>
                <Link
                  href={`/products/${product.category.slug}`}
                  className="text-primary hover:text-turquoise-bright transition-colors whitespace-nowrap"
                >
                  {product.category.name}
                </Link>
                <span style={{ color: 'hsl(var(--gold-medium))' }}>/</span>
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
            <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))' }}>
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-4xl font-bold" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--gold-medium))' }}>
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            <p className="text-lg leading-relaxed" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>
              {product.description}
            </p>

            {/* Materials and Gemstones */}
            {(product.materials || product.gemstones || product.weight) && (
              <div className="space-y-3 p-6 crystal-card">
                {product.materials && product.materials.length > 0 && (
                  <div>
                    <span className="text-sm tracking-wider uppercase" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-muted))' }}>
                      Materials:{' '}
                    </span>
                    <span style={{ color: 'hsl(var(--text-primary))' }}>{product.materials.join(', ')}</span>
                  </div>
                )}
                {product.gemstones && product.gemstones.length > 0 && (
                  <div>
                    <span className="text-sm tracking-wider uppercase" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-muted))' }}>
                      Gemstones:{' '}
                    </span>
                    <span style={{ color: 'hsl(var(--text-primary))' }}>{product.gemstones.join(', ')}</span>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <span className="text-sm tracking-wider uppercase" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-muted))' }}>
                      Weight:{' '}
                    </span>
                    <span style={{ color: 'hsl(var(--text-primary))' }}>{product.weight}g</span>
                  </div>
                )}
                <div>
                  <span className="text-sm tracking-wider uppercase" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-muted))' }}>
                    SKU:{' '}
                  </span>
                  <span style={{ color: 'hsl(var(--text-primary))' }}>{product.sku}</span>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <span className="text-sm tracking-wider uppercase" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-muted))' }}>
                  Quantity
                </span>
                <div className="flex items-center border border-turquoise-soft rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 transition-colors" style={{ color: 'hsl(var(--accent-vibrant))' }}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 min-w-[4rem] text-center font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity ?? 99, quantity + 1))}
                    disabled={quantity >= (product.stockQuantity ?? 99)}
                    className="p-3 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" style={{ color: 'hsl(var(--accent-vibrant))' }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              {product.stockQuantity !== undefined && product.stockQuantity !== null ? (
                product.stockQuantity > 0 ? (
                  <p className="text-sm" style={{ color: 'hsl(var(--accent-vibrant))' }}>
                    ✓ In stock ({product.stockQuantity} available)
                  </p>
                ) : (
                  <p className="text-sm" style={{ color: 'hsl(var(--text-muted))' }}>
                    ✗ Out of stock
                  </p>
                )
              ) : product.inStock ? (
                <p className="text-sm" style={{ color: 'hsl(var(--accent-vibrant))' }}>✓ In stock</p>
              ) : (
                <p className="text-sm" style={{ color: 'hsl(var(--text-muted))' }}>✗ Out of stock</p>
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
                  className="p-4 border rounded-lg hover:opacity-80 transition-colors duration-300" style={{ borderColor: 'hsl(var(--gold-medium))', color: 'hsl(var(--gold-medium))' }}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Etsy Purchase Button */}
              <a
                href="https://www.etsy.com/ca/shop/TrovesandCoves"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <button className="w-full btn-etsy justify-center" style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: 'white',
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 600,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="inline-block mr-2">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm0 22C5.383 22 1 17.617 1 12S5.383 2 12 2s11 4.383 11 10-5.383 10-10 10zm0-16c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
                  </svg>
                  Buy on Etsy
                </button>
              </a>

              <Link href="/contact">
                <button className="w-full btn-mystical-outline justify-center">
                  Schedule Consultation
                </button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-turquoise-light">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2" style={{ color: 'hsl(var(--gold-medium))' }} />
                <p className="text-xs text-primary opacity-60">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2" style={{ color: 'hsl(var(--gold-medium))' }} />
                <p className="text-xs text-primary opacity-60">Lifetime Warranty</p>
              </div>
              <div className="text-center">
                <Gem className="w-6 h-6 mx-auto mb-2" style={{ color: 'hsl(var(--gold-medium))' }} />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border rounded-full" style={{ backgroundColor: 'hsla(43,95%,55%,0.1)', borderColor: 'hsl(var(--gold-medium))' }}>
            <Star className="w-4 h-4" style={{ color: 'hsl(var(--gold-medium))' }} />
            <span className="text-xs tracking-widest uppercase" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--gold-medium))' }}>
              You Might Also Love
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))' }}>
            Similar Pieces
          </h2>
          <p className="max-w-xl mx-auto" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>
            Discover more pieces crafted with intention to empower your energy
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
                <h3 className="text-lg font-semibold mb-2 group-hover:text-turquoise-bright transition-colors" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}>
                  {product.name}
                </h3>
                <p className="text-sm mb-3 line-clamp-2" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-muted))' }}>
                  {product.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-turquoise-light">
                  <span className="text-lg font-semibold" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--gold-medium))' }}>
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
              <span>View All Statement Pieces</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
