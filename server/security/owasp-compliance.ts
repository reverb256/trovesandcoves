import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import type { Request, Response, NextFunction } from 'express';

// OWASP A02: Cryptographic Failures - Secure headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", 'https://api.stripe.com'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      workerSrc: ["'self'"],
      childSrc: ["'none'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Slow down repeated requests
export const slowDownMiddleware = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 fast requests per 15 minutes
  delayMs: 500, // Then delay by 500ms per request
  keyGenerator: (req: Request) => req.ip || 'unknown',
});

// Session configuration
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'troves-coves-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' as const,
  },
};

// Security logger
export const securityLogger = (req: Request, _res: Response, next: NextFunction) => {
  const start = Date.now();
  (_res as any).startTime = start;

  next();
};

// Input sanitization
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Basic sanitization - remove potentially dangerous characters
  if (req.body) {
    const sanitizeString = (str: string): string => {
      return str.replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
    };

    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return sanitizeString(obj);
      } else if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      } else if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const key in obj) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
        return sanitized;
      }
      return obj;
    };

    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    const sanitized: any = {};
    for (const key in req.query) {
      sanitized[key] = (req.query[key] as string).replace(/<[^>]*>/g, '');
    }
    req.query = sanitized;
  }

  next();
};

// CSRF Token validation (stub for future use)
export const validateCsrfToken = (_req: Request, _res: Response, next: NextFunction) => {
  // CSRF validation to be implemented when needed
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
          /(\bOR\s+[\w\s]*=\s*[\w\s]*\b)/i
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
