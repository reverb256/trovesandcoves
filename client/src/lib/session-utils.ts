/**
 * Shared session utilities for API clients
 * Provides atomic session management to prevent race conditions
 */

const SESSION_KEY = 'trovesandcoves_session';

/**
 * Get or create session ID atomically
 * This prevents race conditions when multiple requests happen simultaneously
 */
export function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Check if we're in development mode
 */
export const isDevelopment = import.meta.env.DEV || (typeof window !== 'undefined' && window.location.hostname === 'localhost');
