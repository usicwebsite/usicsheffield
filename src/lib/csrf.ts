import { NextRequest, NextResponse } from 'next/server';

// CSRF token configuration
const CSRF_CONFIG = {
  TOKEN_LENGTH: 32,
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  COOKIE_NAME: 'csrf_token',
  HEADER_NAME: 'X-CSRF-Token'
} as const;

// CSRF token interface
export interface CSRFToken {
  token: string;
  expiresAt: number;
}

/**
 * Generate a new CSRF token
 */
export function generateCSRFToken(): string {
  // Use Web Crypto API instead of Node.js crypto
  const array = new Uint8Array(CSRF_CONFIG.TOKEN_LENGTH);
  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a CSRF token with expiration
 */
export function createCSRFToken(): CSRFToken {
  return {
    token: generateCSRFToken(),
    expiresAt: Date.now() + CSRF_CONFIG.TOKEN_EXPIRY
  };
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) {
    return false;
  }
  
  // Use timing-safe comparison to prevent timing attacks
  if (token.length !== storedToken.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Extract CSRF token from request
 */
export function extractCSRFToken(request: NextRequest): string | null {
  // Check header first
  const headerToken = request.headers.get(CSRF_CONFIG.HEADER_NAME);
  if (headerToken) {
    return headerToken;
  }
  
  // Note: formData() is async, so we can't use it in this sync function
  // CSRF tokens should be sent via headers for API routes
  
  return null;
}

/**
 * Get CSRF token from cookies
 */
export function getCSRFTokenFromCookies(request: NextRequest): string | null {
  const cookie = request.cookies.get(CSRF_CONFIG.COOKIE_NAME);
  return cookie?.value || null;
}

/**
 * Set CSRF token in response cookies
 */
export function setCSRFTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_CONFIG.COOKIE_NAME, token, {
    httpOnly: false, // Must be false so client-side JavaScript can access it
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: CSRF_CONFIG.TOKEN_EXPIRY / 1000,
    path: '/'
  });
}

/**
 * CSRF middleware for protecting state-changing operations
 */
export function withCSRFProtection(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Only apply CSRF protection to state-changing methods
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      const requestToken = extractCSRFToken(request);
      const storedToken = getCSRFTokenFromCookies(request);
      
      if (!requestToken || !storedToken) {
        return NextResponse.json(
          { error: 'CSRF token missing' },
          { status: 403 }
        );
      }
      
      if (!validateCSRFToken(requestToken, storedToken)) {
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        );
      }
    }
    
    return handler(request);
  };
}

/**
 * Generate and set CSRF token for forms
 */
export function generateAndSetCSRFToken(): NextResponse {
  const csrfToken = generateCSRFToken();
  const response = NextResponse.next();
  
  setCSRFTokenCookie(response, csrfToken);
  
  return response;
}

/**
 * CSRF token validation for API routes
 */
export function validateCSRFTokenForAPI(request: NextRequest): boolean {
  const requestToken = extractCSRFToken(request);
  const storedToken = getCSRFTokenFromCookies(request);
  
  if (!requestToken || !storedToken) {
    return false;
  }
  
  return validateCSRFToken(requestToken, storedToken);
}

/**
 * Client-side CSRF token helper
 */
export function getCSRFTokenForClient(): string | null {
  if (typeof document === 'undefined') {
    console.log('[CSRF] Document not available (server-side)');
    return null;
  }
  
  // First, try to get from cookie (most reliable, set by middleware)
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrf_token='));
  if (csrfCookie) {
    const token = csrfCookie.split('=')[1];
    console.log('[CSRF] Token found in cookie');
    return token;
  }
  
  // Fallback: try to get from global window variable
  if (typeof window !== 'undefined') {
    const globalToken = (window as { __CSRF_TOKEN__?: string }).__CSRF_TOKEN__;
    if (globalToken) {
      console.log('[CSRF] Token found in window variable');
      return globalToken;
    }
  }
  
  // Last resort: get token from meta tag (set by server)
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  const token = metaTag?.getAttribute('content');
  
  if (token && token.trim().length > 0) {
    console.log('[CSRF] Token found in meta tag');
    return token;
  }
  
  console.log('[CSRF] No token found in any source');
  return null;
}

/**
 * Add CSRF token to fetch requests
 */
export function addCSRFTokenToRequest(init: RequestInit = {}): RequestInit {
  const token = getCSRFTokenForClient();
  
  if (token) {
    return {
      ...init,
      headers: {
        ...init.headers,
        'X-CSRF-Token': token
      }
    };
  }
  
  return init;
}
