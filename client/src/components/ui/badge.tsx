import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[hsl(var(--gold-soft))] text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--gold-medium))]',
        secondary:
          'border-transparent bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-secondary))]',
        gold: 'border-transparent bg-[hsl(var(--gold-soft))] text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--gold-medium))]',
        turquoise:
          'border-[hsla(var(--accent-vibrant),0.3)] bg-[hsla(var(--accent-vibrant),0.15)] text-[hsl(var(--accent-vibrant))]',
        outline:
          'text-[hsl(var(--text-primary))] border-[hsl(var(--border-medium))]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
