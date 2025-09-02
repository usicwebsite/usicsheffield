import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    console.log('[Test Admin SDK] Testing admin SDK functionality...');
    
    if (!adminDb) {
      console.error('[Test Admin SDK] Admin DB is null');
      return NextResponse.json({
        success: false,
        error: 'Admin DB is null',
        message: 'Firebase Admin SDK not initialized'
      }, { status: 500 });
    }

    console.log('[Test Admin SDK] Admin DB is available');
    
    // Test basic collection access
    try {
      const testCollection = adminDb.collection('admins');
      console.log('[Test Admin SDK] Successfully created collection reference');
      
      // Try to get a document (this will fail if permissions are wrong, but won't crash)
      testCollection.doc('test');
      console.log('[Test Admin SDK] Successfully created document reference');
      
      return NextResponse.json({
        success: true,
        message: 'Admin SDK is working correctly',
        adminDbAvailable: true,
        collectionAccess: true,
        documentAccess: true
      });
    } catch (collectionError) {
      console.error('[Test Admin SDK] Collection access error:', collectionError);
      return NextResponse.json({
        success: false,
        error: 'Collection access failed',
        message: 'Cannot access Firestore collections',
        details: collectionError instanceof Error ? collectionError.message : String(collectionError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('[Test Admin SDK] General error:', error);
    return NextResponse.json({
      success: false,
      error: 'General error',
      message: 'Failed to test admin SDK',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
