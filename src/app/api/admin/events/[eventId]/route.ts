import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminToken } from '@/lib/firebase-admin-utils';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dkqbvreso',
  api_key: process.env.CLOUDINARY_API_KEY || '754571283831882',
  api_secret: process.env.CLOUDINARY_API_SECRET || '14p8WRBDeNrzzb6srmbcWzt6oXA',
});

// Admin token verification is now handled by the imported utility function

// GET /api/admin/events/[eventId] - Get a specific event
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

    // Get the event
    const eventDoc = await adminDb.collection('events').doc(eventId).get();
    if (!eventDoc.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const eventData = eventDoc.data();
    const event = {
      id: eventDoc.id,
      ...eventData,
      createdAt: eventData?.createdAt?.toDate?.() || new Date()
    };

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// PUT /api/admin/events/[eventId] - Update a specific event
export async function PUT(
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

    // Parse form data
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const location = formData.get('location') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;
    const formFields = JSON.parse(formData.get('formFields') as string);
    const signupOpen = formData.get('signupOpen') === 'true';
    const noSignupNeeded = formData.get('noSignupNeeded') === 'true';
    const isPublic = formData.get('isPublic') === 'true';
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const maxSignups = formData.get('maxSignups') ? parseInt(formData.get('maxSignups') as string) : 50;
    const existingImageUrl = formData.get('existingImageUrl') as string;
    const newImageUrl = formData.get('imageUrl') as string;

    // Validate required fields
    if (!title || !date || !startTime || !location || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle formFields - can be null/undefined for no signup events
    let processedFormFields = [];
    if (formFields) {
      processedFormFields = Array.isArray(formFields) ? formFields : [];
    }

    // Only validate formFields if signup is needed
    if (!noSignupNeeded && processedFormFields.length === 0) {
      return NextResponse.json({ error: 'At least one form field is required' }, { status: 400 });
    }

    // Determine the final image URL
    let imageUrl: string | undefined;

    if (newImageUrl && newImageUrl.trim()) {
      // New image was uploaded
      imageUrl = newImageUrl.trim();
    } else if (existingImageUrl && existingImageUrl.trim()) {
      // Keep existing image
      imageUrl = existingImageUrl.trim();
    } else if (newImageUrl === '') {
      // Image was removed
      imageUrl = undefined;
    }

    // Image upload is handled by the separate /api/upload-event-image endpoint
    // This API only receives the resulting URL

    // Update the event in Firestore
    const updateData: {
      title: string;
      date: string;
      startTime: string;
      location: string;
      price: string;
      description: string;
      formFields: string[];
      signupOpen: boolean;
      noSignupNeeded: boolean;
      isPublic: boolean;
      tags: string[];
      maxSignups: number;
      updatedAt: Date;
      endTime?: string;
      imageUrl?: string | null;
    } = {
      title,
      date,
      startTime,
      location,
      price,
      description,
      formFields: processedFormFields,
      signupOpen,
      noSignupNeeded,
      isPublic,
      tags: tags || [],
      maxSignups: noSignupNeeded ? 0 : maxSignups,
      updatedAt: new Date(),
      ...(endTime && { endTime })
    };

    // Handle image URL - include if we have a URL, or null if image was removed
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    } else if (newImageUrl === '') {
      // Image was explicitly removed
      updateData.imageUrl = null;
    }

    await adminDb.collection('events').doc(eventId).update(updateData);

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully!'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// PATCH /api/admin/events/[eventId] - Partially update a specific event (e.g., toggle signup status)
export async function PATCH(
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

    // Parse JSON body for partial updates
    const updateData = await request.json();

    // Validate that we have update data
    if (!updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }

    // Check if event exists
    const eventDoc = await adminDb.collection('events').doc(eventId).get();
    if (!eventDoc.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Add updatedAt timestamp
    const finalUpdateData = {
      ...updateData,
      updatedAt: new Date()
    };

    // Update the event in Firestore
    await adminDb.collection('events').doc(eventId).update(finalUpdateData);

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully!'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE /api/admin/events/[eventId] - Delete a specific event
export async function DELETE(
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

    // Check if event exists
    const eventDoc = await adminDb.collection('events').doc(eventId).get();
    if (!eventDoc.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Delete the event
    await adminDb.collection('events').doc(eventId).delete();

    // Also delete associated signups
    const signupsSnapshot = await adminDb
      .collection('event_signups')
      .where('eventId', '==', eventId)
      .get();

    const deletePromises = signupsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);

    return NextResponse.json({
      success: true,
      message: 'Event and associated signups deleted successfully!'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
