import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "shadow-sm bg-card",
        elevated: "shadow-2xl",
        glass: "shadow-lg",
        interactive: "shadow-2xl group-hover:scale-105 transition-transform duration-300",
        accent: "shadow-lg", // accent variant for featured cards
      },
      theme: {
        default: "",
        gradient: "",
      },
    },
    defaultVariants: {
      variant: "default",
      theme: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  variant?: "default" | "elevated" | "glass" | "interactive" | "accent"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, theme, ...props }, ref) => {
    const isGradient = theme === "gradient"
    const isAccent = variant === "accent"

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, theme }), className)}
        style={
          isAccent
            ? {
                border: '1px solid hsla(174, 85%, 45%, 0.3)',
                background: 'linear-gradient(135deg, hsl(var(--bg-card)) 0%, hsl(var(--bg-secondary)) 100%)'
              }
            : isGradient
            ? {
                border: '1px solid hsl(var(--border-medium))',
                background: 'linear-gradient(135deg, hsl(var(--bg-card)) 0%, hsl(var(--bg-secondary)) 100%)'
              }
            : undefined
        }
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

// BrandCard - convenience component with gradient theme by default
export interface BrandCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass" | "interactive" | "accent"
  children: React.ReactNode
}

export const BrandCard = React.forwardRef<HTMLDivElement, BrandCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const isAccent = variant === 'accent';
    const isGlass = variant === 'glass';

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, theme: 'gradient' }), className)}
        style={{
          border: isAccent
            ? '1px solid hsla(174, 85%, 45%, 0.3)'
            : undefined,
          background: isGlass
            ? 'rgba(255, 255, 255, 0.8)'
            : 'linear-gradient(135deg, hsl(var(--bg-card)) 0%, hsl(var(--bg-secondary)) 100%)',
          ...props.style
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BrandCard.displayName = "BrandCard"

const cardHeaderVariants = cva(
  "flex flex-col space-y-1.5 p-6",
  {
    variants: {
      variant: {
        default: "",
        gradient: "border-b",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {
  variant?: "default" | "gradient"
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, variant, ...props }, ref) => {
    const isGradient = variant === "gradient"

    return (
      <div
        ref={ref}
        className={cn(cardHeaderVariants({ variant }), className)}
        style={isGradient ? {
          background: 'linear-gradient(90deg, hsla(var(--accent-vibrant), 0.1), hsla(var(--accent-vibrant), 0.05))',
          borderBottomColor: 'hsl(var(--border-medium))'
        } : undefined}
        {...props}
      />
    )
  }
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    style={{ color: 'hsl(var(--text-primary))' }}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
