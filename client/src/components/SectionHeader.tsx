import { ReactNode } from 'react';
import SectionDivider from '@/components/SectionDivider';

/**
 * SectionHeader - Consistent section heading with optional divider
 *
 * Variants:
 * - default: Standard section header
 * - gold: Gold accent for informational pages
 * - turquoise: Turquoise accent for shopping pages
 * - gradient: Gradient divider
 *
 * Usage:
 * <SectionHeader
 *   title="Our Story"
 *   description="Learn about our journey"
 *   variant="gold"
 *   centered
 * />
 */
interface SectionHeaderProps {
  title: string | ReactNode;
  description?: string;
  variant?: 'default' | 'gold' | 'turquoise' | 'gradient';
  centered?: boolean;
  showDivider?: boolean;
  className?: string;
}

export default function SectionHeader({
  title,
  description,
  variant = 'default',
  centered = true,
  showDivider = true,
  className = '',
}: SectionHeaderProps) {
  const dividerVariant = variant === 'default' ? 'gradient' : variant;

  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <h2
        className="text-3xl md:text-4xl font-bold mb-6"
        style={{ fontFamily: '"Libre Baskerville", serif', color: 'hsl(var(--text-primary))' }}
      >
        {title}
      </h2>
      {showDivider && <SectionDivider variant={dividerVariant} className="mb-8" />}
      {description && (
        <p
          className="text-base md:text-lg max-w-3xl mx-auto"
          style={{ fontFamily: '"Montserrat", sans-serif', color: 'hsl(var(--text-secondary))' }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
