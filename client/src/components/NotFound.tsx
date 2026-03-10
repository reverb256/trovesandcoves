import { Button } from './ui/button';
import { Home, Search } from 'lucide-react';

interface NotFoundProps {
  type?: 'page' | 'product' | 'category' | 'api';
  resource?: string;
}

export function NotFound({ type = 'page', resource }: NotFoundProps) {
  const getTitle = () => {
    switch (type) {
      case 'product':
        return 'Product Not Found';
      case 'category':
        return 'Category Not Found';
      case 'api':
        return 'API Error';
      default:
        return 'Page Not Found';
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'product':
        return `We couldn't find the product "${resource}" you're looking for. It may have been removed or the URL is incorrect.`;
      case 'category':
        return `We couldn't find the category "${resource}". Try browsing our collections.`;
      case 'api':
        return 'Something went wrong while fetching data. Please try again later.';
      default:
        return "We couldn't find the page you're looking for. It may have been moved or the URL is incorrect.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: 'hsl(var(--bg-primary))' }}>
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full opacity-20"
          style={{ backgroundColor: 'hsla(174,85%,45%,0.02)', filter: 'blur(60px)' }}
        ></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ backgroundColor: 'hsla(43,95%,55%,0.02)', filter: 'blur(80px)' }}
        ></div>
      </div>

      <div className="text-center max-w-md relative z-10">
        {/* Crystal icon with glow */}
        <div className="text-8xl mb-8 animate-pulse" style={{ filter: 'drop-shadow(0 0 15px hsla(174,85%,45%,0.25))' }}>💎</div>

        {/* 404 Heading */}
        <h1 className="text-6xl font-bold mb-3" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--accent-vibrant))' }}>
          {type === 'api' ? '⚠️' : '404'}
        </h1>

        <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "\"Libre Baskerville\", serif", color: 'hsl(var(--text-primary))', letterSpacing: '0.02em' }}>
          {getTitle()}
        </h2>

        {/* Error message */}
        <p className="mb-10 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--text-secondary))' }}>
          {getMessage()}
        </p>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={() => window.location.href = '/'}
            className="hover:opacity-90 transition-all"
            style={{ backgroundColor: 'hsl(var(--accent-vibrant))', color: 'hsl(var(--bg-primary))', fontFamily: "'Montserrat', sans-serif" }}
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>

          {type !== 'api' && (
            <Button
              variant="outline"
              onClick={() => window.location.href = '/products'}
              className="hover:opacity-80 transition-all"
              style={{ 
                borderColor: 'hsla(174,85%,45%,0.3)', 
                color: 'hsl(var(--accent-vibrant))',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          )}
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'hsla(174,85%,45%,0.15)' }}>
          <p className="text-sm mb-4" style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--text-secondary))' }}>
            Looking for something specific?
          </p>
          <div className="flex gap-4 justify-center text-sm">
            <a
              href="/products"
              className="hover:opacity-80 transition-opacity"
              style={{ color: 'hsl(var(--accent-vibrant))', fontFamily: "'Montserrat', sans-serif" }}
            >
              All Products
            </a>
            <span style={{ color: 'hsl(var(--gold-medium))' }}>•</span>
            <a
              href="/products?category=necklaces"
              className="hover:opacity-80 transition-opacity"
              style={{ color: 'hsl(var(--accent-vibrant))', fontFamily: "'Montserrat', sans-serif" }}
            >
              Necklaces
            </a>
            <span style={{ color: 'hsl(var(--gold-medium))' }}>•</span>
            <a
              href="/products?category=bracelets"
              className="hover:opacity-80 transition-opacity"
              style={{ color: 'hsl(var(--accent-vibrant))', fontFamily: "'Montserrat', sans-serif" }}
            >
              Bracelets
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
