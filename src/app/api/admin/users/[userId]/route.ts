import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, getUserDetails } from '@/lib/firebase-admin-utils';

// GET /api/admin/users/[userId] - Get detailed user information
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

    // Get user details
    const user = await getUserDetails(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('[User Detail API] Error getting user details:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user details'
      },
      { status: 500 }
    );
  }
}
