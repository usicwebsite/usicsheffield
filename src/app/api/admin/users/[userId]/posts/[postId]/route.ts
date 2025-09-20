import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, deletePostByAdmin } from '@/lib/firebase-admin-utils';

// DELETE /api/admin/users/[userId]/posts/[postId] - Delete a specific post by admin
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ userId: string; postId: string }> }) {
  try {
    const { postId } = await params;

    // Verify admin authentication
    const verification = await verifyAdminToken(request);
    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete the post
    const result = await deletePostByAdmin(postId, (verification as { uid: string }).uid);

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
      data: result
    });

  } catch (error) {
    console.error('[Delete Post API] Error deleting post:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete post'
      },
      { status: 500 }
    );
  }
}
