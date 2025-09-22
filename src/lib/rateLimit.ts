import { NextRequest } from 'next/server';

interface RateLimitEntry {
  requests: number[];
  lastCleanup: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Default configurations
const RATE_LIMIT_CONFIGS = {
  questions: {
    windowMs: parseInt(process.env.RATE_LIMIT_QUESTIONS_WINDOW_MS || '3600000'), // 1 hour
    maxRequests: parseInt(process.env.RATE_LIMIT_QUESTIONS_PER_HOUR || '3')
  },
  posts: {
    windowMs: parseInt(process.env.RATE_LIMIT_POSTS_WINDOW_MS || '3600000'), // 1 hour
    maxRequests: parseInt(process.env.RATE_LIMIT_POSTS_PER_HOUR || '1') // 1 post per hour
  },
  'posts-admin': {
    windowMs: parseInt(process.env.RATE_LIMIT_POSTS_ADMIN_WINDOW_MS || '3600000'), // 1 hour
    maxRequests: parseInt(process.env.RATE_LIMIT_POSTS_ADMIN_PER_HOUR || '10') // 10 posts per hour for admins
  },
  'auth-login': {
    windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_AUTH_ATTEMPTS || '20')
  },
  'auth-attempts': {
    windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_AUTH_ATTEMPTS || '20')
  },
  'auth-refresh': {
    windowMs: parseInt(process.env.RATE_LIMIT_REFRESH_WINDOW_MS || '300000'), // 5 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_REFRESH_ATTEMPTS || '30')
  },
  'admin-operations': {
    windowMs: parseInt(process.env.RATE_LIMIT_ADMIN_WINDOW_MS || '3600000'), // 1 hour
    maxRequests: parseInt(process.env.RATE_LIMIT_ADMIN_OPERATIONS || '50')
  },
  // New global API rate limiting categories
  'api-global': {
    windowMs: parseInt(process.env.RATE_LIMIT_API_GLOBAL_WINDOW_MS || '60000'), // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_API_GLOBAL_PER_MINUTE || '30')
  },
  'api-auth': {
    windowMs: parseInt(process.env.RATE_LIMIT_API_AUTH_WINDOW_MS || '60000'), // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_API_AUTH_PER_MINUTE || '10')
  },
  'api-public-read': {
    windowMs: parseInt(process.env.RATE_LIMIT_API_PUBLIC_READ_WINDOW_MS || '60000'), // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_API_PUBLIC_READ_PER_MINUTE || '50')
  },
  // Image rate limiting
  'images': {
    windowMs: parseInt(process.env.RATE_LIMIT_IMAGES_WINDOW_MS || '60000'), // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_IMAGES_PER_MINUTE || '100')
  }
};

// Cleanup interval (5 minutes)
const CLEANUP_INTERVAL_MS = parseInt(process.env.RATE_LIMIT_CLEANUP_INTERVAL_MS || '300000');

/**
 * Extract client IP address from request headers
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for IP address (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback for unknown IP
  return 'unknown';
}

/**
 * Clean up expired requests from the store
 */
function cleanupExpiredRequests(key: string, windowMs: number): void {
  const entry = rateLimitStore.get(key);
  if (!entry) return;
  
  const now = Date.now();
  const cutoff = now - windowMs;
  
  // Remove requests older than the window
  entry.requests = entry.requests.filter(timestamp => timestamp > cutoff);
  entry.lastCleanup = now;
  
  // Remove the entry entirely if no requests remain
  if (entry.requests.length === 0) {
    rateLimitStore.delete(key);
  }
}

/**
 * Periodic cleanup of all expired entries
 */
function performGlobalCleanup(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  for (const [key, entry] of rateLimitStore.entries()) {
    // Clean up entries that haven't been accessed recently
    if (now - entry.lastCleanup > CLEANUP_INTERVAL_MS) {
      // Extract window size from key (format: "ip:endpoint")
      const endpoint = key.split(':')[1];
      const config = RATE_LIMIT_CONFIGS[endpoint as keyof typeof RATE_LIMIT_CONFIGS];
      
      if (config) {
        cleanupExpiredRequests(key, config.windowMs);
      } else {
        // Unknown endpoint, remove entry
        keysToDelete.push(key);
      }
    }
  }
  
  // Remove unknown entries
  keysToDelete.forEach(key => rateLimitStore.delete(key));
}

// Set up periodic cleanup
let cleanupInterval: NodeJS.Timeout | null = null;
if (typeof window === 'undefined') { // Only run on server
  cleanupInterval = setInterval(performGlobalCleanup, CLEANUP_INTERVAL_MS);
}

/**
 * Check if a request should be rate limited for posts (with admin vs regular user differentiation)
 */
export async function checkPostRateLimit(
  request: NextRequest,
  userId?: string
): Promise<RateLimitResult> {
  // Check if user is admin (only if userId is provided)
  let isAdmin = false;
  if (userId) {
    try {
      // Import here to avoid circular dependencies
      const { getFirestore, doc, getDoc } = await import('firebase/firestore');
      const db = getFirestore();
      const adminDocRef = doc(db, 'admins', userId);
      const adminDocSnap = await getDoc(adminDocRef);
      isAdmin = adminDocSnap.exists();
    } catch (error) {
      console.error('Error checking admin status for rate limiting:', error);
      // Default to regular user if we can't check
      isAdmin = false;
    }
  }

  // Use appropriate rate limit configuration
  const endpoint = isAdmin ? 'posts-admin' : 'posts';
  const config = RATE_LIMIT_CONFIGS[endpoint];
  const clientIP = getClientIP(request);
  const key = `${clientIP}:${endpoint}`;
  const now = Date.now();

  // Clean up expired requests for this key
  cleanupExpiredRequests(key, config.windowMs);

  // Get or create entry
  let entry = rateLimitStore.get(key);
  if (!entry) {
    entry = {
      requests: [],
      lastCleanup: now
    };
    rateLimitStore.set(key, entry);
  }

  // Calculate remaining requests
  const remaining = Math.max(0, config.maxRequests - entry.requests.length);

  // Calculate reset time (when the oldest request expires)
  const oldestRequest = entry.requests[0];
  const resetTime = oldestRequest
    ? new Date(oldestRequest + config.windowMs)
    : new Date(now + config.windowMs);

  // Check if limit is exceeded
  if (entry.requests.length >= config.maxRequests) {
    const retryAfter = Math.ceil((oldestRequest + config.windowMs - now) / 1000);

    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime,
      retryAfter: Math.max(1, retryAfter)
    };
  }

  // Add current request timestamp
  entry.requests.push(now);
  entry.lastCleanup = now;

  return {
    success: true,
    limit: config.maxRequests,
    remaining: remaining - 1, // Subtract 1 for the current request
    resetTime
  };
}

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(
  request: NextRequest,
  endpoint: 'questions' | 'posts' | 'posts-admin' | 'auth-login' | 'auth-attempts' | 'auth-refresh' | 'admin-operations' | 'api-global' | 'api-auth' | 'api-public-read' | 'images'
): RateLimitResult {
  const config = RATE_LIMIT_CONFIGS[endpoint];
  const clientIP = getClientIP(request);
  const key = `${clientIP}:${endpoint}`;
  const now = Date.now();
  
  // Clean up expired requests for this key
  cleanupExpiredRequests(key, config.windowMs);
  
  // Get or create entry
  let entry = rateLimitStore.get(key);
  if (!entry) {
    entry = {
      requests: [],
      lastCleanup: now
    };
    rateLimitStore.set(key, entry);
  }
  
  // Calculate remaining requests
  const remaining = Math.max(0, config.maxRequests - entry.requests.length);
  
  // Calculate reset time (when the oldest request expires)
  const oldestRequest = entry.requests[0];
  const resetTime = oldestRequest 
    ? new Date(oldestRequest + config.windowMs)
    : new Date(now + config.windowMs);
  
  // Check if limit is exceeded
  if (entry.requests.length >= config.maxRequests) {
    const retryAfter = Math.ceil((oldestRequest + config.windowMs - now) / 1000);
    
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime,
      retryAfter: Math.max(1, retryAfter)
    };
  }
  
  // Add current request timestamp
  entry.requests.push(now);
  entry.lastCleanup = now;
  
  return {
    success: true,
    limit: config.maxRequests,
    remaining: remaining - 1, // Subtract 1 for the current request
    resetTime
  };
}

/**
 * Get current rate limit status without consuming a request
 */
export function getRateLimitStatus(
  request: NextRequest,
  endpoint: 'questions' | 'posts' | 'posts-admin' | 'auth-login' | 'auth-attempts' | 'auth-refresh' | 'admin-operations' | 'api-global' | 'api-auth' | 'api-public-read' | 'images'
): Omit<RateLimitResult, 'success'> {
  const config = RATE_LIMIT_CONFIGS[endpoint];
  const clientIP = getClientIP(request);
  const key = `${clientIP}:${endpoint}`;
  const now = Date.now();
  
  // Clean up expired requests for this key
  cleanupExpiredRequests(key, config.windowMs);
  
  const entry = rateLimitStore.get(key);
  const requestCount = entry?.requests.length || 0;
  const remaining = Math.max(0, config.maxRequests - requestCount);
  
  // Calculate reset time
  const oldestRequest = entry?.requests[0];
  const resetTime = oldestRequest 
    ? new Date(oldestRequest + config.windowMs)
    : new Date(now + config.windowMs);
  
  const result: Omit<RateLimitResult, 'success'> = {
    limit: config.maxRequests,
    remaining,
    resetTime
  };
  
  if (requestCount >= config.maxRequests && oldestRequest) {
    const retryAfter = Math.ceil((oldestRequest + config.windowMs - now) / 1000);
    result.retryAfter = Math.max(1, retryAfter);
  }
  
  return result;
}

/**
 * Clear rate limit for a specific IP and endpoint (for testing/admin use)
 */
export function clearRateLimit(clientIP: string, endpoint: 'questions' | 'posts' | 'posts-admin' | 'auth-login' | 'auth-attempts' | 'auth-refresh' | 'admin-operations' | 'api-global' | 'api-auth' | 'api-public-read' | 'images'): void {
  const key = `${clientIP}:${endpoint}`;
  rateLimitStore.delete(key);
}

/**
 * Get rate limit statistics (for monitoring)
 */
export function getRateLimitStats(): {
  totalEntries: number;
  totalRequests: number;
  endpoints: Record<string, number>;
} {
  let totalRequests = 0;
  const endpoints: Record<string, number> = {};
  
  for (const [key, entry] of rateLimitStore.entries()) {
    const endpoint = key.split(':')[1];
    totalRequests += entry.requests.length;
    endpoints[endpoint] = (endpoints[endpoint] || 0) + entry.requests.length;
  }
  
  return {
    totalEntries: rateLimitStore.size,
    totalRequests,
    endpoints
  };
}

// Cleanup on process exit
if (typeof window === 'undefined') {
  process.on('exit', () => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
    }
  });
} 