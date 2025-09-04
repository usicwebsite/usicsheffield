import { NextResponse } from 'next/server';
import { AuthenticatedRequest } from '@/lib/auth-api';
import { rejectPost } from '@/lib/firebase-admin-utils';

export async function POST(request: AuthenticatedRequest) {
  try {
    console.log('[Reject Post API] Starting post rejection...');

    const body = await request.json();
    const { postId, rejectionReason } = body;

    if (!postId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing postId',
          message: 'Post ID is required'
        },
        { status: 400 }
      );
    }

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing rejection reason',
          message: 'Rejection reason is required'
        },
        { status: 400 }
      );
    }

    console.log('[Reject Post API] Rejecting post:', postId);
    console.log('[Reject Post API] Rejection reason:', rejectionReason);
    console.log('[Reject Post API] Admin UID:', request.admin.uid);

    const newPostId = await rejectPost(postId, request.admin.uid, rejectionReason.trim());

    console.log('[Reject Post API] Post rejected successfully, new ID:', newPostId);

    return NextResponse.json({
      success: true,
      data: {
        originalPostId: postId,
        newPostId,
        rejectedBy: request.admin.uid,
        rejectedAt: new Date().toISOString(),
        rejectionReason: rejectionReason.trim()
      }
    });
  } catch (error: unknown) {
    console.error('[Reject Post API] Error rejecting post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reject post',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 