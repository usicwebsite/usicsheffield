import { NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/auth-api';
import { deletePost } from '@/lib/firebase-admin-utils';

export const DELETE = withAdminAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ postId: string }> }
) => {
  try {
    console.log('[Delete Post API] Starting post deletion...');

    const { postId } = await params;

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

    console.log('[Delete Post API] Deleting post:', postId);
    console.log('[Delete Post API] Admin UID:', request.admin.uid);

    const result = await deletePost(postId, request.admin.uid);

    console.log('[Delete Post API] Post deleted successfully:', result);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: unknown) {
    console.error('[Delete Post API] Error deleting post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete post',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});
