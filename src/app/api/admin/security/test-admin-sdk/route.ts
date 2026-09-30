import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { withAdminAuth } from '@/lib/auth-api';

// Health check: performs a real authorized Firestore read, which proves credentials work.
export const GET = withAdminAuth(async () => {
  try {
    const snapshot = await adminDb.collection('admins').limit(1).get();

    return NextResponse.json({
      success: true,
      message: 'Admin SDK is working correctly',
      adminCount: snapshot.size
    });
  } catch (error) {
    console.error('[Test Admin SDK] Firestore read failed:', error);

    return NextResponse.json({
      success: false,
      error: 'Firestore read failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
});
