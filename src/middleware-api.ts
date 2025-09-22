import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

// Define endpoint patterns and their rate limit categories
const API_RATE_LIMIT_RULES = [
  // Auth endpoints - strictest limits
  { pattern: /^\/api\/auth\//, category: 'api-auth' as const },

  // Admin operations - allow existing admin-specific logic to handle
  { pattern: /^\/api\/admin\//, category: null }, // Skip global rate limiting for admin routes

  // Public read operations
  { pattern: /^\/api\/events$/, category: 'api-public-read' as const },
  { pattern: /^\/api\/posts$/, category: 'api-public-read' as const },
  { pattern: /^\/api\/events\/[^\/]+$/, category: 'api-public-read' as const },
  { pattern: /^\/api\/posts\/[^\/]+$/, category: 'api-public-read' as const },

  // Everything else gets global API limit
  { pattern: /^\/api\//, category: 'api-global' as const },
];

/**
 * Check if user is authenticated by looking for session cookie
 */
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie?.value) {
      return false;
    }

    const sessionData = JSON.parse(sessionCookie.value);
    return !!(sessionData?.uid && sessionData?.email);
  } catch {
    return false;
  }
}

/**
 * Check if user is admin
 */
async function isAdmin(request: NextRequest): Promise<boolean> {
  try {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie?.value) {
      return false;
    }

    const sessionData = JSON.parse(sessionCookie.value);
    if (!sessionData?.uid) {
      return false;
    }

    // Import admin check dynamically to avoid circular dependencies
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');
    const db = getFirestore();
    const adminDocRef = doc(db, 'admins', sessionData.uid);
    const adminDocSnap = await getDoc(adminDocRef);
    return adminDocSnap.exists();
  } catch (error) {
    console.warn('[API Middleware] Error checking admin status:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only process API routes
  if (!path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip rate limiting for health checks and admin rate limit clearing
  if (path === '/api/admin/security/clear-rate-limit') {
    return NextResponse.next();
  }

  // Find the matching rate limit rule
  let rateLimitCategory: typeof API_RATE_LIMIT_RULES[0]['category'] = null;
  for (const rule of API_RATE_LIMIT_RULES) {
    if (rule.pattern.test(path)) {
      rateLimitCategory = rule.category;
      break;
    }
  }

  // If no category matched, allow the request (shouldn't happen with our catch-all rule)
  if (!rateLimitCategory) {
    return NextResponse.next();
  }

  // Check authentication status for potential user-specific limits
  const authenticated = await isAuthenticated(request);
  // const admin = authenticated ? await isAdmin(request) : false; // Reserved for future admin-specific limits

  // For now, apply the same limits regardless of auth status
  // This can be extended later if needed
  const rateLimitResult = checkRateLimit(request, rateLimitCategory);

  if (!rateLimitResult.success) {
    // Return rate limit exceeded response
    const response = NextResponse.json({
      success: false,
      error: 'Rate limit exceeded',
      message: `Too many requests. Please try again later.`,
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

    return response;
  }

  // Allow the request to proceed
  const response = NextResponse.next();

  // Add rate limit headers to successful responses
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
  response.headers.set('X-RateLimit-Remaining', (rateLimitResult.remaining - 1).toString());
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toISOString());

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all API routes
     */
    '/api/:path*',
  ],
};
