import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * IconCircle - Consistent circular icon container
 *
 * Variants:
 * - turquoise: Brand turquoise background (shopping, feature cards)
 * - turquoise-soft: Soft turquoise background (step indicators)
 * - gold: Gold background (informational pages, values)
 * - gold-soft: Soft gold background (materials cards)
 * - success: Green background (confirmation states)
 * - error: Destructive background (error states)
 * - outline: Transparent with border (decorative)
 *
 * Sizes:
 * - xs: w-8 h-8 (badge indicators)
 * - sm: w-12 h-12 (feature icons)
 * - base: w-16 h-16 (error states)
 * - md: w-14 h-14 (value cards)
 * - lg: w-20 h-20 (decorative, info cards)
 * - xl: w-24 h-24 (large decorative)
 *
 * Usage:
 * <IconCircle icon={Award} variant="gold" size="sm" />
 * <IconCircle variant="turquoise" size="lg"><CustomIcon /></IconCircle>
 */
interface IconCircleProps {
  icon?: LucideIcon;
  variant?:
    | 'turquoise'
    | 'turquoise-soft'
    | 'gold'
    | 'gold-soft'
    | 'success'
    | 'error'
    | 'outline';
  size?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl';
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function IconCircle({
  icon: Icon,
  variant = 'turquoise',
  size = 'md',
  children,
  className = '',
  style: customStyle,
}: IconCircleProps) {
  const sizeStyles: Record<string, string> = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    base: 'w-16 h-16',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const iconSizes: Record<string, string> = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    base: 'w-8 h-8',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    turquoise: {
      backgroundColor: 'hsl(var(--accent-vibrant))',
      color: 'hsl(var(--bg-primary))',
    },
    'turquoise-soft': {
      backgroundColor: 'hsla(var(--accent-vibrant), 0.2)',
      color: 'hsl(var(--text-primary))',
    },
    gold: {
      backgroundColor: 'hsl(var(--gold-medium))',
      color: 'hsl(var(--text-primary))',
    },
    'gold-soft': {
      backgroundColor: 'hsla(43, 78%, 60%, 0.15)',
      color: 'hsl(var(--gold-medium))',
    },
    success: {
      backgroundColor: 'hsla(142, 76%, 96%, 1)',
      color: 'hsl(142 76% 36%)',
    },
    error: {
      backgroundColor: 'hsla(var(--destructive), 0.1)',
      color: 'hsl(var(--destructive))',
    },
    outline: {
      backgroundColor: 'hsla(174, 51%, 51%, 0.1)',
      border: '2px solid hsl(var(--accent-vibrant))',
      color: 'hsl(var(--accent-vibrant))',
    },
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full ${sizeStyles[size]} ${className}`}
      style={{ ...variantStyles[variant], ...customStyle }}
    >
      {children || (Icon && <Icon className={iconSizes[size]} />)}
    </div>
  );
}
