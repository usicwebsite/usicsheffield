import { NextRequest } from 'next/server';

/**
 * Enhanced security check for HTTPS enforcement
 */
export function enforceHTTPS(request: NextRequest): boolean {
  // In production, always require HTTPS
  if (process.env.NODE_ENV === 'production') {
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    return protocol === 'https';
  }

  // In development, allow HTTP unless FORCE_HTTPS is set
  if (process.env.FORCE_HTTPS === 'true') {
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    return protocol === 'https';
  }

  return true;
}

/**
 * Validate request security
 */
export function validateRequestSecurity(request: NextRequest): { valid: boolean; error?: string } {
  // Check HTTPS enforcement
  if (!enforceHTTPS(request)) {
    return { valid: false, error: 'HTTPS required' };
  }

  // Check for suspicious headers
  const suspiciousHeaders = [
    'x-forwarded-host',
    'x-real-ip',
    'x-forwarded-for'
  ];

  for (const header of suspiciousHeaders) {
    const value = request.headers.get(header);
    if (value && value.includes('javascript:')) {
      return { valid: false, error: 'Suspicious header content' };
    }
  }

  return { valid: true };
} 