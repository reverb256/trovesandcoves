import { Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

interface SectionPillProps {
  children: ReactNode;
  variant?: 'turquoise' | 'gold';
  showIcon?: boolean;
  className?: string;
}

/**
 * SectionPill - Consistent pill badge for section headers
 *
 * Variants:
 * - turquoise: For main shopping pages (Home, Products)
 * - gold: For informational pages (About, Care, Policies)
 */
export default function SectionPill({
  children,
  variant = 'gold',
  showIcon = true,
  className = '',
}: SectionPillProps) {
  const baseStyle =
    'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border transition-all duration-300';

  const variantStyles: Record<string, React.CSSProperties> = {
    turquoise: {
      backgroundColor: 'hsla(174, 85%, 45%, 0.05)',
      borderColor: 'hsla(174, 85%, 45%, 0.2)',
      color: 'hsl(var(--accent-vibrant))',
    },
    gold: {
      backgroundColor: 'hsla(43, 78%, 60%, 0.15)',
      borderColor: 'hsl(var(--gold-medium))',
      color: 'hsl(var(--gold-medium))',
    },
  };

  return (
    <div className={`${baseStyle} ${className}`} style={variantStyles[variant]}>
      {showIcon && (
        <Sparkles
          className="w-4 h-4 flex-shrink-0"
          style={{
            color:
              variant === 'turquoise'
                ? 'hsl(var(--accent-vibrant))'
                : 'hsl(var(--gold-medium))',
          }}
        />
      )}
      <span className="text-xs tracking-widest uppercase font-semibold">
        {children}
      </span>
    </div>
  );
}
