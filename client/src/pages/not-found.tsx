import { Home, ShoppingBag, ArrowRight } from 'lucide-react';
import CTAButton from '@/components/CTAButton';
import SectionPill from '@/components/SectionPill';
import SectionDivider from '@/components/SectionDivider';

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
        <SectionPill variant="gold" showIcon={false} className="mb-6">
          404
        </SectionPill>

        <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}>
          Page Not Found
        </h1>

        {/* Divider */}
        <SectionDivider variant="gold" className="mb-6" />

        <p className="text-lg mb-8 leading-relaxed" style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}>
          The page you're looking for doesn't exist or has been moved.
          Let us help you find your way.
        </p>

        {/* Navigation Options */}
        <div className="space-y-4">
          <CTAButton variant="primary" href="/" className="w-full group">
            <Home className="w-5 h-5" />
            <span>Return Home</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </CTAButton>

          <CTAButton variant="secondary" href="/products" className="w-full">
            <ShoppingBag className="w-5 h-5" />
            <span>Shop the Collection</span>
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
