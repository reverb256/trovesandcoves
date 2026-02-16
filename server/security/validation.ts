import { z } from 'zod';
import { body, query, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// AI Request Validation Schema (Zod-based for Canadian AI compliance)
export const AIRequestSchema = z.object({
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(2000, 'Prompt must not exceed 2000 characters')
    .refine(text => !containsHarmfulContent(text), 'Content violates safety guidelines'),
  type: z.enum(['text', 'image', 'audio']).default('text'),
  maxTokens: z.number().min(1).max(2000).optional().default(500),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  userId: z.string().optional(),
  sessionId: z.string().optional()
});

// Canadian AI Compliance - Content Safety Check
function containsHarmfulContent(text: string): boolean {
  const prohibitedPatterns = [
    /\b(hate|violence|discrimination)\b/i,
    /\b(personal\s+information|private\s+data)\b/i,
    /\b(medical\s+advice|legal\s+advice)\b/i,
    /\b(illegal\s+activities|harmful\s+instructions)\b/i
  ];
  
  return prohibitedPatterns.some(pattern => pattern.test(text));
}

// User Data Validation
export const UserRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, 'Username contains invalid characters'),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain uppercase, lowercase, number and special character'),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/, 'Invalid Canadian phone number').optional(),
  consentToDataProcessing: z.boolean().refine(val => val === true, 'Consent to data processing is required'),
  consentToMarketing: z.boolean().optional().default(false)
});

// Express Validators
export const validateAIRequest = [
  body('prompt').isLength({ min: 1, max: 2000 }).withMessage('Prompt must be 1-2000 characters'),
  body('type').isIn(['text', 'image', 'audio']).optional(),
  body('maxTokens').isInt({ min: 1, max: 2000 }).optional(),
  body('temperature').isFloat({ min: 0, max: 2 }).optional(),
  body('priority').isIn(['low', 'medium', 'high']).optional()
];

// Validation Error Handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg,
        value: error.type === 'field' ? error.value : undefined
      }))
    });
  }
  next();
};

// Rate Limiting Configuration
export const rateLimitConfig = {
  ai: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per window
    message: 'Too many AI requests, please try again later'
  },
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests, please try again later'
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 auth attempts per window
    message: 'Too many authentication attempts, please try again later'
  }
};

// Data Sanitization
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return input;
};

export type AIRequestType = z.infer<typeof AIRequestSchema>;