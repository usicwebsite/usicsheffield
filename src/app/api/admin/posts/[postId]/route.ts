import { NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/auth-api';
import { deletePost } from '@/lib/firebase-admin-utils';

export const DELETE = withAdminAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ postId: string }> }
) => {
  try {
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

    const result = await deletePost(postId, request.admin.uid);

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
