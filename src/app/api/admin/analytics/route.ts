import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth-api';
import { adminDb } from '@/lib/firebase-admin';
import { ForumPost, toForumPost } from '@/lib/firebase-admin-utils';

export const GET = withAdminAuth(async () => {
  try {
    console.log('[Analytics API] Getting admin analytics...');
    
    // Get post statistics
    const snapshot = await adminDb.collection('posts').orderBy('createdAt', 'desc').limit(1000).get();
    const allPosts = snapshot.docs.map(toForumPost);
    
    const approvedPosts = allPosts.filter((post: ForumPost) => post.isApproved);
    const pendingPosts = allPosts.filter((post: ForumPost) => !post.isApproved);
    
    const totalPosts = allPosts.length;
    const approvedCount = approvedPosts.length;
    const pendingCount = pendingPosts.length;
    
    // For now, we'll set a placeholder for total users
    // In a real implementation, you'd query a users collection
    const totalUsers = 0; // Placeholder
    
    const analytics = {
      totalPosts,
      pendingPosts: pendingCount,
      approvedPosts: approvedCount,
      totalUsers,
      // Additional analytics can be added here
      recentActivity: {
        last24Hours: approvedPosts.filter((post: ForumPost) => {
          const postDate = 'toDate' in post.createdAt ? post.createdAt.toDate() : new Date(post.createdAt);
          const now = new Date();
          const hoursDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);

          return hoursDiff <= 24;
        }).length,
        last7Days: approvedPosts.filter((post: ForumPost) => {
          const postDate = 'toDate' in post.createdAt ? post.createdAt.toDate() : new Date(post.createdAt);
          const now = new Date();
          const daysDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);

          return daysDiff <= 7;
        }).length,
      },
      categoryBreakdown: approvedPosts.reduce<Record<string, number>>((acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;

        return acc;
      }, {})
    };
    
    console.log('[Analytics API] Analytics calculated successfully');
    
    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error: unknown) {
    console.error('[Analytics API] Error getting analytics:', error);

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}); 