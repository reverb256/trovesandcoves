import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import SectionPill from '@/components/SectionPill';
import SectionDivider from '@/components/SectionDivider';
import IconCircle from '@/components/IconCircle';

/**
 * Reusable themed section header for pages
 * Provides consistent badge + title + gradient divider pattern
 */
export interface ThemeSectionHeaderProps {
  badge?: string;
  title: ReactNode;
  description?: ReactNode;
}

export function ThemeSectionHeader({
  badge,
  title,
  description,
}: ThemeSectionHeaderProps) {
  return (
    <section
      className="relative overflow-hidden py-20"
      style={{
        background:
          'linear-gradient(180deg, hsl(var(--bg-primary)) 0%, hsl(var(--bg-secondary)) 100%)',
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{
          background:
            'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-1"
        style={{
          background:
            'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)',
        }}
      />

      <div className="relative chamber-container text-center">
        {badge && (
          <SectionPill variant="gold" className="mb-8">
            {badge}
          </SectionPill>
        )}

        <h1
          className="text-5xl md:text-6xl font-bold mb-6 font-brand-heading"
          style={{ color: 'hsl(var(--text-primary))' }}
        >
          {title}
        </h1>

        <SectionDivider variant="gradient" className="mb-6" />

        {description && (
          <p
            className="text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'hsl(var(--text-secondary))' }}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

/**
 * Reusable elevated card with gradient theme
 * Used for feature cards, info cards, etc.
 */
export interface ThemeCardProps {
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ThemeCard({
  title,
  icon,
  children,
  className,
}: ThemeCardProps) {
  return (
    <Card variant="elevated" theme="gradient" className={className}>
      <CardHeader variant="gradient">
        <CardTitle
          className="flex items-center gap-3"
          style={{ color: 'hsl(var(--accent-vibrant))' }}
        >
          {icon && (
            <span style={{ color: 'hsl(var(--gold-medium))' }}>{icon}</span>
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/**
 * Reusable info card with icon circle
 * Used for value propositions, features, benefits
 */
export interface InfoCircleCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  size?: 'sm' | 'md' | 'lg';
}

export function InfoCircleCard({
  icon,
  title,
  description,
  size = 'md',
}: InfoCircleCardProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  return (
    <div className="text-center">
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center mx-auto mb-4`}
        style={{ backgroundColor: 'hsla(var(--accent-vibrant), 0.2)' }}
      >
        <span
          className={`${size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-xl'}`}
          style={{ color: 'hsl(var(--text-primary))' }}
        >
          {icon}
        </span>
      </div>
      <h3
        className="font-semibold mb-2"
        style={{ color: 'hsl(var(--text-primary))' }}
      >
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: 'hsl(var(--text-muted))' }}
      >
        {description}
      </p>
    </div>
  );
}

/**
 * Reusable step card for processes/tutorials
 */
export interface StepCardProps {
  step: number;
  title: string;
  description: string;
}

export function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div className="flex items-start space-x-4">
      <IconCircle variant="turquoise-soft" size="sm" className="flex-shrink-0">
        <span className="font-bold">{step}</span>
      </IconCircle>
      <div className="flex-1">
        <h4
          className="font-semibold mb-2"
          style={{ color: 'hsl(var(--text-primary))' }}
        >
          {title}
        </h4>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'hsl(var(--text-muted))' }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/**
 * Reusable gradient divider
 */
export function GradientDivider({ className }: { className?: string }) {
  return (
    <div
      className={`w-24 h-1 mx-auto rounded-full ${className}`}
      style={{
        background:
          'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)',
      }}
    />
  );
}

/**
 * Reusable two-tone gradient divider
 */
export function TwoToneDivider({ className }: { className?: string }) {
  return (
    <div
      className={`w-24 h-1 mx-auto rounded-full ${className}`}
      style={{
        background:
          'linear-gradient(90deg, hsl(var(--accent-vibrant)), hsl(215 95% 55%))',
      }}
    />
  );
}
