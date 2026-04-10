import { z } from 'zod';

// AI Request Validation Schema (Zod-based for Canadian AI compliance)
// Note: AI features have been removed, but schemas kept for potential future use
export const AIRequestSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt is required')
    .max(2000, 'Prompt must not exceed 2000 characters')
    .refine(
      text => !containsHarmfulContent(text),
      'Content violates safety guidelines'
    ),
  type: z.enum(['text', 'image', 'audio']).default('text'),
  maxTokens: z.number().min(1).max(2000).optional().default(500),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
});

// Canadian AI Compliance - Content Safety Check
function containsHarmfulContent(text: string): boolean {
  const prohibitedPatterns = [
    /\b(hate|violence|discrimination)\b/i,
    /\b(personal\s+information|private\s+data)\b/i,
    /\b(medical\s+advice|legal\s+advice)\b/i,
    /\b(illegal\s+activities|harmful\s+instructions)\b/i,
  ];

  return prohibitedPatterns.some(pattern => pattern.test(text));
}

// User Data Validation Schema
export const UserRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username contains invalid characters'),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z
    .string()
    .regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/, 'Invalid Canadian phone number')
    .optional(),
  consentToDataProcessing: z
    .boolean()
    .refine(val => val === true, 'Consent to data processing is required'),
  consentToMarketing: z.boolean().optional().default(false),
});

// Data Sanitization
export const sanitizeInput = (input: unknown): unknown => {
  if (typeof input === 'string') {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return input;
};

export type AIRequestType = z.infer<typeof AIRequestSchema>;
export type UserRegistrationType = z.infer<typeof UserRegistrationSchema>;
