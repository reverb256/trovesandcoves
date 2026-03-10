import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BRAND_COLORS, WCAG_COLORS } from '@/lib/color-utils';

/**
 * Brand heading component with WCAG AA compliance
 * Uses Libre Baskerville + turquoise (brand or WCAG compliant based on size)
 */
export interface BrandHeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xl' | 'lg' | 'md' | 'sm';
  className?: string;
}

const sizeMap = {
  xl: { fontSize: '2.5rem', pxSize: 40 }, // > 18px, brand color OK
  lg: { fontSize: '2rem', pxSize: 32 },    // > 18px, brand color OK
  md: { fontSize: '1.5rem', pxSize: 24 },   // > 18px, brand color OK
  sm: { fontSize: '1.125rem', pxSize: 18 }, // >= 18px, brand color OK
};

export function BrandHeading({
  children,
  level = 2,
  size = 'lg',
  className
}: BrandHeadingProps) {
  const sizeConfig = sizeMap[size];
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  const canUseBrandColor = sizeConfig.pxSize >= 18;
  const color = canUseBrandColor ? BRAND_COLORS.turquoise : WCAG_COLORS.turquoise;

  const classes = cn(
    'font-bold',
    className
  );

  return (
    <HeadingTag
      className={classes}
      style={{
        fontFamily: "'Libre Baskerville', serif",
        fontSize: sizeConfig.fontSize,
        color,
      }}
    >
      {children}
    </HeadingTag>
  );
}

/**
 * Brand body text component
 * Uses Montserrat + theme-aware color
 */
export interface BrandBodyTextProps {
  children: ReactNode;
  size?: 'lg' | 'md' | 'sm';
  className?: string;
}

const bodySizeMap = {
  lg: { fontSize: '1.125rem' },
  md: { fontSize: '1rem' },
  sm: { fontSize: '0.875rem' },
};

export function BrandBodyText({
  children,
  size = 'md',
  className
}: BrandBodyTextProps) {
  const classes = cn('leading-relaxed', className);

  return (
    <p
      className={classes}
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: bodySizeMap[size].fontSize,
        color: 'hsl(var(--text-primary))',
      }}
    >
      {children}
    </p>
  );
}

/**
 * Brand script text component (for "Coves" branding)
 * Uses Alex Brush + gold (brand or WCAG compliant based on size)
 */
export interface BrandScriptTextProps {
  children: ReactNode;
  size?: 'xl' | 'lg' | 'md' | 'sm';
  className?: string;
}

const scriptSizeMap = {
  xl: { fontSize: '3rem', pxSize: 48 },    // > 18px, brand color OK
  lg: { fontSize: '2rem', pxSize: 32 },    // > 18px, brand color OK
  md: { fontSize: '1.5rem', pxSize: 24 },  // > 18px, brand color OK
  sm: { fontSize: '1rem', pxSize: 16 },    // < 18px, use WCAG variant
};

export function BrandScriptText({
  children,
  size = 'lg',
  className
}: BrandScriptTextProps) {
  const sizeConfig = scriptSizeMap[size];
  const canUseBrandColor = sizeConfig.pxSize >= 18;
  const color = canUseBrandColor ? BRAND_COLORS.gold : WCAG_COLORS.gold;

  const classes = cn('font-normal', className);

  return (
    <span
      className={classes}
      style={{
        fontFamily: "'Alex Brush', cursive",
        fontSize: sizeConfig.fontSize,
        color,
      }}
    >
      {children}
    </span>
  );
}
