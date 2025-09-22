import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateCSRFToken, setCSRFTokenCookie } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rateLimit';

// Security headers configuration
const securityHeaders: Record<string, string> = {
  // Content Security Policy - Restrict resource loading
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com https://accounts.google.com https://www.gstatic.com https://www.google.com https://*.googleapis.com https://*.firebaseapp.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https: blob:",
    "connect-src 'self' https://firebase.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebaseinstallations.googleapis.com https://accounts.google.com https://oauth2.googleapis.com wss://firestore.googleapis.com wss://*.googleapis.com",
    "frame-src https://accounts.google.com https://*.firebaseapp.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy - restrict browser features
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
  
  // XSS protection (legacy but still useful)
  'X-XSS-Protection': '1; mode=block',
  
  // Cross-Origin-Opener-Policy - Allow popups for authentication (temporarily disabled for Firebase Auth)
  // 'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',

  // Cross-Origin-Embedder-Policy - Required for some COOP policies (temporarily disabled for Firebase Auth)
  // 'Cross-Origin-Embedder-Policy': 'unsafe-none',
  
  // Prevent caching of sensitive pages
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store'
};

// Pages that should not be cached
const noCachePaths = [
  '/admin',
  '/admin-dashboard', 
  '/my-profile',
  '/auth/sign-in',
  '/auth/sign-up'
];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin, /admin/dashboard)
  const path = request.nextUrl.pathname;

  // Handle image rate limiting for Next.js image optimization and static images
  if (path.startsWith('/_next/image') || path.startsWith('/images/')) {
    const rateLimitResult = checkRateLimit(request, 'images');

    if (!rateLimitResult.success) {
      return NextResponse.json({
        error: 'Rate limit exceeded',
        message: 'Too many image requests. Please try again later.',
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime,
        retryAfter: rateLimitResult.retryAfter
      }, {
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toISOString(),
        }
      });
    }
  }

  // Create response object - admin authentication is now handled client-side
  const response = NextResponse.next();

  // Set CSRF token as cookie for all pages to ensure it's available for API validation
  const csrfToken = generateCSRFToken();
  setCSRFTokenCookie(response, csrfToken);

  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Apply no-cache headers to sensitive pages
  if (noCachePaths.some(noCachePath => path.startsWith(noCachePath))) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // Add HSTS header for HTTPS (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled by middleware-api.ts)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     * - public folder files (except /images/)
     *
     * But INCLUDE:
     * - _next/image (for rate limiting)
     * - images/ (for rate limiting)
     */
    '/((?!api|_next/static|favicon.ico|public(?!/images)).*)',
  ],
} 