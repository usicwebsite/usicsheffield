import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { cookies } from 'next/headers';
// import { withAuth } from '@/lib/auth-api';

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

    // Verify the Firebase ID token
    console.log('[Login API] Verifying Firebase ID token...');
    const adminAuth = getAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log('[Login API] ✅ Token verified for user:', decodedToken.uid);

    // Get user info from Firebase Auth
    const firebaseUser = await adminAuth.getUser(decodedToken.uid);
    console.log('[Login API] ✅ Got Firebase user:', firebaseUser.email);

    // Check if user exists in Firestore (optional - depends on your user management)
    const db = getFirestore();
    const userDocRef = doc(db, 'users', decodedToken.uid);
    let userDocSnap;

    try {
      userDocSnap = await getDoc(userDocRef);
      console.log('[Login API] User document exists:', userDocSnap.exists());
    } catch (error) {
      console.log('[Login API] Error checking user document:', error);
      // Continue without user document for now
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
