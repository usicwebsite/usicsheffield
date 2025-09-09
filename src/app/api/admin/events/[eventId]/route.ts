import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dkqbvreso',
  api_key: process.env.CLOUDINARY_API_KEY || '754571283831882',
  api_secret: process.env.CLOUDINARY_API_SECRET || '14p8WRBDeNrzzb6srmbcWzt6oXA',
});

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
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;
    const formFields = JSON.parse(formData.get('formFields') as string);
    const imageFile = formData.get('image') as File;

    // Validate required fields
    if (!title || !date || !time || !location || !description || !formFields) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!Array.isArray(formFields) || formFields.length === 0) {
      return NextResponse.json({ error: 'At least one form field is required' }, { status: 400 });
    }

    let imageUrl = formData.get('existingImageUrl') as string;

    // Handle new image upload if provided
    if (imageFile && imageFile.size > 0) {
      try {
        // Validate file type
        if (!imageFile.type.startsWith('image/')) {
          return NextResponse.json({ error: 'Invalid file type. Please upload an image.' }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (imageFile.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: 'File size too large. Maximum size is 5MB.' }, { status: 400 });
        }

        // Upload to Cloudinary
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'usic-events' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as { secure_url: string });
            }
          ).end(buffer);
        });

        imageUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }

    // Update the event in Firestore
    const updateData = {
      title,
      date,
      time,
      location,
      price,
      description,
      formFields,
      ...(imageUrl && { imageUrl }),
      updatedAt: new Date()
    };

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
