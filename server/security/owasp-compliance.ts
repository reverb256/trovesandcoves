import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import { validationResult, body, param, query } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

// OWASP A01: Broken Access Control
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Implement role-based access control
  const publicPaths = ['/api/products', '/api/categories', '/api/contact', '/api/ai/status'];
  const adminPaths = ['/api/admin'];

  if (adminPaths.some(path => req.path.startsWith(path))) {
    if (!req.session?.user?.role || req.session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient privileges' });
    }
  }

  next();
};

// OWASP A02: Cryptographic Failures - Secure headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      workerSrc: ["'self'"],
      childSrc: ["'none'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
});

// OWASP A03: Injection - Input validation and sanitization
export const validateInput = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid input',
        details: errors.array().map(err => ({
          field: err.type === 'field' ? err.path : 'unknown',
          message: err.msg
        }))
      });
    }

    next();
  };
};

// Common validation schemas
export const productValidation = [
  param('id').isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
];

export const cartValidation = [
  body('productId').isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
  body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
];

export const contactValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').optional().isMobilePhone('any').withMessage('Valid phone number required'),
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be 5-200 characters'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),
];

// OWASP A04: Insecure Design - Rate limiting and DDoS protection
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs for sensitive endpoints
  message: {
    error: 'Too many sensitive requests, please try again later.'
  }
});

export const slowDownMiddleware = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per 15 minutes without delay
  delayMs: () => 500, // Add 500ms of delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
});

// OWASP A05: Security Misconfiguration - Secure session management
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'secure-random-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' as const
  },
  name: 'sessionId'
};

// OWASP A06: Vulnerable and Outdated Components - Security monitoring
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      suspicious: duration > 10000 || res.statusCode >= 400
    };

    if (logData.suspicious) {
      console.warn('Security Alert:', logData);
    }
  });

  next();
};

// OWASP A07: Identification and Authentication Failures
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    const sessionToken = req.session?.csrfToken;

    if (!token || token !== sessionToken) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
  }

  next();
};

// OWASP A08: Software and Data Integrity Failures
export const integrityCheck = (req: Request, res: Response, next: NextFunction) => {
  // Add content integrity checks for critical operations
  if (req.path.includes('/admin') || req.path.includes('/payment')) {
    const expectedSignature = req.headers['x-signature'];
    if (!expectedSignature) {
      return res.status(400).json({ error: 'Missing integrity signature' });
    }
  }

  next();
};

// OWASP A09: Security Logging and Monitoring Failures
export class SecurityEventLogger {
  static logSecurityEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      details: JSON.stringify(details),
      source: 'security-middleware'
    };

    console.log(`[SECURITY-${severity.toUpperCase()}]`, logEntry);

    // In production, send to SIEM system
    if (process.env.NODE_ENV === 'production' && severity === 'critical') {
      // Send alert to security team
    }
  }
}

// OWASP A10: Server-Side Request Forgery (SSRF)
export const ssrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254'];
  const url = req.body.url || req.query.url;

  if (url) {
    try {
      const parsedUrl = new URL(url);
      if (blockedHosts.includes(parsedUrl.hostname)) {
        SecurityEventLogger.logSecurityEvent('SSRF_ATTEMPT', { url, ip: req.ip }, 'high');
        return res.status(400).json({ error: 'Invalid URL target' });
      }
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
  }

  next();
};

// Data sanitization
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeObject = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;

    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove potentially dangerous characters
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      } else if (typeof obj[key] === 'object') {
        obj[key] = sanitizeObject(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);

  next();
};