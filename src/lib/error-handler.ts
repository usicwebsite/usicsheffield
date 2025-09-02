import { NextResponse } from 'next/server';
import { SecurityEventSchema } from './input-validation';

// Error types for better categorization
export enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  RATE_LIMIT = 'RATE_LIMIT',
  NETWORK = 'NETWORK',
  DATABASE = 'DATABASE',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Structured error interface
export interface StructuredError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  requestId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
}

// Enhanced error logging
export function logStructuredError(error: StructuredError): void {
  try {
    // Log to console with structured format
    console.error('[STRUCTURED ERROR]', {
      type: error.type,
      severity: error.severity,
      message: error.message,
      code: error.code,
      timestamp: error.timestamp.toISOString(),
      requestId: error.requestId,
      userId: error.userId,
      ip: error.ip,
      userAgent: error.userAgent,
      details: error.details
    });

    // Log security events separately
    if (error.type === ErrorType.SECURITY || error.severity === ErrorSeverity.HIGH || error.severity === ErrorSeverity.CRITICAL) {
      const securityEvent = {
        type: 'SYSTEM_ERROR',
        message: error.message,
        ip: error.ip,
        userAgent: error.userAgent,
        severity: error.severity,
        metadata: {
          errorType: error.type,
          code: error.code,
          requestId: error.requestId,
          userId: error.userId,
          details: error.details
        }
      };

      try {
        SecurityEventSchema.parse(securityEvent);
        console.log('[SECURITY EVENT]', securityEvent);
      } catch (parseError) {
        console.error('[SECURITY EVENT] Invalid event format:', parseError);
      }
    }
  } catch (logError) {
    console.error('Failed to log structured error:', logError);
  }
}

// Security event logging function
export function logSecurityEvent(event: unknown) {
  try {
    const validatedEvent = SecurityEventSchema.parse(event);
    console.log('[SECURITY EVENT]', validatedEvent);
  } catch (error) {
    console.error('[SECURITY EVENT] Invalid event format:', error);
  }
}

// Firebase auth error mapping
const FIREBASE_AUTH_ERRORS = {
  'auth/user-not-found': 'User account not found',
  'auth/wrong-password': 'Incorrect password',
  'auth/invalid-email': 'Invalid email address',
  'auth/user-disabled': 'User account is disabled',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later',
  'auth/network-request-failed': 'Network error. Please check your connection',
  'auth/operation-not-allowed': 'This operation is not allowed',
  'auth/invalid-credential': 'Invalid credentials',
  'auth/account-exists-with-different-credential': 'An account already exists with this email',
  'auth/requires-recent-login': 'Please log in again to continue',
  'auth/weak-password': 'Password is too weak',
  'auth/email-already-in-use': 'Email is already registered',
  'auth/invalid-verification-code': 'Invalid verification code',
  'auth/invalid-verification-id': 'Invalid verification ID',
  'auth/quota-exceeded': 'Service temporarily unavailable',
  'auth/credential-already-in-use': 'This credential is already in use',
  'auth/timeout': 'Request timed out',
  'auth/cancelled-popup-request': 'Authentication was cancelled',
  'auth/popup-closed-by-user': 'Authentication popup was closed',
  'auth/popup-blocked': 'Authentication popup was blocked',
  'auth/unauthorized-domain': 'This domain is not authorized',
  'auth/operation-not-supported-in-this-environment': 'This operation is not supported',
  'auth/configuration-not-found': 'Configuration not found',
  'auth/unsupported-persistence-type': 'Unsupported persistence type',
  'auth/redirect-cancelled-by-user': 'Redirect was cancelled by user',
  'auth/redirect-operation-pending': 'Redirect operation is pending',
  'auth/rejected-credential': 'Credential was rejected',
  'auth/null-user': 'User is null',
  'auth/no-auth-event': 'No auth event',
  'auth/argument-error': 'Invalid argument provided',
  'auth/invalid-api-key': 'Invalid API key',
  'auth/invalid-user-token': 'Invalid user token',
  'auth/invalid-tenant-id': 'Invalid tenant ID',
  'auth/unsupported-tenant-operation': 'Unsupported tenant operation',
  'auth/invalid-dynamic-link-domain': 'Invalid dynamic link domain',
  'auth/duplicate-credential': 'Duplicate credential',
  'auth/email-change-needs-verification': 'Email change requires verification',
  'auth/invalid-recipient-email': 'Invalid recipient email',
  'auth/missing-ios-bundle-id': 'Missing iOS bundle ID',
  'auth/missing-android-pkg-name': 'Missing Android package name',
  'auth/unauthorized-continue-uri': 'Unauthorized continue URI',
  'auth/invalid-continue-uri': 'Invalid continue URI',
  'auth/missing-continue-uri': 'Missing continue URI'
};

// Enhanced auth error handler
export function handleAuthError(error: unknown, context: string = 'AUTH_ERROR'): NextResponse {
  const errorCode = error && typeof error === 'object' && 'code' in error ? String(error.code) : 'unknown';
  const errorMessage = FIREBASE_AUTH_ERRORS[errorCode as keyof typeof FIREBASE_AUTH_ERRORS] || 
    (error instanceof Error ? error.message : 'Authentication failed');
  
  // Determine error type and severity
  let errorType = ErrorType.AUTHENTICATION;
  let severity = ErrorSeverity.MEDIUM;
  
  if (errorCode.includes('too-many-requests') || errorCode.includes('quota-exceeded')) {
    errorType = ErrorType.RATE_LIMIT;
    severity = ErrorSeverity.HIGH;
  } else if (errorCode.includes('network') || errorCode.includes('timeout')) {
    errorType = ErrorType.NETWORK;
    severity = ErrorSeverity.MEDIUM;
  } else if (errorCode.includes('invalid') || errorCode.includes('wrong-password')) {
    errorType = ErrorType.VALIDATION;
    severity = ErrorSeverity.LOW;
  } else if (errorCode.includes('unauthorized') || errorCode.includes('disabled')) {
    errorType = ErrorType.AUTHORIZATION;
    severity = ErrorSeverity.HIGH;
  }
  
  // Log the error
  logStructuredError({
    type: errorType,
    severity,
    message: errorMessage,
    code: errorCode,
    details: {
      context,
      originalError: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    },
    timestamp: new Date()
  });
  
  // Return appropriate response
  const statusCode = severity === ErrorSeverity.HIGH ? 403 : 
                    errorType === ErrorType.RATE_LIMIT ? 429 : 400;
  
  return NextResponse.json(
    { 
      success: false,
      error: errorMessage,
      code: errorCode
    },
    { status: statusCode }
  );
}

// General error handler
export function handleGeneralError(error: unknown, context: string = 'GENERAL_ERROR'): NextResponse {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  
  // Determine error type and severity
  let errorType = ErrorType.SYSTEM;
  let severity = ErrorSeverity.MEDIUM;
  
  if (error && typeof error === 'object' && 'name' in error) {
    const errorName = String(error.name);
    if (errorName === 'ValidationError') {
      errorType = ErrorType.VALIDATION;
      severity = ErrorSeverity.LOW;
    } else if (errorName === 'NetworkError') {
      errorType = ErrorType.NETWORK;
      severity = ErrorSeverity.MEDIUM;
    } else if (errorName === 'DatabaseError') {
      errorType = ErrorType.DATABASE;
      severity = ErrorSeverity.HIGH;
    } else if (errorName === 'SecurityError') {
      errorType = ErrorType.SECURITY;
      severity = ErrorSeverity.HIGH;
    }
  }
  
  // Log the error
  logStructuredError({
    type: errorType,
    severity,
    message: errorMessage,
    details: {
      context,
      originalError: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error && typeof error === 'object' && 'name' in error ? String(error.name) : undefined
    },
    timestamp: new Date()
  });
  
  // Return appropriate response
  const statusCode = severity === ErrorSeverity.HIGH ? 500 : 
                    severity === ErrorSeverity.MEDIUM ? 400 : 400;
  
  return NextResponse.json(
    { 
      success: false,
      error: errorMessage
    },
    { status: statusCode }
  );
}

// Validation error handler
export function handleValidationError(errors: unknown[], context: string = 'VALIDATION_ERROR'): NextResponse {
  const errorMessage = 'Validation failed';
  
  // Log the error
  logStructuredError({
    type: ErrorType.VALIDATION,
    severity: ErrorSeverity.LOW,
    message: errorMessage,
    details: {
      context,
      validationErrors: errors
    },
    timestamp: new Date()
  });
  
  return NextResponse.json(
    { 
      success: false,
      error: errorMessage,
      validationErrors: errors
    },
    { status: 400 }
  );
}

// Rate limit error handler
export function handleRateLimitError(retryAfter: number, context: string = 'RATE_LIMIT_ERROR'): NextResponse {
  const errorMessage = `Rate limit exceeded. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`;
  
  // Log the error
  logStructuredError({
    type: ErrorType.RATE_LIMIT,
    severity: ErrorSeverity.MEDIUM,
    message: errorMessage,
    details: {
      context,
      retryAfter
    },
    timestamp: new Date()
  });
  
  return NextResponse.json(
    { 
      success: false,
      error: 'Rate limit exceeded',
      message: errorMessage,
      retryAfter
    },
    { 
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString()
      }
    }
  );
}

// Security error handler
export function handleSecurityError(message: string, context: string = 'SECURITY_ERROR'): NextResponse {
  // Log the error
  logStructuredError({
    type: ErrorType.SECURITY,
    severity: ErrorSeverity.HIGH,
    message,
    details: {
      context
    },
    timestamp: new Date()
  });
  
  return NextResponse.json(
    { 
      success: false,
      error: 'Security validation failed',
      message: 'Request blocked for security reasons'
    },
    { status: 403 }
  );
} 