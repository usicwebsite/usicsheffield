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

    // Check if event exists
    const eventDoc = await adminDb.collection('events').doc(eventId).get();
    if (!eventDoc.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const eventData = eventDoc.data();
    if (!eventData) {
      return NextResponse.json({ error: 'Event data not found' }, { status: 404 });
    }

    // Validate form data against event's required fields
    const requiredFields = eventData.formFields || [];
    const missingFields = requiredFields.filter((field: string) => !formData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Create signup document
    const signupData = {
      eventId,
      eventTitle: eventData.title,
      formData,
      submittedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };

    // Save to Firestore
    const signupRef = await adminDb.collection('event_signups').add(signupData);

    // Check if we need to auto-close signups after this signup
    if (eventData.maxSignups && eventData.maxSignups > 0 && eventData.signupOpen && !eventData.noSignupNeeded) {
      try {
        // Get current signup count
        const signupsSnapshot = await adminDb
          .collection('event_signups')
          .where('eventId', '==', eventId)
          .get();

        const currentSignupCount = signupsSnapshot.size;

        // If we've reached max capacity, auto-close signups
        if (currentSignupCount >= eventData.maxSignups) {
          await adminDb.collection('events').doc(eventId).update({
            signupOpen: false,
            updatedAt: new Date()
          });
        }
      } catch (error) {
        console.error('Error checking signup capacity:', error);
        // Don't fail the signup if this check fails
      }
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
