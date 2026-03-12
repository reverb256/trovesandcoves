import { LucideIcon } from 'lucide-react';
import CTAButton from '@/components/CTAButton';

/**
 * EmptyState - Consistent empty state messaging
 *
 * Variants:
 * - cart: Empty cart state
 * - search: No search results
 * - general: Generic empty state
 *
 * Usage:
 * <EmptyState
 *   icon={ShoppingBag}
 *   title="Your cart is empty"
 *   description="Add items to get started"
 *   action={{ label: "Browse Products", href: "/products" }}
 * />
 */
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  variant?: 'cart' | 'search' | 'general';
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  variant = 'general',
  action,
  className = '',
}: EmptyStateProps) {
  const variantStyles = {
    cart: {
      iconBg: 'hsla(var(--gold-medium), 0.15)',
      iconColor: 'hsl(var(--gold-medium))',
    },
    search: {
      iconBg: 'hsla(var(--accent-vibrant), 0.1)',
      iconColor: 'hsl(var(--accent-vibrant))',
    },
    general: {
      iconBg: 'hsla(var(--accent-vibrant), 0.1)',
      iconColor: 'hsl(var(--accent-vibrant))',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {Icon && (
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: styles.iconBg }}
        >
          <Icon className="w-10 h-10" style={{ color: styles.iconColor }} />
        </div>
      )}
      <h3
        className="text-xl md:text-2xl font-semibold mb-3"
        style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="text-base mb-6 max-w-md mx-auto"
          style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}
        >
          {description}
        </p>
      )}
      {action && (
        <CTAButton
          variant={variant === 'cart' ? 'gold' : 'secondary'}
          href={action.href}
          onClick={action.onClick}
        >
          {action.label}
        </CTAButton>
      )}
    </div>
  );
}
