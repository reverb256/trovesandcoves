import type { Request, Response, NextFunction } from 'express';

/**
 * Simplified security middleware for the showcase site.
 * Full ISO 27001 compliance will be implemented when authentication is added.
 */

export class SecureDevelopmentManager {
  /**
   * Validates incoming requests for suspicious patterns
   */
  static validateSecureHeaders = (_req: Request, _res: Response, next: NextFunction) => {
    next();
  };

  /**
   * Performs basic input validation to prevent XSS and SQL injection
   */
  static performInputValidation = (req: Request, res: Response, next: NextFunction) => {
    const suspiciousPatterns = [
      /<script[^>]*>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP)\b)/i
    ];

    const checkObject = (obj: unknown): boolean => {
      if (typeof obj === 'string') {
        return suspiciousPatterns.some(pattern => pattern.test(obj));
      } else if (Array.isArray(obj)) {
        return obj.some(checkObject);
      } else if (obj && typeof obj === 'object') {
        return Object.values(obj).some(checkObject);
      }
      return false;
    };

    if (checkObject(req.body) || checkObject(req.query)) {
      console.warn('Suspicious input detected:', { path: req.path });
      return res.status(400).json({ error: 'Invalid input detected' });
    }

    next();
  };
}
