import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// POST /api/events/signup - Submit event signup
export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const body = await request.json();
    const { eventId, formData } = body;

    // Validate required fields
    if (!eventId || !formData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check registration status and capacity, create the signup, and bump the shared
    // count in one transaction. Every signup writes the event doc, so they serialize.
    const eventRef = adminDb.collection('events').doc(eventId);
    const signupRef = adminDb.collection('event_signups').doc();

    const result = await adminDb.runTransaction(async (tx) => {
      const eventDoc = await tx.get(eventRef);
      const eventData = eventDoc.data();

      if (!eventDoc.exists || !eventData) {
        return { status: 404, error: 'Event not found' };
      }

      const signupMethod = eventData.signupMethod || (eventData.noSignupNeeded ? 'none' : 'website');

      if (eventData.signupOpen !== true || signupMethod !== 'website') {
        return { status: 409, error: 'Signups are closed for this event' };
      }

      // Validate form data against event's required fields
      const requiredFields = eventData.formFields || [];
      const missingFields = requiredFields.filter((field: string) => !formData[field]);

      if (missingFields.length > 0) {
        return { status: 400, error: `Missing required fields: ${missingFields.join(', ')}` };
      }

      // signupCount is maintained here; older events without it are counted once
      const currentCount: number = Number.isInteger(eventData.signupCount)
        ? eventData.signupCount
        : (await tx.get(adminDb.collection('event_signups').where('eventId', '==', eventId).count())).data().count;

      const maxSignups: number = eventData.maxSignups || 0;

      if (maxSignups > 0 && currentCount >= maxSignups) {
        tx.update(eventRef, { signupOpen: false, signupCount: currentCount, updatedAt: new Date() });

        return { status: 409, error: 'This event is full' };
      }

      tx.create(signupRef, {
        eventId,
        eventTitle: eventData.title,
        formData,
        submittedAt: new Date(),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      });

      const newCount = currentCount + 1;
      // Auto-close signups once capacity is reached
      const isFull = maxSignups > 0 && newCount >= maxSignups;
      tx.update(eventRef, isFull
        ? { signupCount: newCount, signupOpen: false, updatedAt: new Date() }
        : { signupCount: newCount });

      return null;
    });

    if (result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      signupId: signupRef.id,
      message: 'Successfully signed up for the event!'
    });
  } catch (error) {
    console.error('Error submitting event signup:', error);

    return NextResponse.json({ error: 'Failed to submit signup' }, { status: 500 });
  }
}
