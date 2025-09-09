import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { checkRateLimit } from '@/lib/rateLimit';

// POST /api/events/signup - Submit event signup
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = checkRateLimit(request, 'questions');
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

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
