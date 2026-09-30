import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminToken } from '@/lib/firebase-admin-utils';
import { v2 as cloudinary } from 'cloudinary';
import { formText } from '@/lib/form-data';

// Fields written by PUT; text fields are null when the form omits them
type EventUpdate = {
  title: string;
  date: string | null;
  startTime: string | null;
  location: string | null;
  description: string | null;
  formFields: string[];
  signupOpen: boolean;
  signupMethod: string;
  isPublic: boolean;
  tags: string[];
  maxSignups: number;
  updatedAt: Date;
  endTime?: string;
  imageUrl?: string | null;
  signupFormUrl?: string;
  price?: string;
  memberPrice?: string;
  nonMemberPrice?: string;
  meetUpTime?: string;
  meetUpLocation?: string;
};


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
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
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const { eventId } = await params;

    // Parse form data
    const formData = await request.formData();
    const title = formText(formData, 'title');
    const date = formText(formData, 'date');
    const startTime = formText(formData, 'startTime');
    const endTime = formText(formData, 'endTime');
    const location = formText(formData, 'location');
    const price = formText(formData, 'price');
    const memberPrice = formText(formData, 'memberPrice');
    const nonMemberPrice = formText(formData, 'nonMemberPrice');
    const meetUpTime = formText(formData, 'meetUpTime');
    const meetUpLocation = formText(formData, 'meetUpLocation');
    const description = formText(formData, 'description');
    const formFields = JSON.parse(formText(formData, 'formFields') ?? 'null');
    const signupOpen = formData.get('signupOpen') === 'true';
    const signupMethod = formText(formData, 'signupMethod') || 'website'; // Default to website for backwards compatibility
    const isPublic = formData.get('isPublic') === 'true';
    const tags = JSON.parse(formText(formData, 'tags') || '[]');
    const maxSignupsText = formText(formData, 'maxSignups');
    const maxSignups = maxSignupsText ? parseInt(maxSignupsText) : 50;
    const existingImageUrl = formText(formData, 'existingImageUrl');
    const newImageUrl = formText(formData, 'imageUrl');
    const signupFormUrl = formText(formData, 'signupFormUrl');

    // Validate required fields - only title is required
    if (!title || title.trim() === '') {
      return NextResponse.json({
        error: 'Missing required field',
        message: 'Event title is required'
      }, { status: 400 });
    }

    // Handle formFields - can be null/undefined for no signup events
    let processedFormFields = [];

    if (formFields) {
      processedFormFields = Array.isArray(formFields) ? formFields : [];
    }

    // Only validate formFields if website signup is selected
    if (signupMethod === 'website' && processedFormFields.length === 0) {
      return NextResponse.json({ error: 'At least one form field is required for website signup' }, { status: 400 });
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
    const updateData: EventUpdate = {
      title,
      date,
      startTime,
      location,
      description,
      formFields: processedFormFields,
      signupOpen,
      signupMethod: signupMethod || 'website', // Default to website for backwards compatibility
      isPublic,
      tags: tags || [],
      maxSignups: signupMethod === 'none' ? 0 : (signupMethod === 'website' ? maxSignups : 50),
      updatedAt: new Date(),
      ...(endTime && { endTime }),
      ...(signupFormUrl && { signupFormUrl }),
      ...(price && { price }),
      ...(memberPrice && { memberPrice }),
      ...(nonMemberPrice && { nonMemberPrice }),
      ...(meetUpTime && { meetUpTime }),
      ...(meetUpLocation && { meetUpLocation })
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
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
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
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
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
