import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('[Check API] Checking authentication status...');

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: 'No session found' },
        { status: 401 }
      );
    }

    let sessionData;
    try {
      sessionData = JSON.parse(sessionCookie.value);
    } catch {
      console.log('[Check API] Invalid session cookie');
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
      );
    }

    // Verify the session is still valid
    if (!sessionData.uid || !sessionData.email) {
      console.log('[Check API] Invalid session data');
      return NextResponse.json(
        { success: false, message: 'Invalid session data' },
        { status: 401 }
      );
    }

    // Optional: Check if user still exists in Firebase Auth
    try {
      const adminAuth = getAuth();
      await adminAuth.getUser(sessionData.uid);
    } catch {
      console.log('[Check API] User no longer exists in Firebase Auth');
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 401 }
      );
    }

    // Check if user is admin
    let isAdmin = false;
    try {
      const db = getFirestore();
      const adminDocRef = doc(db, 'admins', sessionData.uid);
      const adminDocSnap = await getDoc(adminDocRef);
      isAdmin = adminDocSnap.exists();
    } catch (error) {
      console.log('[Check API] Error checking admin status:', error);
      // Continue without admin check
    }

    console.log('[Check API] ✅ Authentication check successful for user:', sessionData.email);

    return NextResponse.json({
      success: true,
      user: sessionData,
      isAdmin,
      message: 'Authentication check successful'
    });

  } catch (error) {
    console.error('[Check API] ❌ Check error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}
