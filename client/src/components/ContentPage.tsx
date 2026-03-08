import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * Shared page header component for content pages
 * Provides consistent styling for page titles and descriptions
 */
interface ContentPageHeaderProps {
  badgeLabel: string;
  title: ReactNode;
  description?: string;
  titleGradient?: 'default' | 'custom';
}

export function ContentPageHeader({
  badgeLabel,
  title,
  description,
  titleGradient = 'default',
}: ContentPageHeaderProps) {
  return (
    <section className="relative bg-gradient-to-br from-pearl-cream via-crystal-accents to-pearl-cream text-navy overflow-hidden py-20">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-skull-turquoise to-transparent" />

      <div className="relative container mx-auto px-4 text-center">
        <div className="inline-block px-6 py-2 border border-ornate-frame-gold/20 rounded-lg bg-ornate-frame-gold/5 backdrop-blur-sm mb-6">
          <span className="text-ornate-frame-gold/80 text-sm font-medium tracking-wider uppercase">
            {badgeLabel}
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 font-brand-heading">
          {title}
        </h1>

        <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent rounded-full" />

        {description && (
          <p className="text-navy/80 text-xl max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

/**
 * Content wrapper for page body
 * Provides consistent padding and container
 */
interface ContentPageBodyProps {
  children: ReactNode;
}

export function ContentPageBody({ children }: ContentPageBodyProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      {children}
    </div>
  );
}

/**
 * Page wrapper with background gradient
 */
interface ContentPageWrapperProps {
  children: ReactNode;
}

export function ContentPageWrapper({ children }: ContentPageWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-warm via-pearl-cream to-moonstone">
      {children}
    </div>
  );
}

/**
 * Section header with consistent styling
 */
interface SectionHeaderProps {
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeader({ title, description, centered = true }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-navy/70 text-lg max-w-3xl mx-auto mt-4">
          {description}
        </p>
      )}
      <div className="w-24 h-1 mx-auto mt-6 bg-gradient-to-r from-troves-turquoise to-coves-cursive-blue rounded-full" />
    </div>
  );
}

/**
 * Info card component for displaying key-value information
 */
interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  color?: 'troves-turquoise' | 'coves-cursive-blue' | 'skull-turquoise';
}

export function InfoCard({ icon: Icon, title, children, color = 'troves-turquoise' }: InfoCardProps) {
  const colorClasses = {
    'troves-turquoise': 'from-troves-turquoise/10 to-troves-turquoise/5',
    'coves-cursive-blue': 'from-coves-cursive-blue/10 to-coves-cursive-blue/5',
    'skull-turquoise': 'from-skull-turquoise/10 to-skull-turquoise/5',
  };

  return (
    <div className="text-center">
      <div className={`w-20 h-20 bg-${color} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-xl font-bold text-navy mb-2">{title}</h3>
      <p className="text-navy/70">{children}</p>
    </div>
  );
}
