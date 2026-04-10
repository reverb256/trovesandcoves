interface SectionDividerProps {
  variant?: 'gradient' | 'gold' | 'turquoise';
  className?: string;
}

/**
 * SectionDivider - Consistent decorative divider for sections
 *
 * Variants:
 * - gradient: Full width gradient (transparent → accent → transparent)
 * - gold: Simple gold divider (for subsections)
 * - turquoise: Simple turquoise divider
 */
export default function SectionDivider({
  variant = 'gradient',
  className = '',
}: SectionDividerProps) {
  const baseStyles = 'mx-auto rounded-full';

  const variantStyles: Record<string, string> = {
    gradient:
      'w-24 h-1 bg-gradient-to-r from-transparent via-[hsl(var(--accent-vibrant))] to-transparent',
    gold: 'w-16 h-0.5',
    turquoise: 'w-16 h-0.5',
  };

  const colorStyles: Record<string, React.CSSProperties> = {
    gradient: {},
    gold: { background: 'hsl(var(--gold-medium))' },
    turquoise: { background: 'hsl(var(--accent-vibrant))' },
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={colorStyles[variant]}
    />
  );
}
