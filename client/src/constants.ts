/**
 * Application-wide constants
 * Centralizes magic numbers and configuration values
 */

// Scroll thresholds
export const SCROLL_THRESHOLD = 20; // Pixels to scroll before showing sticky header effects

// API timeouts
export const API_TIMEOUT_MS = 10000; // 10 second timeout for API requests
export const API_RETRY_DELAY_MS = 1000; // Base delay for retry attempts
export const API_MAX_RETRIES = 3; // Maximum number of retry attempts

// Cache times for React Query
export const STALE_TIME_IMMEDIATE = 0; // Data is immediately stale
export const STALE_TIME_SHORT = 1000 * 60; // 1 minute
export const STALE_TIME_MEDIUM = 1000 * 60 * 5; // 5 minutes
export const STALE_TIME_LONG = 1000 * 60 * 15; // 15 minutes

// Cart
export const CART_STORAGE_KEY = 'trovesandcoves_cart';
export const CART_SESSION_BACKUP_KEY = 'trovesandcoves_cart_session';

// Animation durations (ms)
export const ANIMATION_DURATION_FAST = 150;
export const ANIMATION_DURATION_NORMAL = 300;
export const ANIMATION_DURATION_SLOW = 500;

// Breakpoints (for consistency with Tailwind)
export const BREAKPOINT_SM = 640;
export const BREAKPOINT_MD = 768;
export const BREAKPOINT_LG = 1024;
export const BREAKPOINT_XL = 1280;

// UI constants
export const MAX_QUANTITY_PER_ITEM = 99;
export const MIN_QUANTITY_PER_ITEM = 1;

// Pagination
export const PRODUCTS_PER_PAGE = 12;

// Search
export const SEARCH_DEBOUNCE_MS = 300;
