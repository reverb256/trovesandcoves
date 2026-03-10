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
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center content-layer">
        <div className="p-16">
          <div className="w-12 h-12 border-2 border-[#4abfbf]/20 border-t-[#4abfbf] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center content-layer">
        <div className="p-16 text-center max-w-md">
          <Gem className="w-16 h-16 text-[#4abfbf]/50 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: '"Libre Baskerville", serif', color: '#1f1f1f' }}>
            Product Not Found
          </h2>
          <p className="text-[#5f5f5f] mb-8" style={{ fontFamily: '"Montserrat", sans-serif' }}>
            The product you are looking for does not exist.
          </p>
          <button
            onClick={() => setLocation('/products')}
            className="px-6 py-3 bg-[#4abfbf] hover:bg-[#3da8a8] text-white rounded-sm transition-colors duration-200"
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
    <div className="min-h-screen bg-[#faf8f3] content-layer">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#e8e6e1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 text-sm overflow-x-auto">
            <button
              onClick={() => setLocation('/products')}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity whitespace-nowrap"
              style={{ color: '#4abfbf', fontFamily: '"Montserrat", sans-serif' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Shop</span>
            </button>
            <span style={{ color: '#deb55b' }}>/</span>
            {product.category && (
              <>
                <Link
                  href={`/products/${product.category.slug}`}
                  className="hover:text-[#4abfbf] transition-colors whitespace-nowrap"
                  style={{ color: '#5f5f5f', fontFamily: '"Montserrat", sans-serif' }}
                >
                  {product.category.name}
                </Link>
                <span style={{ color: '#deb55b' }}>/</span>
              </>
            )}
            <span className="text-[#5f5f5f] truncate max-w-[200px]" style={{ fontFamily: '"Montserrat", sans-serif' }} title={product.name}>
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
            <div className="bg-white p-2 shadow-sm">
              <div className="relative aspect-square overflow-hidden bg-[#f5f3f0]">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Stock Badge */}
                {product.stockQuantity !== undefined && product.stockQuantity !== null ? (
                  product.stockQuantity <= 5 && product.stockQuantity > 0 ? (
                    <div className="absolute top-4 left-4 px-3 py-1.5 text-xs tracking-wider uppercase bg-white/90 backdrop-blur-sm rounded-sm" style={{ fontFamily: '"Montserrat", sans-serif', color: '#e1af2f', border: '1px solid #e1af2f' }}>
                      Only {product.stockQuantity} left
                    </div>
                  ) : product.stockQuantity === 0 && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 text-xs tracking-wider uppercase bg-[#1f1f1f]/90 backdrop-blur-sm text-white rounded-sm" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                      Out of Stock
                    </div>
                  )
                ) : !product.inStock && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 text-xs tracking-wider uppercase bg-[#1f1f1f]/90 backdrop-blur-sm text-white rounded-sm" style={{ fontFamily: '"Montserrat", sans-serif' }}>
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
                        ? 'border-[#4abfbf]'
                        : 'border-transparent hover:border-[#4abfbf]/50'
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
                  style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f', letterSpacing: '0.2em' }}
                >
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h1
              className="text-4xl md:text-5xl font-bold leading-tight"
              style={{ fontFamily: '"Libre Baskerville", serif', color: '#1f1f1f' }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div
              className="text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: '"Libre Baskerville", serif', color: '#e1af2f' }}
            >
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            {product.description && (
              <p
                className="text-base leading-relaxed max-w-lg"
                style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f' }}
              >
                {product.description}
              </p>
            )}

            {/* Gemstones - Elegant Display */}
            {product.gemstones && product.gemstones.length > 0 && (
              <div className="py-4 border-y border-[#e8e6e1]">
                <span
                  className="text-xs tracking-widest uppercase block mb-3"
                  style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f', letterSpacing: '0.15em' }}
                >
                  Gemstones
                </span>
                <p
                  className="text-xl"
                  style={{ fontFamily: '"Alex Brush", cursive', color: '#e1af2f' }}
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
                  style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f', letterSpacing: '0.15em' }}
                >
                  Materials
                </span>
                <p
                  className="text-sm"
                  style={{ fontFamily: '"Montserrat", sans-serif', color: '#1f1f1f' }}
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
                  style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f', letterSpacing: '0.15em' }}
                >
                  Weight
                </span>
                <p
                  className="text-sm"
                  style={{ fontFamily: '"Montserrat", sans-serif', color: '#1f1f1f' }}
                >
                  {product.weight} grams
                </p>
              </div>
            )}

            {/* Care Instructions */}
            <div className="p-4 bg-[#f5f3f0] rounded-sm">
              <span
                className="text-xs tracking-widest uppercase block mb-2"
                style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f', letterSpacing: '0.15em' }}
              >
                Care Instructions
              </span>
              <ul className="text-sm space-y-1" style={{ fontFamily: '"Montserrat", sans-serif', color: '#1f1f1f' }}>
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
                  style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f', letterSpacing: '0.15em' }}
                >
                  Quantity
                </span>
                <div className="flex items-center border border-[#e8e6e1] rounded-sm overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-[#f5f3f0] transition-colors duration-150"
                    style={{ color: '#1f1f1f' }}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span
                    className="px-6 py-3 min-w-[4rem] text-center font-medium"
                    style={{ fontFamily: '"Montserrat", sans-serif', color: '#1f1f1f' }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity ?? 99, quantity + 1))}
                    disabled={quantity >= (product.stockQuantity ?? 99)}
                    className="p-3 hover:bg-[#f5f3f0] transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ color: '#1f1f1f' }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              {product.stockQuantity !== undefined && product.stockQuantity !== null ? (
                product.stockQuantity > 0 ? (
                  <p className="text-sm" style={{ fontFamily: '"Montserrat", sans-serif', color: '#4abfbf' }}>
                    In stock ({product.stockQuantity} available)
                  </p>
                ) : (
                  <p className="text-sm" style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f' }}>
                    Out of stock
                  </p>
                )
              ) : product.inStock ? (
                <p className="text-sm" style={{ fontFamily: '"Montserrat", sans-serif', color: '#4abfbf' }}>In stock</p>
              ) : (
                <p className="text-sm" style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f' }}>Out of stock</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-[#4abfbf] hover:bg-[#4abfbf] hover:text-white text-[#4abfbf] rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#4abfbf]"
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
                    background: '#deb55b',
                    color: '#1f1f1f',
                    fontFamily: '"Montserrat", sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#c9a547'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#deb55b'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm0 22C5.383 22 1 17.617 1 12S5.383 2 12 2s11 4.383 11 10-5.383 10-10 10zm0-16c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
                  </svg>
                  Purchase on Etsy
                </button>
              </a>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#e8e6e1]">
              <div className="text-center">
                <Truck className="w-5 h-5 mx-auto mb-2" style={{ color: '#deb55b' }} />
                <p className="text-xs" style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f' }}>Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 mx-auto mb-2" style={{ color: '#deb55b' }} />
                <p className="text-xs" style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f' }}>Lifetime Warranty</p>
              </div>
              <div className="text-center">
                <Gem className="w-5 h-5 mx-auto mb-2" style={{ color: '#deb55b' }} />
                <p className="text-xs" style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f' }}>Handcrafted</p>
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
    <section className="border-t border-[#e8e6e1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-semibold mb-4"
            style={{ fontFamily: '"Libre Baskerville", serif', color: '#1f1f1f' }}
          >
            You May Also Like
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group block">
              <div className="bg-white shadow-sm overflow-hidden">
                <div className="aspect-square mb-4 overflow-hidden bg-[#f5f3f0]">
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
                    className="text-lg font-semibold mb-2 group-hover:text-[#4abfbf] transition-colors duration-200"
                    style={{ fontFamily: '"Libre Baskerville", serif', color: '#1f1f1f' }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between pt-4 border-t border-[#e8e6e1]">
                    <span
                      className="text-lg font-semibold"
                      style={{ fontFamily: '"Libre Baskerville", serif', color: '#e1af2f' }}
                    >
                      ${product.price}
                    </span>
                    {product.category && (
                      <span
                        className="text-xs px-3 py-1 bg-[#f5f3f0] rounded-sm"
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
              className="px-8 py-3 bg-white border-2 border-[#4abfbf] hover:bg-[#4abfbf] hover:text-white text-[#4abfbf] rounded-sm transition-all duration-200"
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
