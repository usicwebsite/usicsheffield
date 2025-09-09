import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminToken } from '@/lib/firebase-admin-utils';

// Admin token verification is now handled by the imported utility function

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
