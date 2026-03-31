import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation, Link } from 'wouter';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import {
  ShoppingBag,
  ArrowLeft,
  Minus,
  Plus,
  Truck,
  Shield,
  Gem,
  Sparkles,
  Heart,
} from 'lucide-react';
import type { ProductWithCategory } from '@shared/types';
import { WebPImage } from '@/components/WebPImage';
import SEOHead from '@/components/SEOHead';
import { ProductSchema, BreadcrumbSchema } from '@/components/SchemaOrg';

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const productId = parseInt((params as Record<string, string>).id || '0');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
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
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
      description: product?.name || '',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen content-layer flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--bg-primary))' }}>
        <div className="p-16">
          <div className="w-12 h-12 border-2 border-[hsl(var(--accent-vibrant))]/20 border-t-[hsl(var(--accent-vibrant))] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen content-layer flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--bg-primary))' }}>
        <div className="p-16 text-center max-w-md">
          <Gem className="w-16 h-16 text-[hsl(var(--accent-vibrant))]/50 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}>
            Product Not Found
          </h2>
          <p className="text-[hsl(var(--text-secondary))] mb-8" style={{ fontFamily: '"Montserrat", sans-serif' }}>
            The product you are looking for does not exist.
          </p>
          <button
            onClick={() => setLocation('/products')}
            className="px-6 py-3 bg-[hsl(var(--accent-vibrant))] hover:opacity-90 text-white rounded-sm transition-colors duration-200"
            style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 500 }}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl];

  // Generate crystal properties based on gemstones
  const getCrystalProperties = (gemstones: string[] | null | undefined) => {
    if (!gemstones || gemstones.length === 0) return [];

    const properties: { title: string; description: string; icon: string }[] = [];

    gemstones.forEach(stone => {
      const lowerStone = stone.toLowerCase();
      if (lowerStone.includes('moonstone')) {
        properties.push(
          { title: 'Intuition', description: 'Moonstone enhances inner wisdom and emotional balance', icon: '🌙' },
          { title: 'New Beginnings', description: 'A stone of fresh starts and positive transformation', icon: '✨' }
        );
      }
      if (lowerStone.includes('amethyst')) {
        properties.push(
          { title: 'Calm & Clarity', description: 'Amethyst brings peace of mind and spiritual awareness', icon: '💜' },
          { title: 'Protection', description: 'A protective stone that transmutes negative energy', icon: '🛡️' }
        );
      }
      if (lowerStone.includes('quartz')) {
        properties.push(
          { title: 'Amplification', description: 'Clear quartz amplifies energy and intention', icon: '💎' },
          { title: 'Clarity', description: 'Brings mental clarity and focus to your thoughts', icon: '🔮' }
        );
      }
      if (lowerStone.includes('labradorite')) {
        properties.push(
          { title: 'Magic', description: 'Labradorite awakens mystical abilities and intuition', icon: '🌟' },
          { title: 'Transformation', description: 'Supports personal growth and positive change', icon: '🦋' }
        );
      }
    });

    return properties.slice(0, 4); // Limit to 4 properties
  };

  const crystalProperties = getCrystalProperties(product.gemstones);

  return (
    <>
      <SEOHead
        path={`/product/${product.id}`}
        productName={product.name}
        image={product.imageUrl}
        type="product"
      />
      <ProductSchema
        name={product.name}
        description={product.description || ''}
        imageUrl={product.imageUrl}
        price={product.price}
        stockQuantity={product.stockQuantity || 0}
        category={product.category}
        id={product.id.toString()}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Shop', path: '/products' },
          ...(product.category ? [{ name: product.category.name, path: `/products/${product.category.slug}` }] : []),
          { name: product.name, path: `/product/${product.id}` }
        ]}
      />

      <div className="min-h-screen content-layer" style={{ backgroundColor: 'hsl(var(--bg-primary))' }}>
        {/* Breadcrumb Navigation - Minimal */}
        <div className="border-b border-[hsl(var(--border-light))]">
          <div className="chamber-container">
            <div className="flex items-center gap-3 text-sm py-4 overflow-x-auto">
              <button
                onClick={() => setLocation('/products')}
                className="flex items-center gap-2 hover:opacity-70 transition-opacity whitespace-nowrap"
                style={{ color: 'hsl(var(--accent-vibrant))', fontFamily: '"Montserrat", sans-serif' }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Shop</span>
              </button>
              {product.category && (
                <>
                  <span style={{ color: 'hsl(var(--gold-medium))' }}>/</span>
                  <Link
                    href={`/products/${product.category.slug}`}
                    className="hover:text-[hsl(var(--accent-vibrant))] transition-colors whitespace-nowrap"
                    style={{ color: 'hsl(var(--text-secondary))', fontFamily: '"Montserrat", sans-serif' }}
                  >
                    {product.category.name}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Product Section - Spacious Layout */}
        <div className="spacing-premium-xl">
          <div className="chamber-container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

              {/* Left: Large Hero Image Gallery */}
              <div className="space-y-4">
                {/* Main Image - Dominant and Immersive */}
                <div className="product-hero-image product-zoom-trigger shadow-lg">
                  <WebPImage
                    src={images[selectedImage]}
                    alt={product.name}
                    width={1000}
                    height={1000}
                    className="w-full h-full"
                  />
                  {/* Stock Badge - Elegant */}
                  {product.stockQuantity !== undefined && product.stockQuantity !== null && (
                    product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                      <div className="absolute top-6 left-6 px-4 py-2 text-xs tracking-wider uppercase bg-[hsla(var(--bg-card),0.95)] backdrop-blur-md rounded-sm"
                        style={{
                          fontFamily: '"Montserrat", sans-serif',
                          color: 'hsl(var(--gold-medium))',
                          border: '1px solid hsl(var(--gold-medium))',
                          boxShadow: '0 2px 12px hsla(0,0%,0%,0.1)'
                        }}
                      >
                        Only {product.stockQuantity} left
                      </div>
                    )
                  )}
                  {product.stockQuantity === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
                      style={{ backgroundColor: 'hsla(var(--bg-card),0.85)' }}
                    >
                      <span className="text-sm tracking-widest uppercase"
                        style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}
                      >
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="gallery-thumbnails">
                    {images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`gallery-thumbnail ${selectedImage === index ? 'active' : ''}`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <WebPImage
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Product Details - Spacious Layout */}
              <div className="space-y-8 lg:space-y-10">
                {/* Category Badge - Subtle */}
                {product.category && (
                  <div>
                    <span
                      className="text-xs tracking-widest uppercase"
                      style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-muted))', letterSpacing: '0.2em' }}
                    >
                      {product.category.name}
                    </span>
                  </div>
                )}

                {/* Product Name - Large and Elegant */}
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}
                >
                  {product.name}
                </h1>

                {/* Gemstones - Script Display */}
                {product.gemstones && product.gemstones.length > 0 && (
                  <p className="gemstone-display">
                    {product.gemstones.join('  •  ')}
                  </p>
                )}

                {/* Price - Gold Accent */}
                <div
                  className="text-3xl md:text-4xl lg:text-5xl font-semibold"
                  style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--gold-medium))' }}
                >
                  {formatPrice(product.price)}
                </div>

                {/* Premium Section Divider */}
                <div className="premium-section-divider" />

                {/* Short Emotional Description */}
                {product.description && (
                  <p
                    className="text-lg leading-relaxed"
                    style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}
                  >
                    {product.description}
                  </p>
                )}

                {/* Benefits / Intentions Section */}
                <div className="benefits-section">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h4 className="benefit-title">Intention</h4>
                      <p className="benefit-description">Crafted with purpose and positive energy</p>
                    </div>
                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <Gem className="w-6 h-6" />
                      </div>
                      <h4 className="benefit-title">Natural</h4>
                      <p className="benefit-description">Genuine crystals and gemstones</p>
                    </div>
                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <Shield className="w-6 h-6" />
                      </div>
                      <h4 className="benefit-title">Lifetime Care</h4>
                      <p className="benefit-description">Warranty & repair service included</p>
                    </div>
                  </div>
                </div>

                {/* Materials & Craftsmanship Story */}
                <div className="story-section">
                  <h3>Handcrafted in Winnipeg</h3>
                  <p>
                    Each piece is carefully crafted with 14k gold-plated materials and genuine crystals.
                    We source our stones ethically and create every piece with intention, ensuring your jewelry
                    carries positive energy from our hands to yours.
                  </p>
                  {product.materials && product.materials.length > 0 && (
                    <>
                      <h4 style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 600, color: 'hsl(var(--text-primary))', marginTop: '1rem' }}>Materials</h4>
                      <p style={{ marginTop: '0.5rem' }}>{product.materials.join(', ')}</p>
                    </>
                  )}
                </div>

                {/* Crystal Properties (if applicable) */}
                {crystalProperties.length > 0 && (
                  <div>
                    <h3 style={{
                      fontFamily: '"Libre Baskerville", serif',
                      fontSize: '1.5rem',
                      color: 'hsl(var(--text-primary))',
                      textAlign: 'center',
                      marginBottom: '2rem'
                    }}>
                      Crystal Energy
                    </h3>
                    <div className="crystal-properties">
                      {crystalProperties.map((prop, idx) => (
                        <div key={idx} className="crystal-property">
                          <span className="crystal-property-icon">{prop.icon}</span>
                          <h4 className="crystal-property-title">{prop.title}</h4>
                          <p className="crystal-property-description">{prop.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector - Minimal */}
                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    <span
                      className="text-xs tracking-widest uppercase"
                      style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))', letterSpacing: '0.15em' }}
                    >
                      Quantity
                    </span>
                    <div className="flex items-center border border-[hsl(var(--border-light))] rounded-sm overflow-hidden">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-[hsl(var(--bg-secondary))] transition-colors duration-150"
                        style={{ color: 'hsl(var(--text-primary))' }}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span
                        className="px-6 py-3 min-w-[4rem] text-center font-medium"
                        style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-primary))' }}
                      >
                        {quantity}
                      </span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => setQuantity(Math.min(product.stockQuantity ?? 99, quantity + 1))}
                        disabled={quantity >= (product.stockQuantity ?? 99)}
                        className="p-3 hover:bg-[hsl(var(--bg-secondary))] transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ color: 'hsl(var(--text-primary))' }}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stock Status */}
                  {product.stockQuantity !== undefined && product.stockQuantity !== null && product.stockQuantity > 0 && (
                    <p className="text-sm" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--accent-vibrant))' }}>
                      In stock ({product.stockQuantity} available)
                    </p>
                  )}
                </div>

                {/* Action Buttons - Premium Style */}
                <div className="space-y-4">
                  {/* Add to Cart - Primary CTA */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                    className="btn-premium-primary w-full"
                    style={{ opacity: product.stockQuantity === 0 ? 0.5 : 1 }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>{product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>

                  {/* Etsy Purchase - Secondary CTA */}
                  <a
                    href="https://www.etsy.com/ca/shop/TrovesandCoves"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full btn-premium-secondary text-center"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm0 22C5.383 22 1 17.617 1 12S5.383 2 12 2s11 4.383 11 10-5.383 10-10 10zm0-16c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
                    </svg>
                    <span>Purchase on Etsy</span>
                  </a>

                  {/* Wishlist Toggle */}
                  <button
                    onClick={handleWishlist}
                    className="w-full flex items-center justify-center gap-2 px-8 py-3 border border-[hsl(var(--border-light))] hover:border-[hsl(var(--gold-medium))] transition-colors duration-200 rounded-sm"
                    style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} style={{ color: isWishlisted ? 'hsl(var(--gold-medium))' : 'inherit' }} />
                    <span>{isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                </div>

                {/* Trust Badges - Clean Icons */}
                <div className="trust-badges">
                  <div className="trust-badge">
                    <div className="trust-badge-icon">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="trust-badge-text">Free Shipping</span>
                  </div>
                  <div className="trust-badge">
                    <div className="trust-badge-icon">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="trust-badge-text">Lifetime Warranty</span>
                  </div>
                  <div className="trust-badge">
                    <div className="trust-badge-icon">
                      <Gem className="w-5 h-5" />
                    </div>
                    <span className="trust-badge-text">Handcrafted</span>
                  </div>
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
    </>
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
    <section className="border-t border-[hsl(var(--border-light))] spacing-premium-lg">
      <div className="chamber-container">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-semibold mb-4"
            style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}
          >
            You May Also Like
          </h2>
          <div className="premium-section-divider" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group block">
              <div className="product-card-enhanced shadow-sm overflow-hidden" style={{ backgroundColor: 'hsl(var(--bg-card))' }}>
                <div className="aspect-square mb-4 overflow-hidden bg-[hsl(var(--bg-secondary))]">
                  <WebPImage
                    src={product.imageUrl || '/api/placeholder/300/300'}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold mb-2 group-hover:text-[hsl(var(--accent-vibrant))] transition-colors duration-200"
                    style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between pt-4 border-t border-[hsl(var(--border-light))]">
                    <span
                      className="text-lg font-semibold"
                      style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--gold-medium))' }}
                    >
                      ${product.price}
                    </span>
                    {product.category && (
                      <span
                        className="text-xs px-3 py-1 bg-[hsl(var(--bg-secondary))] rounded-sm"
                        style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-muted))' }}
                      >
                        {product.category.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <button className="btn-premium-secondary">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
