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
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="text-center max-w-md">
        {/* Crystal emoji for visual interest */}
        <div className="text-8xl mb-6 animate-pulse">💎</div>

        {/* 404 Heading */}
        <h1 className="text-6xl font-bold text-on-surface mb-2">
          {type === 'api' ? '⚠️' : '404'}
        </h1>

        <h2 className="text-2xl font-semibold text-on-surface mb-4">
          {getTitle()}
        </h2>

        {/* Error message */}
        <p className="text-on-surface-variant mb-8">
          {getMessage()}
        </p>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>

          {type !== 'api' && (
            <Button
              variant="outline"
              onClick={() => window.location.href = '/products'}
            >
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          )}
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-outline-variant">
          <p className="text-sm text-on-surface-variant mb-4">
            Looking for something specific?
          </p>
          <div className="flex gap-4 justify-center text-sm">
            <a
              href="/products"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              All Products
            </a>
            <span className="text-outline">•</span>
            <a
              href="/products?category=necklaces"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Necklaces
            </a>
            <span className="text-outline">•</span>
            <a
              href="/products?category=bracelets"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Bracelets
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
