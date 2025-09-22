import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminToken } from '@/lib/firebase-admin-utils';
import { v2 as cloudinary } from 'cloudinary';

// Helper function to check if a price is considered "free"
const isPriceFree = (price: string): boolean => {
  if (!price || typeof price !== 'string') return false;
  const normalizedPrice = price.trim().toLowerCase();
  return normalizedPrice === 'free' ||
         normalizedPrice === '0' ||
         normalizedPrice === '0.0' ||
         normalizedPrice === '0.00' ||
         normalizedPrice === '0.000';
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
      if (data.signupOpen && data.signupMethod === 'website') {
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
    const memberPrice = formData.get('memberPrice') as string;
    const nonMemberPrice = formData.get('nonMemberPrice') as string;
    const meetUpTime = formData.get('meetUpTime') as string;
    const meetUpLocation = formData.get('meetUpLocation') as string;
    const description = formData.get('description') as string;
    const formFields = JSON.parse(formData.get('formFields') as string);
    const signupOpen = formData.get('signupOpen') === 'true';
    const isPublic = formData.get('isPublic') === 'true';
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const maxSignups = formData.get('maxSignups') ? parseInt(formData.get('maxSignups') as string) : 50;
    const createdBy = formData.get('createdBy') as string;
    const imageFile = formData.get('image') as File;
    const signupFormUrl = formData.get('signupFormUrl') as string;
    const signupMethod = formData.get('signupMethod') as string || 'website'; // Default to website for backwards compatibility

    // Validate required fields and collect missing ones
    const missingFields: string[] = [];

    if (!title || typeof title !== 'string' || title.trim() === '') {
      missingFields.push('title');
    }
    if (!date || typeof date !== 'string' || date.trim() === '') {
      missingFields.push('date');
    }
    if (!startTime || typeof startTime !== 'string' || startTime.trim() === '') {
      missingFields.push('startTime');
    }
    if (!location || typeof location !== 'string' || location.trim() === '') {
      missingFields.push('location');
    }
    if (!price || typeof price !== 'string' || price.trim() === '') {
      missingFields.push('price');
    }

    // Price fields are required unless they're free or no signup is needed
    if (signupMethod !== 'none' && !isPriceFree(memberPrice) && (!memberPrice || typeof memberPrice !== 'string' || memberPrice.trim() === '')) {
      missingFields.push('memberPrice');
    }
    if (signupMethod !== 'none' && !isPriceFree(nonMemberPrice) && (!nonMemberPrice || typeof nonMemberPrice !== 'string' || nonMemberPrice.trim() === '')) {
      missingFields.push('nonMemberPrice');
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      missingFields.push('description');
    }
    if (!createdBy || typeof createdBy !== 'string' || createdBy.trim() === '') {
      missingFields.push('createdBy');
    }

    if (missingFields.length > 0) {
      return NextResponse.json({
        error: 'Missing required fields',
        missingFields: missingFields,
        message: `The following required fields are missing: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Handle formFields - can be null/undefined for no signup events
    let processedFormFields = [];
    if (formFields) {
      processedFormFields = Array.isArray(formFields) ? formFields : [];
    }

    // Only validate formFields if website signup is selected
    if (signupMethod === 'website' && (!processedFormFields || processedFormFields.length === 0)) {
      return NextResponse.json({ error: 'At least one form field is required for website signup' }, { status: 400 });
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
      ...(price && { price }), // Keep for backwards compatibility
      ...(memberPrice && { memberPrice }),
      ...(nonMemberPrice && { nonMemberPrice }),
      ...(meetUpTime && { meetUpTime }),
      ...(meetUpLocation && { meetUpLocation }),
      description,
      imageUrl,
      formFields: processedFormFields,
      signupOpen,
      signupMethod: signupMethod || 'website', // Default to website for backwards compatibility
      isPublic,
      tags: tags || [],
      maxSignups: signupMethod === 'none' ? 0 : (signupMethod === 'website' ? maxSignups : 50),
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
