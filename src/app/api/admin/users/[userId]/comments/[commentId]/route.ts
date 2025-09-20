import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, deleteCommentByAdmin } from '@/lib/firebase-admin-utils';

// DELETE /api/admin/users/[userId]/comments/[commentId] - Delete a specific comment by admin
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ userId: string; commentId: string }> }) {
  try {
    const { commentId } = await params;

    // Verify admin authentication
    const verification = await verifyAdminToken(request);
    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete the comment
    const result = await deleteCommentByAdmin(commentId, (verification as { uid: string }).uid);

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
      data: result
    });

  } catch (error) {
    console.error('[Delete Comment API] Error deleting comment:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete comment'
      },
      { status: 500 }
    );
  }
}
