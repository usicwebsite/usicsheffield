import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { syncUserDisplayNameWithGoogle } from '@/lib/firebase-admin-utils';

export async function POST(request: NextRequest) {
  try {

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
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Get user info from Firebase Auth
    const firebaseUser = await adminAuth.getUser(decodedToken.uid);

    // Sync user's display name with Google account name
    try {
      const syncResult = await syncUserDisplayNameWithGoogle(decodedToken.uid, 'system');
      if (syncResult.synced) {
        console.log(`[Login API] Synced display name for user ${decodedToken.uid}: "${syncResult.oldName}" -> "${syncResult.newName}"`);
        // Refresh user data after sync
        const updatedFirebaseUser = await adminAuth.getUser(decodedToken.uid);
        Object.assign(firebaseUser, updatedFirebaseUser);
      }
    } catch (syncError) {
      console.warn('[Login API] Failed to sync display name, continuing with login:', syncError);
      // Continue with login even if sync fails
    }

    // Check if user exists in Firestore (optional - depends on your user management)
    if (adminDb) {
      try {
        const userDocRef = adminDb.collection('users').doc(decodedToken.uid);
        await userDocRef.get();
      } catch {
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
