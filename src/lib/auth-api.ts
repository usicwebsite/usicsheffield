import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
  initializeApp({
    credential: cert(serviceAccount),
  });
}

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
 * Uses Firebase ID tokens for authentication
 */
export function withAdminAuth<T extends unknown[]>(
  handler: (request: AuthenticatedRequest, ...args: T) => Promise<Response>
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

      const idToken = authHeader.substring(7);

      // Verify Firebase ID token
      const adminAuth = getAuth();
      let decodedToken;

      try {
        decodedToken = await adminAuth.verifyIdToken(idToken);
      } catch (error) {
        console.error('[Auth API] ❌ Firebase ID token verification failed:', error);
        console.error('[Auth API] ❌ Error details:', {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : undefined
        });
        return NextResponse.json(
          { error: 'Invalid Firebase ID token' },
          { status: 401 }
        );
      }

          // Check if user is admin in Firestore
    const db = getFirestore();
    const adminDocRef = db.collection('admins').doc(decodedToken.uid);

    const adminDocSnap = await adminDocRef.get();

    if (!adminDocSnap.exists) {
      // Check if any admin documents exist
      try {
        const adminsCollection = db.collection('admins');
        const adminsSnapshot = await adminsCollection.get();
        if (adminsSnapshot.size === 0) {
          console.error('[Auth API] ❌ No admin documents found in collection');
        }
      } catch (collectionError) {
        console.error('[Auth API] ❌ Error checking admins collection:', collectionError);
      }

      return NextResponse.json(
        { error: 'Access denied - Admin privileges required' },
        { status: 403 }
      );
    }

      const adminData = adminDocSnap.data();

      // Add admin info to request object
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.admin = {
        uid: decodedToken.uid,
        email: decodedToken.email || adminData?.email || '',
        isAdmin: true
      };

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
 * Extract admin info from request headers (set by middleware)
 */
export function getAdminFromHeaders(request: NextRequest): { uid: string; email: string } | null {
  const uid = request.headers.get('X-Admin-UID');
  const email = request.headers.get('X-Admin-Email');

  if (!uid || !email) {
    return null;
  }

  return { uid, email };
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

      const idToken = authHeader.substring(7);

      // Verify Firebase ID token
      const adminAuth = getAuth();
      let decodedToken;

      try {
        decodedToken = await adminAuth.verifyIdToken(idToken);
      } catch (error) {
        console.error('[User Auth API] ❌ Firebase ID token verification failed:', error);
        console.error('[User Auth API] ❌ Error details:', {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : undefined
        });
        return NextResponse.json(
          { error: 'Invalid Firebase ID token' },
          { status: 401 }
        );
      }


      // Add user info to request object
      const authenticatedRequest = request as UserAuthenticatedRequest;
      authenticatedRequest.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        displayName: decodedToken.name || null
      };

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
