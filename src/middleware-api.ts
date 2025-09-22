import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting for Edge Runtime compatibility
// Note: This is a basic implementation. For production, consider using Vercel KV or Redis
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMITS = {
  'api-auth': { maxRequests: 10, windowMs: 60000 }, // 10 per minute for auth
  'api-global': { maxRequests: 30, windowMs: 60000 }, // 30 per minute global
  'api-public-read': { maxRequests: 50, windowMs: 60000 }, // 50 per minute for reads
};

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;

  return 'unknown';
}

function checkSimpleRateLimit(clientIP: string, limitType: keyof typeof RATE_LIMITS): boolean {
  const now = Date.now();
  const key = `${clientIP}:${limitType}`;
  const limit = RATE_LIMITS[limitType];

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + limit.windowMs
    });
    return true;
  }

  if (entry.count >= limit.maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

// Define endpoint patterns and their rate limit categories
const API_RATE_LIMIT_RULES = [
  // Auth endpoints - strictest limits
  { pattern: /^\/api\/auth\//, category: 'api-auth' as const },
  // Admin operations - skip rate limiting
  { pattern: /^\/api\/admin\//, category: null },
  // Public read operations
  { pattern: /^\/api\/events$/, category: 'api-public-read' as const },
  { pattern: /^\/api\/posts$/, category: 'api-public-read' as const },
  { pattern: /^\/api\/events\/[^\/]+$/, category: 'api-public-read' as const },
  { pattern: /^\/api\/posts\/[^\/]+$/, category: 'api-public-read' as const },
  // Everything else gets global API limit
  { pattern: /^\/api\//, category: 'api-global' as const },
];

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
  let rateLimitCategory: keyof typeof RATE_LIMITS | null = null;
  for (const rule of API_RATE_LIMIT_RULES) {
    if (rule.pattern.test(path)) {
      rateLimitCategory = rule.category;
      break;
    }
  }

  // If no category matched or category is null (skip), allow the request
  if (!rateLimitCategory) {
    return NextResponse.next();
  }

  const clientIP = getClientIP(request);
  const isAllowed = checkSimpleRateLimit(clientIP, rateLimitCategory);

  if (!isAllowed) {
    return NextResponse.json({
      success: false,
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.'
    }, {
      status: 429,
      headers: {
        'Retry-After': '60',
      }
    });
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all API routes
     */
    '/api/:path*',
  ],
};
