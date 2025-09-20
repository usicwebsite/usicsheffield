import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// GET /api/events/[eventId] - Get a specific event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const { eventId } = await params;

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Get event from Firestore
    const eventDoc = await adminDb.collection('events').doc(eventId).get();

    if (!eventDoc.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const eventData = eventDoc.data();
    if (!eventData) {
      return NextResponse.json({ error: 'Event data not found' }, { status: 404 });
    }

    // Return event data (public access)
    const event = {
      id: eventDoc.id,
      title: eventData.title,
      date: eventData.date,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      location: eventData.location,
      price: eventData.price, // Keep for backwards compatibility
      memberPrice: eventData.memberPrice,
      nonMemberPrice: eventData.nonMemberPrice,
      meetUpTime: eventData.meetUpTime,
      meetUpLocation: eventData.meetUpLocation,
      description: eventData.description,
      imageUrl: eventData.imageUrl,
      formFields: eventData.formFields,
      signupOpen: eventData.signupOpen || false, // Default to false for backwards compatibility
      signupMethod: eventData.signupMethod || (eventData.noSignupNeeded ? 'none' : 'website'), // Backwards compatibility
      noSignupNeeded: eventData.signupMethod ? eventData.signupMethod === 'none' : (eventData.noSignupNeeded || false), // Backwards compatibility
      signupFormUrl: eventData.signupFormUrl,
      createdAt: eventData.createdAt?.toDate?.() || new Date()
    };

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}
