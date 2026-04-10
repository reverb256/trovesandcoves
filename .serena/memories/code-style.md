# Troves & Coves - Code Style & Conventions

## TypeScript Configuration

### Strict Mode

- `strict: true` - All strict type checking enabled
- `noEmit: true` - No output files (Vite handles compilation)
- `moduleResolution: "bundler"` - Modern module resolution
- `jsx: "preserve"` - JSX handled by Vite

### Path Aliases

- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`
- `@assets/*` → `./attached_assets/*`

## Code Style Rules

### Prettier Configuration (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### ESLint Rules

- `react/prop-types: off` - PropTypes not needed with TypeScript
- `@typescript-eslint/no-unused-vars: warn` - Warn on unused vars
- `@typescript-eslint/no-explicit-any: warn` - Warn on `any` types
- `react-hooks/rules-of-hooks: error` - Enforce Hooks rules
- `react-hooks/exhaustive-deps: warn` - Warn on dependency issues

## Naming Conventions

### Files

- **Components**: PascalCase (e.g., `ProductCard.tsx`, `Header.tsx`)
- **Utilities**: kebab-case (e.g., `api-client.ts`, `use-cart.ts`)
- **UI Components**: kebab-case in `components/ui/` (shadcn convention)
- **Pages**: PascalCase in `pages/` (e.g., `Home.tsx`, `ProductDetail.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useCart.ts`, `use-mobile.tsx`)

### Code

- **Components**: PascalCase (e.g., `function ProductCard()`)
- **Functions/Variables**: camelCase (e.g., `getProducts()`, `cartItems`)
- **Types/Interfaces**: PascalCase (e.g., `interface Product`, `type CartItem`)
- **Constants**: UPPER_SNAKE_CASE or camelCase depending on scope
- **CSS Classes**: Tailwind utilities (no custom CSS classes preferred)

## Component Patterns

### Functional Components with Hooks

```typescript
// Preferred
function ProductCard({ product }: { product: Product }) {
  // hooks
  const [isLoading, setIsLoading] = useState(false);

  // handlers
  const handleClick = () => { ... };

  // render
  return <div>...</div>;
}
```

### Props Destructuring

```typescript
// Preferred
function Header({ title, subtitle }: HeaderProps) {
  return <h1>{title}</h1>;
}

// For many props, use interface
interface HeaderProps {
  title: string;
  subtitle?: string;
  onAction?: () => void;
}
```

## Import Ordering

```typescript
// 1. React and core libraries
import React from 'react';
import { useState } from 'react';

// 2. Third-party libraries
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

// 3. Shared types and utilities
import { Product } from '@shared/schema';
import { cn } from '@/lib/utils';

// 4. Local components
import { ProductCard } from '@/components/ProductCard';
```

## Shared Code Pattern

Shared code lives in `shared/` directory:

- `shared/schema.ts` - Drizzle ORM schema + Zod validation (currently unused)
- `shared/config.ts` - Centralized configuration
- `shared/brand-config.ts` - Brand/design tokens
- `shared/locked-design-language.ts` - Design system constants

## API Pattern

All API calls go through `client/src/apiClient.ts`:

- Centralized API functions
- Timeout support with AbortController
- Retry logic with exponential backoff
- Uses TanStack Query for caching/state

## Design System

### Material You Colors (from locked-design-language.ts)

- `surface-50`, `surface-100`, `surface-200`... - Background surfaces
- `on-surface`, `on-surface-variant` - Text on surfaces
- `primary`, `primary-container` - Brand colors
- `secondary`, `secondary-container` - Accent colors
- `tertiary`, `tertiary-container` - Additional accents
- `error`, `on-error` - Error states

### Component Variants

Use `class-variance-authority` (cva) for component variants:

```typescript
const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'default-classes',
      destructive: 'destructive-classes',
    },
  },
});
```

## Error Handling

- React Query for API errors
- ErrorBoundary component for rendering errors
- Toast notifications for user-facing errors
- Try-catch in async functions

## Testing Patterns

### Unit Tests (Vitest)

- `*.test.ts` or `*.test.tsx` suffix
- Use `@testing-library/react` for components
- Mock API calls with vi.mock()

### E2E Tests (Playwright)

- Files in `tests/e2e/` directory
- Page Object Model pattern for complex pages
- Use `data-testid` attributes for selectors

## Security Patterns

- Input sanitization via `server/security/validation.ts`
- Rate limiting on API endpoints
- No sensitive data in client-side code
- Environment variables for secrets

## Git Commit Messages

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `docs:` - Documentation
- `chore:` - Maintenance tasks
