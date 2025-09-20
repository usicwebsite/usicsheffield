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

// GET /api/admin/events - Get all events
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    // Get all events from Firestore
    const eventsSnapshot = await adminDb!.collection('events').orderBy('createdAt', 'desc').get();

    const events = await Promise.all(eventsSnapshot.docs.map(async doc => {
      const data = doc.data();

      // Get signup count for this event
      let signupCount = 0;
      if (data.signupOpen && !data.noSignupNeeded) {
        try {
          const signupsSnapshot = await adminDb!
            .collection('event_signups')
            .where('eventId', '==', doc.id)
            .get();
          signupCount = signupsSnapshot.size;

          // Automatically close signups if max capacity reached
          if (data.maxSignups && data.maxSignups > 0 && signupCount >= data.maxSignups && data.signupOpen) {
            await adminDb!.collection('events').doc(doc.id).update({
              signupOpen: false,
              updatedAt: new Date()
            });
            // Update the data object to reflect the change
            data.signupOpen = false;
          }
        } catch (error) {
          console.error(`Error getting signup count for event ${doc.id}:`, error);
        }
      }

      return {
        id: doc.id,
        ...data,
        signupCount,
        createdAt: data.createdAt?.toDate?.() || new Date()
      };
    }));

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/admin/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

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
    const createdBy = formData.get('createdBy') as string;
    const imageFile = formData.get('image') as File;
    const signupFormUrl = formData.get('signupFormUrl') as string;

    // Validate required fields
    if (!title || !date || !startTime || !location || !description || !createdBy) {
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

    let imageUrl = '';

    // Handle image upload if provided
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

        // Convert file to buffer
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary with optimization (no aspect ratio constraints)
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'usic-events',
              transformation: [
                { quality: 'auto', fetch_format: 'auto' }
              ],
              public_id: `event_${Date.now()}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });

        imageUrl = (result as { secure_url: string }).secure_url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }

    // Create event document
    const eventData = {
      title,
      date,
      startTime,
      ...(endTime && { endTime }),
      location,
      price: price || 'Free',
      description,
      imageUrl,
      formFields: processedFormFields,
      signupOpen,
      noSignupNeeded,
      isPublic,
      tags: tags || [],
      maxSignups: noSignupNeeded ? 0 : maxSignups,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(signupFormUrl && { signupFormUrl })
    };

    // Save to Firestore
    const eventRef = await adminDb!.collection('events').add(eventData);

    return NextResponse.json({
      success: true,
      eventId: eventRef.id,
      imageUrl
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
