import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, verifyUserIdToken } from './firebase-admin-utils';

export interface AdminUser {
  uid: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthenticatedRequest extends NextRequest {
  admin: AdminUser;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface UserAuthenticatedRequest extends NextRequest {
  user: User;
}

/**
 * Higher-order function to protect API routes with admin authentication
 * Uses Firebase ID tokens plus the admins/{uid} record (see verifyAdminToken)
 */
export function withAdminAuth<T extends unknown[]>(
  handler: (request: AuthenticatedRequest, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const verification = await verifyAdminToken(request);

      if (!verification.success) {
        return NextResponse.json({ error: verification.error }, { status: verification.status });
      }

      // Add admin info to request object
      const authenticatedRequest: AuthenticatedRequest = Object.assign(request, {
        admin: {
          uid: verification.uid,
          email: verification.email,
          isAdmin: true
        }
      });

      // Call the original handler with authenticated request
      return handler(authenticatedRequest, ...args);
    } catch (error) {
      console.error('[Auth API] Error during authentication:', error);

      return NextResponse.json(
        { error: 'Internal server error during authentication' },
        { status: 500 }
      );
    }
  };
}

/**
 * Higher-order function to protect API routes with user authentication
 * Uses Firebase ID tokens for authentication (for regular users)
 */
export function withAuth<T extends unknown[]>(
  handler: (request: UserAuthenticatedRequest, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      // Get Firebase ID token from Authorization header
      const authHeader = request.headers.get('authorization');

      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Unauthorized - Firebase ID token required' },
          { status: 401 }
        );
      }

      // Token + restriction checks (custom claim OR database), shared with admin routes
      const verification = await verifyUserIdToken(authHeader.substring(7));

      if (!verification.success) {
        return verification.status === 401
          ? NextResponse.json({ error: 'Invalid Firebase ID token' }, { status: 401 })
          : NextResponse.json({ error: verification.error, message: 'message' in verification ? verification.message : undefined }, { status: verification.status });
      }

      // Add user info to request object
      const authenticatedRequest: UserAuthenticatedRequest = Object.assign(request, {
        user: {
          uid: verification.uid,
          email: verification.email || null,
          displayName: verification.name || null
        }
      });

      // Call the original handler with authenticated request
      return handler(authenticatedRequest, ...args);
    } catch (error) {
      console.error('[User Auth API] Error during authentication:', error);

      return NextResponse.json(
        { error: 'Internal server error during authentication' },
        { status: 500 }
      );
    }
  };
}
