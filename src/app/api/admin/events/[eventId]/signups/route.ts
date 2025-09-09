import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Simple admin verification function
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

// GET /api/admin/events/[eventId]/signups - Get all signups for a specific event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
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

    const { eventId } = await params;

    // Verify event exists
    const eventDoc = await adminDb.collection('events').doc(eventId).get();
    if (!eventDoc.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Get all signups for this event
    const signupsSnapshot = await adminDb
      .collection('event_signups')
      .where('eventId', '==', eventId)
      .get();

    const signups = signupsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.() || new Date()
    }));

    // Sort by submittedAt in descending order (newest first)
    signups.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

    return NextResponse.json({ signups });
  } catch (error) {
    console.error('Error fetching event signups:', error);
    return NextResponse.json({ error: 'Failed to fetch signups' }, { status: 500 });
  }
}
