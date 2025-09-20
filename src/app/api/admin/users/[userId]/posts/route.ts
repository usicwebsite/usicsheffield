import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/firebase-admin-utils';
import { getUserSubmittedPosts, getUserApprovedPosts, getUserRejectedPosts, ForumPost } from '@/lib/firebase-utils';

// GET /api/admin/users/[userId]/posts - Get all posts by a user
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

    // Get all posts by the user from different collections
    const [submittedPosts, approvedPosts, rejectedPosts] = await Promise.all([
      getUserSubmittedPosts(userId, 100),
      getUserApprovedPosts(userId, 100),
      getUserRejectedPosts(userId, 100)
    ]);

    // Combine all posts and sort by creation date
    const allPosts: ForumPost[] = [
      ...submittedPosts,
      ...approvedPosts,
      ...rejectedPosts
    ].sort((a, b) => {
      const getTime = (date: Date | { toDate(): Date } | undefined): number => {
        if (!date) return 0;
        if (date instanceof Date) return date.getTime();
        if (typeof date === 'object' && 'toDate' in date) return date.toDate().getTime();
        return 0;
      };
      const aTime = getTime(a.createdAt);
      const bTime = getTime(b.createdAt);
      return bTime - aTime;
    });

    return NextResponse.json({
      success: true,
      posts: allPosts
    });

  } catch (error) {
    console.error('[User Posts API] Error getting user posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user posts'
      },
      { status: 500 }
    );
  }
}
