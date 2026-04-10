import { useState, useEffect, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, Heart, Menu, X } from 'lucide-react';
import type { ProductWithCategory } from '@shared/types';

// Mobile-first responsive hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
}

// Touch-optimized card component with performance optimizations
interface MobileProductCardProps {
  product: ProductWithCategory;
  onAddToCart: (productId: number) => void;
}

export function MobileProductCard({
  product,
  onAddToCart,
}: MobileProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.id);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-500 ease-out hover:shadow-xl"
      style={{
        backgroundColor: 'hsl(var(--bg-card))',
        border: '1px solid hsl(var(--border-light))',
        borderRadius: '8px',
      }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl || `/api/placeholder/300/300`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Wishlist - Subtle */}
        <button
          onClick={e => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: isLiked
              ? 'hsl(var(--gold-medium))'
              : 'hsl(var(--bg-card) / 0.9)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className="w-4 h-4 transition-colors duration-300"
            style={{
              color: isLiked
                ? 'hsl(var(--bg-overlay))'
                : 'hsl(var(--text-primary))',
              fill: isLiked ? 'hsl(var(--bg-overlay))' : 'none',
            }}
          />
        </button>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Product Name */}
        <h3
          className="text-base leading-snug line-clamp-2"
          style={{
            fontFamily: "'Libre Baskerville', serif",
            color: '#1f1f1f',
            fontWeight: 500,
          }}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span
            className="text-lg font-semibold"
            style={{
              fontFamily: "'Libre Baskerville', serif",
              color: '#C9A24A',
            }}
          >
            ${product.price}
          </span>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-xs tracking-wider uppercase transition-all duration-300"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              backgroundColor: isAdded
                ? 'hsl(var(--accent-vibrant))'
                : 'hsl(var(--text-primary))',
              color: 'hsl(var(--bg-primary))',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            {isAdded ? 'Added' : 'Add'}
          </button>
        </div>

        {/* View Details */}
        <a
          href={`/product/${product.id}`}
          className="block text-center text-xs tracking-wider uppercase"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: '#5f5f5f',
            textDecoration: 'none',
          }}
        >
          View Details
        </a>
      </CardContent>
    </Card>
  );
}

// Memoize to prevent unnecessary re-renders
export const MobileProductCardMemo = memo(
  MobileProductCard,
  (prevProps, nextProps) => {
    return prevProps.product.id === nextProps.product.id;
  }
);

// Mobile navigation with performance optimizations
interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function MobileNavigation({
  isOpen,
  onToggle,
  onClose,
}: MobileNavigationProps) {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isMobile) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="lg:hidden p-2 touch-manipulation"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={onClose}
          />

          <div
            className={`
            fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 lg:hidden
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            shadow-2xl will-change-transform
          `}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gem
                    className="h-7 w-7"
                    style={{ color: 'hsl(var(--gold-medium))' }}
                  />
                  <span
                    className="text-lg font-bold"
                    style={{ color: 'hsl(var(--text-primary))' }}
                  >
                    Troves & Coves
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2 touch-manipulation"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Shop' },
                { href: '/contact', label: 'Contact' },
              ].map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block py-3 px-2 text-base font-medium border-b border-gray-100 touch-manipulation transition-colors"
                  style={{ color: 'hsl(var(--text-primary))' }}
                  onClick={onClose}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
