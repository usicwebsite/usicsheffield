import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminToken } from '@/lib/firebase-admin-utils';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { formFile, formText } from '@/lib/form-data';


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
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    // Get all events from Firestore
    const eventsSnapshot = await adminDb!.collection('events').orderBy('createdAt', 'desc').get();

    const events = await Promise.all(eventsSnapshot.docs.map(async doc => {
      const data = doc.data();

      // signupCount is maintained by /api/events/signup regardless of signupOpen,
      // so full (auto-closed) events still report it. Legacy events without it are counted.
      let signupCount = Number.isInteger(data.signupCount) ? data.signupCount : 0;

      if (data.signupMethod === 'website') {
        try {
          if (!Number.isInteger(data.signupCount)) {
            const countSnapshot = await adminDb!
              .collection('event_signups')
              .where('eventId', '==', doc.id)
              .count()
              .get();

            signupCount = countSnapshot.data().count;
          }

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
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

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
    const isPublic = formData.get('isPublic') === 'true';
    const tags = JSON.parse(formText(formData, 'tags') || '[]');
    const maxSignupsText = formText(formData, 'maxSignups');
    const maxSignups = maxSignupsText ? parseInt(maxSignupsText) : 50;
    const createdBy = formText(formData, 'createdBy');
    const imageFile = formFile(formData, 'image');
    const signupFormUrl = formText(formData, 'signupFormUrl');
    const signupMethod = formText(formData, 'signupMethod') || 'website'; // Default to website for backwards compatibility

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
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'usic-events',
              transformation: [
                { quality: 'auto', fetch_format: 'auto' }
              ],
              public_id: `event_${Date.now()}`,
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          ).end(buffer);
        });

        imageUrl = result.secure_url;
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
