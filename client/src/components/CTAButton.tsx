import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface CTAButtonProps {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

/**
 * CTAButton - Consistent rounded-full action button/link
 *
 * Variants:
 * - primary: Turquoise filled (main CTA)
 * - secondary: Turquoise outlined
 * - gold: Gold filled (informational pages)
 * - outline: Transparent with border
 *
 * Sizes:
 * - sm: px-6 py-2.5 text-sm
 * - md: px-8 py-4 text-sm
 * - lg: px-10 py-5 text-base
 *
 * Usage:
 * - As button: <CTAButton variant="primary" onClick={...}>Click</CTAButton>
 * - As link: <CTAButton variant="secondary" href="/path">Go</CTAButton>
 */
export default function CTAButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  href,
  target,
  rel,
  onClick,
}: CTAButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-3 rounded-full font-medium tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed no-underline';

  const sizeStyles: Record<string, string> = {
    sm: 'px-6 py-2.5 text-sm',
    md: 'px-8 py-4 text-sm',
    lg: 'px-10 py-5 text-base',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'hsl(var(--accent-vibrant))',
      color: 'hsl(var(--bg-primary))',
      border: 'none',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'hsl(var(--accent-vibrant))',
      border: '2px solid hsl(var(--accent-vibrant))',
    },
    gold: {
      backgroundColor: 'hsl(var(--gold-medium))',
      color: 'hsl(var(--text-primary))',
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'hsl(var(--text-primary))',
      border: '2px solid hsl(var(--border-medium))',
    },
  };

  const hoverStyles: Record<string, React.CSSProperties> = {
    primary: { opacity: 0.9, transform: 'scale(1.02)' },
    secondary: {
      backgroundColor: 'hsla(var(--accent-vibrant), 0.1)',
      transform: 'scale(1.02)',
    },
    gold: { opacity: 0.9, transform: 'scale(1.02)' },
    outline: {
      borderColor: 'hsl(var(--accent-vibrant))',
      color: 'hsl(var(--accent-vibrant))',
    },
  };

  const commonProps = {
    className: `${baseStyles} ${sizeStyles[size]} ${className}`,
    style: {
      ...variantStyles[variant],
      fontFamily: '"Montserrat", sans-serif',
    },
    disabled: disabled || isLoading,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (!disabled && !isLoading) {
        Object.assign(e.currentTarget.style, hoverStyles[variant]);
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      Object.assign(e.currentTarget.style, variantStyles[variant]);
      if (variant === 'outline') {
        e.currentTarget.style.borderColor = 'hsl(var(--border-medium))';
        e.currentTarget.style.color = 'hsl(var(--text-primary))';
      }
    },
    onClick,
  };

  if (href) {
    return (
      <a href={href} target={target} rel={rel} {...commonProps}>
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
      </a>
    );
  }

  return (
    <button {...commonProps}>
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
}
