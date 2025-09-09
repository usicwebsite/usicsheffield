import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Helper function to verify admin token
async function verifyAdminToken(request: NextRequest): Promise<{ success: boolean; error?: string; uid?: string }> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'No authorization header' };
    }

    // For now, we'll skip token verification in development
    // In production, you would verify the Firebase ID token here
    if (process.env.NODE_ENV === 'development') {
      return { success: true, uid: 'dev-admin' };
    }

    // TODO: Implement proper Firebase ID token verification
    return { success: false, error: 'Token verification not implemented' };
  } catch {
    return { success: false, error: 'Token verification failed' };
  }
}

// PATCH /api/admin/events/[eventId]/signups/[signupId] - Update signup payment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; signupId: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const { signupId } = await params;
    const body = await request.json();
    const { paid } = body;

    if (typeof paid !== 'boolean') {
      return NextResponse.json({ error: 'Invalid paid status' }, { status: 400 });
    }

    // Update the signup payment status
    await adminDb.collection('event_signups').doc(signupId).update({
      paid,
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Payment status updated successfully!'
    });
  } catch (error) {
    console.error('Error updating signup payment status:', error);
    return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
  }
}
