import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Common validation patterns
export const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  mongoId: /^[0-9a-fA-F]{24}$/,
};

// Security-focused validation schemas
export const SecuritySchemas = {
  // User input that will be displayed (XSS prevention)
  safeText: z.string()
    .min(1, 'Text cannot be empty')
    .max(1000, 'Text too long')
    .refine((val) => !/<script|javascript:|data:/i.test(val), 'Invalid content detected'),

  // HTML content that needs sanitization
  htmlContent: z.string()
    .min(1, 'Content cannot be empty')
    .max(10000, 'Content too long')
    .transform((val) => DOMPurify.sanitize(val)),

  // Email with additional security checks
  secureEmail: z.string()
    .email('Invalid email format')
    .min(5, 'Email too short')
    .max(254, 'Email too long')
    .refine((val) => !val.includes('..'), 'Invalid email format')
    .refine((val) => !val.startsWith('.') && !val.endsWith('.'), 'Invalid email format'),

  // Password with strength requirements
  strongPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .refine((val) => ValidationPatterns.strongPassword.test(val), 
      'Password must contain uppercase, lowercase, number, and special character'),

  // URL with security checks
  secureUrl: z.string()
    .url('Invalid URL format')
    .refine((val) => ValidationPatterns.url.test(val), 'Invalid URL format')
    .refine((val) => !val.includes('javascript:'), 'Invalid URL scheme')
    .refine((val) => !val.includes('data:'), 'Invalid URL scheme'),

  // File upload validation
  fileName: z.string()
    .min(1, 'Filename cannot be empty')
    .max(255, 'Filename too long')
    .refine((val) => !/[<>:"/\\|?*]/.test(val), 'Invalid characters in filename')
    .refine((val) => !val.startsWith('.'), 'Filename cannot start with dot')
    .refine((val) => !/\.(exe|bat|cmd|scr|pif|com)$/i.test(val), 'File type not allowed'),

  // Search query with injection prevention
  searchQuery: z.string()
    .min(1, 'Search query cannot be empty')
    .max(100, 'Search query too long')
    .refine((val) => !/<|>|'|"|;|\||&/.test(val), 'Invalid characters in search query'),
};

// Question-specific validation
export const QuestionSchemas = {
  questionText: z.string()
    .min(10, 'Question must be at least 10 characters')
    .max(2000, 'Question too long')
    .refine((val) => val.trim().length > 0, 'Question cannot be empty')
    .refine((val) => !/<script|javascript:|data:/i.test(val), 'Invalid content detected'),

  answerText: z.string()
    .min(10, 'Answer must be at least 10 characters')
    .max(5000, 'Answer too long')
    .refine((val) => val.trim().length > 0, 'Answer cannot be empty')
    .refine((val) => !/<script|javascript:|data:/i.test(val), 'Invalid content detected'),

  category: z.string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category too long')
    .refine((val) => ValidationPatterns.alphanumeric.test(val.replace(/\s/g, '')), 
      'Category can only contain letters, numbers, and spaces'),

};

// Admin-specific validation
export const AdminSchemas = {
  adminAction: z.enum(['approve', 'reject', 'edit', 'delete', 'feature']),
  
  adminNote: z.string()
    .max(500, 'Note too long')
    .optional()
    .refine((val) => !val || !/<script|javascript:|data:/i.test(val), 'Invalid content detected'),

  batchOperation: z.object({
    action: z.enum(['approve', 'reject', 'delete']),
    questionIds: z.array(z.string().regex(ValidationPatterns.mongoId, 'Invalid question ID'))
      .min(1, 'At least one question must be selected')
      .max(50, 'Too many questions selected'),
  }),
};

// Sanitization utilities
export class InputSanitizer {
  /**
   * Sanitize HTML content
   */
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'blockquote'],
      ALLOWED_ATTR: [],
    });
  }

  /**
   * Sanitize plain text (remove HTML and dangerous characters)
   */
  static sanitizeText(input: string): string {
    return input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>'"&]/g, '') // Remove dangerous characters
      .trim();
  }

  /**
   * Sanitize search query
   */
  static sanitizeSearchQuery(input: string): string {
    return input
      .replace(/[<>'";&|]/g, '') // Remove injection characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .slice(0, 100); // Limit length
  }

  /**
   * Sanitize filename
   */
  static sanitizeFilename(input: string): string {
    return input
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
      .replace(/^\.+/, '') // Remove leading dots
      .trim()
      .slice(0, 255); // Limit length
  }
}

// Rate limiting validation
export const RateLimitSchemas = {
  apiRequest: z.object({
    endpoint: z.string().min(1),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    ip: z.string().min(1),
    userAgent: z.string().optional(),
  }),
};

// Security event validation
export const SecurityEventSchema = z.object({
  type: z.enum(['AUTH_FAILURE', 'RATE_LIMIT_EXCEEDED', 'INVALID_INPUT', 'UNAUTHORIZED_ACCESS', 'SYSTEM_ERROR']),
  message: z.string().min(1).max(500),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Validation helper functions
export class ValidationHelpers {
  /**
   * Validate and sanitize user input
   */
  static validateUserInput<T>(schema: z.ZodSchema<T>, input: unknown): { 
    success: boolean; 
    data?: T; 
    errors?: string[];
  } {
    try {
      const data = schema.parse(input);
      return { success: true, data };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = (error as z.ZodError).issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`);
        return { success: false, errors };
      }
      return { success: false, errors: ['Validation failed'] };
    }
  }

  /**
   * Check if string contains potentially dangerous content
   */
  static containsDangerousContent(input: string): boolean {
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /on\w+=/i, // Event handlers like onclick=
      /expression\(/i, // CSS expressions
      /import\s+/i, // ES6 imports
      /eval\(/i,
      /Function\(/i,
    ];

    return dangerousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Validate file upload
   */
  static validateFileUpload(file: File, allowedTypes: string[], maxSize: number): {
    valid: boolean;
    error?: string;
  } {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }

    // Check file size
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large' };
    }

    // Check filename
    const sanitizedName = InputSanitizer.sanitizeFilename(file.name);
    if (sanitizedName !== file.name) {
      return { valid: false, error: 'Invalid filename' };
    }

    return { valid: true };
  }

  /**
   * Generate safe slug from text
   */
  static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove duplicate hyphens
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .slice(0, 50); // Limit length
  }
}
