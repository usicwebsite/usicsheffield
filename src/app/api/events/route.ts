import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// GET /api/events - Get all events (public access)
export async function GET() {
  try {
    if (!adminDb) {
      console.error('Database not initialized');
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    // Get all events from Firestore (public access)
    const eventsSnapshot = await adminDb.collection('events').orderBy('createdAt', 'desc').get();

    const events = eventsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        price: data.price,
        description: data.description,
        imageUrl: data.imageUrl,
        formFields: data.formFields,
        signupOpen: data.signupOpen || false, // Default to false for backwards compatibility
        createdAt: data.createdAt?.toDate?.() || new Date()
      };
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({
      error: 'Failed to fetch events',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
