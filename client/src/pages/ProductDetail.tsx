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
} from 'lucide-react';
import type { ProductWithCategory } from '@shared/types';
import SEOHead from '@/components/SEOHead';
import { ProductSchema, BreadcrumbSchema } from '@/components/SchemaOrg';

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

  return (
    <>
      <SEOHead
        title={`${product.name} | ${product.category?.name || 'Crystal Jewelry'} | Troves & Coves`}
        description={`${product.description?.substring(0, 150)}... Handcrafted in Winnipeg, Canada. ${product.price} CAD.`}
        url={`https://trovesandcoves.ca/products/${product.id}`}
        type="product"
        image={product.imageUrl}
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
          { name: product.name, path: `/products/${product.id}` }
        ]}
      />
      <div className="min-h-screen content-layer" style={{ backgroundColor: 'hsl(var(--bg-primary))' }}>
      {/* Breadcrumb Navigation */}
      <div className="border-b border-[hsl(var(--border-light))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 text-sm overflow-x-auto">
            <button
              onClick={() => setLocation('/products')}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity whitespace-nowrap"
              style={{ color: 'hsl(var(--accent-vibrant))', fontFamily: '"Montserrat", sans-serif' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Shop</span>
            </button>
            <span style={{ color: 'hsl(var(--gold-medium))' }}>/</span>
            {product.category && (
              <>
                <Link
                  href={`/products/${product.category.slug}`}
                  className="hover:text-[hsl(var(--accent-vibrant))] transition-colors whitespace-nowrap"
                  style={{ color: 'hsl(var(--text-secondary))', fontFamily: '"Montserrat", sans-serif' }}
                >
                  {product.category.name}
                </Link>
                <span style={{ color: 'hsl(var(--gold-medium))' }}>/</span>
              </>
            )}
            <span className="text-[hsl(var(--text-secondary))] truncate max-w-[200px]" style={{ fontFamily: '"Montserrat", sans-serif' }} title={product.name}>
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="p-2 shadow-sm" style={{ backgroundColor: 'hsl(var(--bg-card))' }}>
              <div className="relative aspect-square overflow-hidden bg-[hsl(var(--bg-secondary))]">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Stock Badge */}
                {product.stockQuantity !== undefined && product.stockQuantity !== null ? (
                  product.stockQuantity <= 5 && product.stockQuantity > 0 ? (
                    <div className="absolute top-4 left-4 px-3 py-1.5 text-xs tracking-wider uppercase bg-[hsl(var(--bg-card))/90] backdrop-blur-sm rounded-sm" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--gold-medium))', border: '1px solid hsl(var(--gold-medium))' }}>
                      Only {product.stockQuantity} left
                    </div>
                  ) : product.stockQuantity === 0 && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 text-xs tracking-wider uppercase bg-[hsl(var(--text-primary))/90] backdrop-blur-sm text-white rounded-sm" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                      Out of Stock
                    </div>
                  )
                ) : !product.inStock && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 text-xs tracking-wider uppercase bg-[hsl(var(--text-primary))/90] backdrop-blur-sm text-white rounded-sm" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                    Out of Stock
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
                    className={`flex-shrink-0 w-20 h-20 border-2 overflow-hidden transition-colors duration-200 ${
                      selectedImage === index
                        ? 'border-[hsl(var(--accent-vibrant))]'
                        : 'border-transparent hover:border-[hsl(var(--accent-vibrant))]/50'
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
              <div className="inline-flex items-center">
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))', letterSpacing: '0.2em' }}
                >
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h1
              className="text-4xl md:text-5xl font-bold leading-tight"
              style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div
              className="text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--gold-medium))' }}
            >
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            {product.description && (
              <p
                className="text-base leading-relaxed max-w-lg"
                style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}
              >
                {product.description}
              </p>
            )}

            {/* Gemstones - Elegant Display */}
            {product.gemstones && product.gemstones.length > 0 && (
              <div className="py-4 border-y border-[hsl(var(--border-light))]">
                <span
                  className="text-xs tracking-widest uppercase block mb-3"
                  style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))', letterSpacing: '0.15em' }}
                >
                  Gemstones
                </span>
                <p
                  className="text-xl"
                  style={{ fontFamily: '"Alex Brush", cursive', color: 'hsl(var(--gold-medium))' }}
                >
                  {product.gemstones.join('  •  ')}
                </p>
              </div>
            )}

            {/* Materials */}
            {product.materials && product.materials.length > 0 && (
              <div>
                <span
                  className="text-xs tracking-widest uppercase block mb-2"
                  style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))', letterSpacing: '0.15em' }}
                >
                  Materials
                </span>
                <p
                  className="text-sm"
                  style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-primary))' }}
                >
                  {product.materials.join(', ')}
                </p>
              </div>
            )}

            {/* Weight */}
            {product.weight && (
              <div>
                <span
                  className="text-xs tracking-widest uppercase block mb-2"
                  style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))', letterSpacing: '0.15em' }}
                >
                  Weight
                </span>
                <p
                  className="text-sm"
                  style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-primary))' }}
                >
                  {product.weight} grams
                </p>
              </div>
            )}

            {/* Care Instructions */}
            <div className="p-4 bg-[hsl(var(--bg-secondary))] rounded-sm">
              <span
                className="text-xs tracking-widest uppercase block mb-2"
                style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))', letterSpacing: '0.15em' }}
              >
                Care Instructions
              </span>
              <ul className="text-sm space-y-1" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-primary))' }}>
                <li>• Keep away from water and chemicals</li>
                <li>• Store in a cool, dry place</li>
                <li>• Clean gently with a soft cloth</li>
              </ul>
            </div>

            {/* Quantity Selector */}
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
              {product.stockQuantity !== undefined && product.stockQuantity !== null ? (
                product.stockQuantity > 0 ? (
                  <p className="text-sm" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--accent-vibrant))' }}>
                    In stock ({product.stockQuantity} available)
                  </p>
                ) : (
                  <p className="text-sm" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>
                    Out of stock
                  </p>
                )
              ) : product.inStock ? (
                <p className="text-sm" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--accent-vibrant))' }}>In stock</p>
              ) : (
                <p className="text-sm" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>Out of stock</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[hsl(var(--bg-card))] border-2 border-[hsl(var(--accent-vibrant))] hover:bg-[hsl(var(--accent-vibrant))] hover:text-white text-[hsl(var(--accent-vibrant))] rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[hsl(var(--bg-card))] disabled:hover:text-[hsl(var(--accent-vibrant))]"
                style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 600, letterSpacing: '0.05em' }}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              {/* Etsy Purchase Button */}
              <a
                href="https://www.etsy.com/ca/shop/TrovesandCoves"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <button
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-sm transition-all duration-200"
                  style={{
                    background: 'hsl(var(--gold-medium))',
                    color: 'hsl(var(--text-primary))',
                    fontFamily: '"Montserrat", sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm0 22C5.383 22 1 17.617 1 12S5.383 2 12 2s11 4.383 11 10-5.383 10-10 10zm0-16c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
                  </svg>
                  Purchase on Etsy
                </button>
              </a>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[hsl(var(--border-light))]">
              <div className="text-center">
                <Truck className="w-5 h-5 mx-auto mb-2" style={{ color: 'hsl(var(--gold-medium))' }} />
                <p className="text-xs" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 mx-auto mb-2" style={{ color: 'hsl(var(--gold-medium))' }} />
                <p className="text-xs" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>Lifetime Warranty</p>
              </div>
              <div className="text-center">
                <Gem className="w-5 h-5 mx-auto mb-2" style={{ color: 'hsl(var(--gold-medium))' }} />
                <p className="text-xs" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>Handcrafted</p>
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
    <section className="border-t border-[hsl(var(--border-light))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-semibold mb-4"
            style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}
          >
            You May Also Like
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group block">
              <div className="shadow-sm overflow-hidden" style={{ backgroundColor: 'hsl(var(--bg-card))' }}>
                <div className="aspect-square mb-4 overflow-hidden bg-[hsl(var(--bg-secondary))]">
                  <img
                    src={product.imageUrl || '/api/placeholder/300/300'}
                    alt={product.name}
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
                        style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f' }}
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
            <button
              className="px-8 py-3 bg-[hsl(var(--bg-card))] border-2 border-[hsl(var(--accent-vibrant))] hover:bg-[hsl(var(--accent-vibrant))] hover:text-white text-[hsl(var(--accent-vibrant))] rounded-sm transition-all duration-200"
              style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 500, letterSpacing: '0.05em' }}
            >
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
