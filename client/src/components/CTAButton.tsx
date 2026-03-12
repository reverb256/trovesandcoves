import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

/**
 * CTAButton - Consistent rounded-full action button
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
 */
export default function CTAButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: CTAButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-3 rounded-full font-medium tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

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
    secondary: { backgroundColor: 'hsla(var(--accent-vibrant), 0.1)', transform: 'scale(1.02)' },
    gold: { opacity: 0.9, transform: 'scale(1.02)' },
    outline: { borderColor: 'hsl(var(--accent-vibrant))', color: 'hsl(var(--accent-vibrant))' },
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${className}`}
      style={{
        ...variantStyles[variant],
        fontFamily: '"Montserrat", sans-serif',
      }}
      disabled={disabled || isLoading}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          Object.assign(e.currentTarget.style, hoverStyles[variant]);
        }
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, variantStyles[variant]);
        if (variant === 'outline') {
          e.currentTarget.style.borderColor = 'hsl(var(--border-medium))';
          e.currentTarget.style.color = 'hsl(var(--text-primary))';
        }
      }}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
}
