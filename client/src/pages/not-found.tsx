import { Home, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'hsl(var(--bg-primary))' }}>
      <div className="rounded-lg shadow-sm w-full max-w-lg p-12 text-center" style={{ backgroundColor: 'hsl(var(--bg-card))' }}>
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full" style={{ backgroundColor: 'hsla(174, 51%, 51%, 0.1)', border: '2px solid hsl(var(--accent-vibrant))' }}>
            <ShoppingBag className="w-12 h-12" style={{ color: 'hsl(var(--accent-vibrant))' }} strokeWidth={1.5} />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full" style={{ backgroundColor: 'hsl(var(--gold-medium))', border: '1px solid hsl(var(--gold-medium))' }}>
          <span className="text-xs tracking-widest uppercase" style={{ color: 'hsl(var(--text-primary))', fontWeight: 600 }}>
            404
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: '"Libre Baskerville", serif', color: '#1f1f1f' }}>
          Page Not Found
        </h1>

        {/* Divider */}
        <div className="w-24 h-px mx-auto mb-6" style={{ backgroundColor: 'hsl(var(--gold-medium))' }}></div>

        <p className="text-lg mb-8 leading-relaxed" style={{ fontFamily: '"Montserrat", sans-serif', color: '#5f5f5f' }}>
          The page you're looking for doesn't exist or has been moved.
          Let us help you find your way.
        </p>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Link href="/">
            <button className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:opacity-90 group" style={{ backgroundColor: 'hsl(var(--accent-vibrant))', color: '#faf8f3', fontFamily: '"Montserrat", sans-serif' }}>
              <Home className="w-5 h-5" />
              <span>Return Home</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>

          <Link href="/products">
            <button className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:opacity-90 group" style={{ backgroundColor: 'transparent', border: '2px solid hsl(var(--accent-vibrant))', color: '#4abfbf', fontFamily: '"Montserrat", sans-serif' }}>
              <ShoppingBag className="w-5 h-5" />
              <span>Shop the Collection</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
