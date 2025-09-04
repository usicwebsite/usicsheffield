import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('[Login API] Starting login process...');

    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    // Check if Firebase Admin is initialized
    if (!adminAuth) {
      console.error('[Login API] ❌ Firebase Admin Auth not initialized');
      return NextResponse.json(
        { error: 'Authentication service not available' },
        { status: 503 }
      );
    }

    // Verify the Firebase ID token
    console.log('[Login API] Verifying Firebase ID token...');
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log('[Login API] ✅ Token verified for user:', decodedToken.uid);

    // Get user info from Firebase Auth
    const firebaseUser = await adminAuth.getUser(decodedToken.uid);
    console.log('[Login API] ✅ Got Firebase user:', firebaseUser.email);

    // Check if user exists in Firestore (optional - depends on your user management)
    let userDocSnap = null;
    if (adminDb) {
      try {
        const userDocRef = adminDb.collection('users').doc(decodedToken.uid);
        userDocSnap = await userDocRef.get();
        console.log('[Login API] User document exists:', userDocSnap.exists);
      } catch (error) {
        console.log('[Login API] Error checking user document:', error);
        // Continue without user document for now
      }
    }

    // Create session data
    const sessionData = {
      uid: decodedToken.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
      loginTime: new Date().toISOString(),
    };

    // Set session cookie (you might want to use a more secure session management)
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('[Login API] ✅ Login successful for user:', firebaseUser.email);

    return NextResponse.json({
      success: true,
      user: sessionData,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('[Login API] ❌ Login error:', error);

    let errorMessage = 'Login failed';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('invalid-token')) {
        errorMessage = 'Invalid authentication token';
        statusCode = 401;
      } else if (error.message.includes('token-expired')) {
        errorMessage = 'Authentication token has expired';
        statusCode = 401;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
