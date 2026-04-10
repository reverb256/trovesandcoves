# Troves & Coves - Tech Stack

## Frontend

### Core

- **React 18.3.1** - UI library
- **TypeScript 5.6.3** - Type safety (strict mode enabled)
- **Vite 5.4.14** - Build tool and dev server
- **Wouter 3.3.5** - Lightweight routing

### UI Components & Styling

- **shadcn/ui** - Component library (Radix UI primitives)
- **Tailwind CSS 3.4.17** - Utility-first styling
- **Framer Motion 11.18.2** - Animations
- **Radix UI** - Headless UI components (many packages)
- **lucide-react 0.453.0** - Icon library
- **Material You** design system inspiration

### State & Data

- **@tanstack/react-query 5.60.5** - Server state management
- **react-hook-form 7.55.0** - Form handling
- **@hookform/resolvers 3.10.0** - Form validation
- **zod 3.25.56** - Schema validation

## Backend (Development Only)

### Core

- **Express 4.21.2** - Web server
- **TypeScript** - Type safety

### Security

- **helmet 8.1.0** - Security headers
- **express-rate-limit 7.5.0** - Rate limiting
- **express-slow-down 2.1.0** - Slow down protection
- **express-validator 7.2.1** - Input validation
- **cors 2.8.5** - CORS handling
- **bcrypt 6.0.0** - Password hashing (stub)
- **jsonwebtoken 9.0.2** - JWT tokens (stub)
- **passport 0.7.0** - Authentication (stub)

### Session

- **express-session 1.18.1** - Session management
- **memorystore 1.6.7** - Memory-based session store
- **connect-pg-simple 10.0.0** - PostgreSQL session store (unused)

### Database (Unused)

- **drizzle-orm 0.39.1** - ORM
- **@neondatabase/serverless 0.10.4** - Neon PostgreSQL client
- **drizzle-zod 0.7.0** - Zod integration
- Schema defined in shared/schema.ts but NOT connected

### Payments (Stub)

- **stripe 18.2.1** - Only runs when STRIPE_SECRET_KEY is set
- **@stripe/stripe-js 7.3.1** - Frontend Stripe SDK
- **@stripe/react-stripe-js 3.7.0** - React Stripe components

### Logging

- **winston 3.17.0** - Logging library

## Deployment

### Cloudflare Workers

- **wrangler 4.19.1** - Cloudflare Workers CLI
- **ws 8.18.0** - WebSocket

## Testing

### Unit Testing

- **Vitest 3.2.4** - Unit test framework
- **@testing-library/react 16.3.0** - React testing utilities
- **@testing-library/user-event 14.6.1** - User interaction simulation
- **jsdom 26.1.0** - DOM simulation
- **@vitest/coverage-v8 3.2.4** - Code coverage

### E2E Testing

- **Playwright 1.53.1** - E2E testing
- **axe-playwright 2.1.0** - Accessibility testing

## Code Quality

- **ESLint 9.29.0** - Linting
- **@typescript-eslint/eslint-plugin 8.34.1** - TypeScript ESLint
- **Prettier 3.5.3** - Code formatting

## Build Tools

- **esbuild 0.25.0** - Fast bundler
- **tsx 4.19.1** - TypeScript execution
- **postcss 8.4.47** - CSS processing
- **autoprefixer 10.4.20** - CSS vendor prefixes
- **@tailwindcss/vite 4.1.3** - Tailwind Vite plugin
- **vite-plugin-pwa 1.0.0** - PWA support

## Additional Libraries

- **date-fns 3.6.0** - Date utilities
- **clsx 2.1.1** - Class name utilities
- **tailwind-merge 2.6.0** - Tailwind class merging
- **class-variance-authority 0.7.1** - Component variants
- **cmdk 1.1.1** - Command palette
- **input-otp 1.4.2** - OTP input
- **next-themes 0.4.6** - Theme switching
- **recharts 2.15.2** - Charts
