import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'product-card';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  const variantStyles: Record<string, string> = {
    text: 'rounded h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    'product-card': 'rounded-lg',
  };

  const animationStyles: Record<string, string> = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-surface-200 dark:bg-surface-700',
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-lg shadow-md overflow-hidden">
      <Skeleton
        variant="rectangular"
        height={200}
        className="w-full"
      />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </div>
    </div>
  );
}

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <div className="bg-gradient-to-br from-primary-20 to-primary-40 dark:from-primary-30 dark:to-primary-50 min-h-[600px] flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Skeleton variant="text" height={48} className="mx-auto max-w-2xl" />
          <Skeleton variant="text" height={24} className="mx-auto max-w-xl" />
          <Skeleton variant="text" height={24} className="mx-auto max-w-lg" />
          <div className="flex justify-center gap-4 mt-8">
            <Skeleton variant="rectangular" width={160} height={48} />
            <Skeleton variant="rectangular" width={160} height={48} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Product List Skeleton
export function ProductListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Loading Spinner
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`border-4 border-primary border-t-transparent rounded-full animate-spin ${sizeStyles[size]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

// Full Page Loading Skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen">
      <HeroSkeleton />
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-4">
          <Skeleton variant="text" width="30%" className="mx-auto" height={32} />
          <Skeleton variant="text" width="50%" className="mx-auto" />
        </div>
        <ProductListSkeleton count={6} />
      </div>
    </div>
  );
}
