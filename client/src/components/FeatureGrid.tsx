import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

/**
 * FeatureGrid - Consistent grid of feature cards with icons
 *
 * Usage:
 * <FeatureGrid
 *   features={[
 *     { icon: Shield, title: 'Title', description: 'Description' },
 *     ...
 *   ]}
 * />
 */
export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'card' | 'minimal';
  className?: string;
}

export default function FeatureGrid({
  features,
  columns = 3,
  variant = 'default',
  className = '',
}: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  if (variant === 'card') {
    return (
      <div className={`grid gap-8 ${gridCols[columns]} ${className}`}>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="shadow-lg border transition-all duration-300 hover:shadow-xl"
              style={{
                backgroundColor: 'hsl(var(--bg-card))',
                borderColor: 'hsla(var(--gold-medium), 0.15)',
              }}
            >
              <div className="p-6 text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    backgroundColor: 'hsla(var(--accent-vibrant), 0.15)',
                  }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: 'hsl(var(--accent-vibrant))' }}
                  />
                </div>
                <h3
                  className="text-lg font-bold mb-3"
                  style={{
                    fontFamily: '"Libre Baskerville", serif',
                    color: 'hsl(var(--text-primary))',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: '"Montserrat", sans-serif',
                    color: 'hsl(var(--text-secondary))',
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div
        className={`grid gap-8 max-w-5xl mx-auto ${gridCols[columns]} ${className}`}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'hsla(43, 78%, 60%, 0.15)' }}
              >
                <Icon
                  className="w-6 h-6"
                  style={{ color: 'hsl(var(--gold-medium))' }}
                />
              </div>
              <h3
                className="text-lg font-bold mb-3"
                style={{
                  fontFamily: '"Libre Baskerville", serif',
                  color: 'hsl(var(--text-primary))',
                }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: '"Montserrat", sans-serif',
                  color: 'hsl(var(--text-secondary))',
                }}
              >
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`grid gap-6 ${gridCols[columns]} ${className}`}>
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: 'hsla(var(--accent-vibrant), 0.15)' }}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: 'hsl(var(--accent-vibrant))' }}
              />
            </div>
            <h3
              className="text-base font-semibold mb-2"
              style={{
                fontFamily: '"Montserrat", sans-serif',
                color: 'hsl(var(--text-primary))',
              }}
            >
              {feature.title}
            </h3>
            <p
              className="text-sm"
              style={{
                fontFamily: '"Montserrat", sans-serif',
                color: 'hsl(var(--text-secondary))',
              }}
            >
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
