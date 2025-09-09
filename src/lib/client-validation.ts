import { z } from 'zod';
import React from 'react';

// Client-side validation schemas
export const ClientValidationSchemas = {
  // Post form validation
  postForm: z.object({
    title: z.string()
      .min(5, 'Title must be at least 5 characters')
      .max(200, 'Title must be less than 200 characters')
      .refine((val) => val.trim().length > 0, 'Title cannot be empty'),
    content: z.string()
      .min(10, 'Content must be at least 10 characters')
      .max(10000, 'Content must be less than 10,000 characters')
      .refine((val) => val.trim().length > 0, 'Content cannot be empty'),
    category: z.string()
      .min(2, 'Category must be at least 2 characters')
      .max(50, 'Category must be less than 50 characters'),
    author: z.string()
      .min(1, 'Author name is required')
      .max(100, 'Author name must be less than 100 characters')
      .optional(),
    authorId: z.string()
      .min(1, 'Author ID is required')
      .optional()
  }),

  // Search query validation
  searchQuery: z.string()
    .min(1, 'Search query cannot be empty')
    .max(100, 'Search query too long')
    .refine((val) => !/<|>|'|"|;|\||&/.test(val), 'Invalid characters in search query'),

  // Contact form validation
  contactForm: z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters')
      .refine((val) => /^[a-zA-Z\s]+$/.test(val), 'Name can only contain letters and spaces'),
    email: z.string()
      .email('Invalid email format')
      .min(5, 'Email too short')
      .max(254, 'Email too long'),
    message: z.string()
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message must be less than 1000 characters')
  }),

  // Login form validation
  loginForm: z.object({
    email: z.string()
      .email('Invalid email format')
      .min(5, 'Email too short')
      .max(254, 'Email too long'),
    password: z.string()
      .min(1, 'Password is required')
      .max(128, 'Password too long')
  }),

  // Profile form validation
  profileForm: z.object({
    displayName: z.string()
      .min(2, 'Display name must be at least 2 characters')
      .max(50, 'Display name must be less than 50 characters')
      .optional(),
    email: z.string()
      .email('Invalid email format')
      .min(5, 'Email too short')
      .max(254, 'Email too long')
  })
};

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  fieldErrors: Record<string, string>;
}

// Client-side validation helper class
export class ClientValidator {
  /**
   * Validate form data against a schema
   */
  static validateForm<T>(
    schema: z.ZodSchema<T>,
    data: Record<string, unknown>
  ): ValidationResult {
    try {
      schema.parse(data);
      return {
        isValid: true,
        errors: {},
        fieldErrors: {}
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string[]> = {};
        const fieldErrors: Record<string, string> = {};

        error.issues.forEach((issue) => {
          const field = issue.path.join('.');
          const message = issue.message;

          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(message);
          fieldErrors[field] = message;
        });

        return {
          isValid: false,
          errors,
          fieldErrors
        };
      }

      return {
        isValid: false,
        errors: { general: ['Validation failed'] },
        fieldErrors: { general: 'Validation failed' }
      };
    }
  }

  /**
   * Validate a single field
   */
  static validateField<T>(
    schema: z.ZodSchema<T>,
    fieldName: string,
    value: unknown
  ): { isValid: boolean; error?: string } {
    try {
      schema.parse(value);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find(issue => 
          issue.path.join('.') === fieldName
        );
        return {
          isValid: false,
          error: fieldError?.message || 'Invalid value'
        };
      }
      return { isValid: false, error: 'Validation failed' };
    }
  }

  /**
   * Real-time field validation
   */
  static validateFieldRealTime<T>(
    schema: z.ZodSchema<T>,
    fieldName: string,
    value: unknown,
    debounceMs: number = 300
  ): Promise<{ isValid: boolean; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this.validateField(schema, fieldName, value);
        resolve(result);
      }, debounceMs);
    });
  }

  /**
   * Sanitize user input for display
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>'"&]/g, '') // Remove dangerous characters
      .trim();
  }

  /**
   * Format validation errors for display
   */
  static formatErrors(errors: Record<string, string[]>): string[] {
    return Object.values(errors).flat();
  }
}

// React hook for form validation
export function useFormValidation<T>(
  schema: z.ZodSchema<T>,
  initialData: Record<string, unknown> = {}
) {
  const [data, setData] = React.useState(initialData);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [isValid, setIsValid] = React.useState(false);

  const validate = React.useCallback(() => {
    const result = ClientValidator.validateForm(schema, data);
    setErrors(result.errors);
    setFieldErrors(result.fieldErrors);
    setIsValid(result.isValid);
    return result.isValid;
  }, [schema, data]);

  const updateField = React.useCallback((field: string, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateField = React.useCallback((field: string, value: unknown) => {
    const result = ClientValidator.validateField(schema, field, value);
    if (!result.isValid) {
      setFieldErrors(prev => ({ ...prev, [field]: result.error! }));
    } else {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    return result.isValid;
  }, [schema]);

  React.useEffect(() => {
    validate();
  }, [validate]);

  return {
    data,
    errors,
    fieldErrors,
    isValid,
    updateField,
    validateField,
    validate,
    formatErrors: () => ClientValidator.formatErrors(errors)
  };
}
