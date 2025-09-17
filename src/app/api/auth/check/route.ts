import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export async function GET() {
  try {
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
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
      );
    }

    // Verify the session is still valid
    if (!sessionData.uid || !sessionData.email) {
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
    } catch {
      // Continue without admin check
    }

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
