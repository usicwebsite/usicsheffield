import { NextResponse } from 'next/server';
import { withAuth, UserAuthenticatedRequest } from '@/lib/auth-api';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { formFile } from '@/lib/form-data';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = withAuth(async (request: UserAuthenticatedRequest) => {
  try {
    const formData = await request.formData();
    const file = formFile(formData, 'file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with optimization
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'usic-profiles',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ],
          public_id: `profile_${Date.now()}`,
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);

    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
});
