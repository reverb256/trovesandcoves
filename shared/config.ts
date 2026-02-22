/**
 * Centralized configuration for Troves & Coves application
 *
 * This file consolidates all configuration values that were previously
 * hardcoded throughout the codebase.
 */

// API URLs
export const API_URL = process.env.VITE_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://troves-coves-api.vercel.app'
    : 'http://localhost:5000');

export const FRONTEND_URL = process.env.VITE_GITHUB_PAGES_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://reverb256.github.io/troves-coves'
    : 'http://localhost:5173');

export const BASE_PATH = process.env.VITE_BASE_PATH || '/trovesandcoves/';

// Server configuration
export const SERVER_PORT = parseInt(process.env.PORT || '5000', 10);
export const SERVER_HOST = process.env.HOST || '0.0.0.0';

// Session configuration
export const SESSION_SECRET = process.env.SESSION_SECRET || 'troves-coves-session-secret-change-in-production';
export const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

// Rate limiting configuration
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 100;
export const SLOW_DOWN_AFTER = 50; // requests
export const SLOW_DOWN_DELAY_MS = 500;

// Memory limits (for Replit deployment)
export const MEMORY_LIMIT_MB = 384;
export const MEMORY_CHECK_INTERVAL_MS = 30000; // 30 seconds

// API timeout configuration
export const API_TIMEOUT_MS = 30000; // 30 seconds
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY_MS = 1000;

// Feature flags
export const FEATURES = {
  STRIPE_ENABLED: !!process.env.STRIPE_SECRET_KEY,
  DATABASE_ENABLED: !!process.env.DATABASE_URL,
  AUTH_ENABLED: false, // Not implemented yet
  ADMIN_DASHBOARD: false, // Not implemented yet
} as const;

// Currency configuration
export const CURRENCY = {
  code: 'CAD',
  locale: 'en-CA',
  symbol: '$',
} as const;

// Upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
} as const;

// Cache configuration
export const CACHE = {
  PRODUCT_CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes
  CATEGORY_CACHE_TTL_MS: 60 * 60 * 1000, // 1 hour
} as const;

// Environment helpers
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';

// Validation helpers
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (isProduction && SESSION_SECRET.includes('change-in-production')) {
    errors.push('SESSION_SECRET must be changed in production');
  }

  if (FEATURES.STRIPE_ENABLED && !process.env.STRIPE_PUBLISHABLE_KEY) {
    errors.push('STRIPE_PUBLISHABLE_KEY is required when STRIPE_SECRET_KEY is set');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Export all config as a single object for convenience
export const config = {
  api: {
    url: API_URL,
    timeout: API_TIMEOUT_MS,
    retries: API_RETRY_ATTEMPTS,
  },
  server: {
    port: SERVER_PORT,
    host: SERVER_HOST,
  },
  session: {
    secret: SESSION_SECRET,
    maxAge: SESSION_MAX_AGE,
  },
  rateLimit: {
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
    slowDownAfter: SLOW_DOWN_AFTER,
    slowDownDelay: SLOW_DOWN_DELAY_MS,
  },
  features: FEATURES,
  currency: CURRENCY,
  uploads: UPLOAD_LIMITS,
  pagination: PAGINATION,
  cache: CACHE,
  environment: {
    isProduction,
    isDevelopment,
    isTest,
  },
} as const;
