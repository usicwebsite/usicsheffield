import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/firebase-admin-utils';
import { getUserComments } from '@/lib/firebase-utils';

// GET /api/admin/users/[userId]/comments - Get all comments by a user
export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;

    // Verify admin authentication
    const verification = await verifyAdminToken(request);
    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all comments by the user
    const comments = await getUserComments(userId, 100);

    return NextResponse.json({
      success: true,
      comments
    });

  } catch (error) {
    console.error('[User Comments API] Error getting user comments:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user comments'
      },
      { status: 500 }
    );
  }
}
