import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/firebase-admin-utils';
import { adminDb } from '@/lib/firebase-admin';
import { ForumPost, toForumPost } from '@/lib/firebase-admin-utils';

const getUserPosts = async (collection: string, userId: string, limitCount: number) => {
  const snapshot = await adminDb
    .collection(collection)
    .where('authorId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(limitCount)
    .get();

  return snapshot.docs.map(toForumPost);
};

// GET /api/admin/users/[userId]/posts - Get all posts by a user
export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;

    // Verify admin authentication
    const verification = await verifyAdminToken(request);

    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: verification.status }
      );
    }

    // Get all posts by the user from different collections
    const [submittedPosts, approvedPosts, rejectedPosts] = await Promise.all([
      getUserPosts('submitted_posts', userId, 100),
      getUserPosts('approved_posts', userId, 100),
      getUserPosts('rejected_posts', userId, 100)
    ]);

    // Combine all posts and sort by creation date
    const allPosts: ForumPost[] = [
      ...submittedPosts,
      ...approvedPosts,
      ...rejectedPosts
    ].sort((a, b) => {
      const getTime = (date: ForumPost['createdAt'] | undefined): number => {
        if (!date) return 0;

        return date instanceof Date ? date.getTime() : date.toDate().getTime();
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
