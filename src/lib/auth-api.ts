import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { doc, getDoc, getFirestore, collection, getDocs } from 'firebase/firestore';

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
      console.log('[Auth API] Starting admin authentication check...');

      // Get Firebase ID token from Authorization header
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        console.log('[Auth API] No Firebase ID token provided');
        return NextResponse.json(
          { error: 'Unauthorized - Firebase ID token required' },
          { status: 401 }
        );
      }

      const idToken = authHeader.substring(7);

      // Verify Firebase ID token
      console.log('[Auth API] Verifying Firebase ID token...');
      const adminAuth = getAuth();
      let decodedToken;

      try {
        decodedToken = await adminAuth.verifyIdToken(idToken);
        console.log('[Auth API] ✅ Firebase ID token verified successfully');
        console.log('[Auth API] 🔍 Decoded token UID:', decodedToken.uid);
        console.log('[Auth API] 🔍 Decoded token email:', decodedToken.email);
        console.log('[Auth API] 🔍 Decoded token iss:', decodedToken.iss);
        console.log('[Auth API] 🔍 Decoded token aud:', decodedToken.aud);
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
    console.log('[Auth API] 🔍 Checking admin status for UID:', decodedToken.uid);
    console.log('[Auth API] 🔍 UID type:', typeof decodedToken.uid);
    console.log('[Auth API] 🔍 UID length:', decodedToken.uid?.length);
    console.log('[Auth API] 🔍 Decoded token email:', decodedToken.email);

    const db = getFirestore();
    console.log('[Auth API] 🔍 Looking for admin document at path: admins/' + decodedToken.uid);
    const adminDocRef = doc(db, 'admins', decodedToken.uid);
    console.log('[Auth API] 🔍 Admin document reference created');

    const adminDocSnap = await getDoc(adminDocRef);
    console.log('[Auth API] 🔍 Admin document snapshot received');
    console.log('[Auth API] 🔍 Document exists:', adminDocSnap.exists());
    console.log('[Auth API] 🔍 Document data:', adminDocSnap.data());

    if (!adminDocSnap.exists()) {
      console.log('[Auth API] ❌ User is not an admin');

      // Let's also check what documents exist in the admins collection
      console.log('[Auth API] 🔍 Checking all documents in admins collection...');
      try {
        const adminsCollection = collection(db, 'admins');
        const adminsSnapshot = await getDocs(adminsCollection);
        console.log('[Auth API] 🔍 Total documents in admins collection:', adminsSnapshot.size);

        if (adminsSnapshot.size > 0) {
          console.log('[Auth API] 🔍 Existing admin UIDs:');
          adminsSnapshot.forEach((doc) => {
            console.log('  - UID:', doc.id, 'Data:', doc.data());
          });
        } else {
          console.log('[Auth API] ❌ No documents found in admins collection');
        }
      } catch (collectionError) {
        console.error('[Auth API] ❌ Error listing admins collection:', collectionError);
      }

      return NextResponse.json(
        { error: 'Access denied - Admin privileges required' },
        { status: 403 }
      );
    }

    console.log('[Auth API] ✅ Admin document found - user is admin');

      const adminData = adminDocSnap.data();
      console.log('[Auth API] Admin authentication successful');

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
      console.log('[User Auth API] Starting user authentication check...');

      // Get Firebase ID token from Authorization header
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        console.log('[User Auth API] No Firebase ID token provided');
        return NextResponse.json(
          { error: 'Unauthorized - Firebase ID token required' },
          { status: 401 }
        );
      }

      const idToken = authHeader.substring(7);

      // Verify Firebase ID token
      console.log('[User Auth API] Verifying Firebase ID token...');
      const adminAuth = getAuth();
      let decodedToken;

      try {
        decodedToken = await adminAuth.verifyIdToken(idToken);
        console.log('[User Auth API] ✅ Firebase ID token verified successfully');
        console.log('[User Auth API] 🔍 Decoded token UID:', decodedToken.uid);
        console.log('[User Auth API] 🔍 Decoded token email:', decodedToken.email);
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

      console.log('[User Auth API] ✅ User authentication successful');

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
