import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gem, ShoppingBag, Star, Heart, Menu, X, Search, Filter } from 'lucide-react';

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
export function MobileProductCard({ product, onAddToCart }: any) {
  const [isLiked, setIsLiked] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Card className={`
      relative overflow-hidden transition-transform duration-200 will-change-transform
      ${isMobile ? 'touch-manipulation select-none active:scale-95' : 'hover:scale-[1.02]'}
      border-gold/20 bg-gradient-to-br from-white to-gold/5 h-full
    `}>
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.imageUrl || `/api/placeholder/300/300`}
          alt={product.name}
          className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`
            absolute top-2 right-2 p-2 rounded-full transition-all duration-200 backdrop-blur-sm
            ${isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600'}
            ${isMobile ? 'w-11 h-11' : 'w-9 h-9'}
            hover:scale-110 active:scale-95 touch-manipulation
          `}
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-full h-full ${isLiked ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute bottom-2 left-2 flex gap-1">
          {product.isNew && (
            <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5">
              New
            </Badge>
          )}
          {product.isOnSale && (
            <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
              Sale
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className="w-3 h-3 text-gold fill-current"
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">(47)</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-gold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {product.crystalType && (
              <Badge variant="secondary" className="text-xs py-0">
                {product.crystalType}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            onClick={() => onAddToCart(product)}
            className="flex-1 h-9 text-xs bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90 active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-3 h-3 mr-1" />
            Add
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = `/product/${product.id}`}
            className="h-9 px-3 text-xs border-gold/20 hover:bg-gold/5 active:scale-95 transition-transform"
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Mobile navigation with performance optimizations
export function MobileNavigation({ isOpen, onToggle, onClose }: any) {
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
          
          <div className={`
            fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 lg:hidden
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            shadow-2xl will-change-transform
          `}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gem className="h-7 w-7 text-gold" />
                  <span className="text-lg font-bold text-gray-900">
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
                { href: '/products', label: 'Collections' },
                { href: '/ai-assistant', label: 'AI Consultant' },
                { href: '/contact', label: 'Contact' }
              ].map((item) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="block py-3 px-2 text-base font-medium text-gray-900 border-b border-gray-100 touch-manipulation active:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  {item.label}
                </a>
              ))}
              
              <div className="pt-4 space-y-2">
                <Button className="w-full h-11 bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90 touch-manipulation">
                  Shop Now
                </Button>
                <Button variant="outline" className="w-full h-11 border-gold/20 touch-manipulation">
                  Track Order
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

// Performance-optimized search component
export function MobileSearchFilter({ onSearch, onFilter }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-30 p-3 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search crystals, jewelry..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex-1 border-gray-200 h-9 text-sm touch-manipulation"
        >
          <Filter className="w-4 h-4 mr-1" />
          Filters
        </Button>
        <Button
          onClick={() => onSearch(searchTerm)}
          className="px-4 h-9 bg-gradient-to-r from-gold to-amber-500 text-sm touch-manipulation"
        >
          Search
        </Button>
      </div>

      {showFilters && (
        <div className="space-y-2 pt-2 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {[
              'Under $50',
              '$50 - $100', 
              'Rose Quartz',
              'Amethyst',
              'Citrine',
              'Clear Quartz'
            ].map((filter) => (
              <Button 
                key={filter}
                variant="outline" 
                size="sm" 
                className="text-xs h-8 touch-manipulation active:scale-95 transition-transform"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// High-performance cart drawer
export function MobileCartDrawer({ isOpen, onClose, cartItems = [] }: any) {
  const isMobile = useIsMobile();
  const total = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

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
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed bottom-0 left-0 right-0 bg-white z-50 transform transition-transform duration-300 will-change-transform
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        rounded-t-xl shadow-2xl max-h-[85vh] overflow-hidden
      `}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Cart ({cartItems.length})</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="touch-manipulation">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <Button 
                className="mt-4 bg-gradient-to-r from-gold to-amber-500"
                onClick={() => {
                  onClose();
                  window.location.href = '/products';
                }}
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                  <img 
                    src={item.image || '/api/placeholder/60/60'} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-gold font-semibold text-sm">${item.price}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-gold">
                ${total.toFixed(2)}
              </span>
            </div>
            
            <Button 
              className="w-full h-12 bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90 touch-manipulation active:scale-95 transition-transform font-semibold"
              onClick={() => {
                onClose();
                window.location.href = '/checkout';
              }}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
}