import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import SectionPill from '@/components/SectionPill';
import SectionDivider from '@/components/SectionDivider';

/**
 * Shared page header component for content pages
 * Provides consistent styling for page titles and descriptions
 */
interface ContentPageHeaderProps {
  badgeLabel: string;
  title: ReactNode;
  description?: string;
}

export function ContentPageHeader({
  badgeLabel,
  title,
  description,
}: ContentPageHeaderProps) {
  return (
    <section className="relative overflow-hidden py-24" style={{ background: 'linear-gradient(180deg, hsl(var(--bg-primary)) 0%, hsl(var(--bg-secondary)) 100%)' }}>
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)' }} />
      <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--accent-vibrant)), transparent)' }} />

      <div className="relative chamber-container text-center">
        <SectionPill variant="gold" className="mb-8">
          {badgeLabel}
        </SectionPill>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 font-brand-heading" style={{ color: 'hsl(var(--text-primary))' }}>
          {title}
        </h1>

        <SectionDivider variant="gradient" className="mb-6" />

        {description && (
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'hsl(var(--text-secondary))' }}>
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
    <div className="min-h-screen" style={{ background: 'hsl(var(--bg-primary))' }}>
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
      <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'hsl(var(--text-primary))' }}>
        {title}
      </h2>
      {description && (
        <p className="text-lg max-w-3xl mx-auto mt-4" style={{ color: 'hsl(var(--text-secondary))' }}>
          {description}
        </p>
      )}
      <SectionDivider variant="gradient" className="mt-6" />
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
}

export function InfoCard({ icon: Icon, title, children }: InfoCardProps) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}>
        <Icon className="w-10 h-10" style={{ color: 'hsl(var(--bg-primary))' }} />
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--text-primary))' }}>{title}</h3>
      <p style={{ color: 'hsl(var(--text-secondary))' }}>{children}</p>
    </div>
  );
}
