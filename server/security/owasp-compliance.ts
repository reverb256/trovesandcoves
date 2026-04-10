import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import type { Request, Response, NextFunction } from 'express';
import {
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  SLOW_DOWN_AFTER,
  SLOW_DOWN_DELAY_MS,
  SESSION_SECRET,
  SESSION_MAX_AGE,
} from '../../shared/config';

// OWASP A02: Cryptographic Failures - Secure headers
export const securityHeaders = helmet({
  contentSecurityPolicy:
    process.env.NODE_ENV === 'production'
      ? {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              'https://fonts.googleapis.com',
            ],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", 'https:'],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", 'data:', 'blob:'],
            workerSrc: ["'self'"],
            childSrc: ["'none'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            upgradeInsecureRequests: [],
          },
        }
      : false, // Disable CSP in development for Vite HMR
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
});

// OWASP A07: Identification and Authentication Failures - Rate limiting
export const generalRateLimit = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: process.env.NODE_ENV === 'production' ? RATE_LIMIT_MAX_REQUESTS : 1000, // Much higher limit for dev
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => {
    // Skip rate limiting for development and static assets
    if (process.env.NODE_ENV !== 'production') return true;
    // Skip for HMR requests
    if (req.url?.includes('?v=')) return true;
    return false;
  },
});

// Slow down repeated requests
export const slowDownMiddleware = slowDown({
  windowMs: RATE_LIMIT_WINDOW_MS,
  delayAfter: SLOW_DOWN_AFTER,
  delayMs: SLOW_DOWN_DELAY_MS,
  keyGenerator: (req: Request) => req.ip || 'unknown',
});

// Session configuration
export const sessionConfig = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    sameSite: 'lax' as const,
  },
};

// Security logger
export const securityLogger = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  (res as Response & { startTime?: number }).startTime = start;

  next();
};

// Input sanitization
const sanitizeString = (str: string): string => {
  return str
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

const sanitizeObject = (obj: unknown): unknown => {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  } else if (obj && typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObject((obj as Record<string, unknown>)[key]);
    }
    return sanitized;
  }
  return obj;
};

export const sanitizeInput = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Basic sanitization - remove potentially dangerous characters
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    const sanitized: Record<string, unknown> = {};
    for (const key in req.query) {
      sanitized[key] = (req.query[key] as string).replace(/<[^>]*>/g, '');
    }
    req.query = sanitized as typeof req.query;
  }

  next();
};

// Input validation helper
export const validateInput = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    for (const field of fields) {
      const value = req.body[field];
      if (value && typeof value === 'string') {
        // Check for SQL injection patterns
        const sqlPatterns = [
          /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
          /(--)|;|\/\*|\*\//,
          /(\bOR\s+[\w\s]*=\s*[\w\s]*\b)/i,
        ];

        for (const pattern of sqlPatterns) {
          if (pattern.test(value)) {
            errors.push(`Invalid input in field: ${field}`);
            break;
          }
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Invalid input', details: errors });
    }

    next();
  };
};
