import { NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/auth-api';
import { getSubmittedPosts, getAllPosts, ForumPost } from '@/lib/firebase-utils';

// Get submitted posts for admin approval
async function getSubmittedPostsHandler(request: AuthenticatedRequest) {
  try {
    console.log('[Admin Posts API] Getting submitted posts...');
    console.log('[Admin Posts API] Current admin UID:', request.admin.uid);

    console.log('[Admin Posts API] About to call getSubmittedPosts...');
    const posts = await getSubmittedPosts(50);
    console.log('[Admin Posts API] getSubmittedPosts returned:', typeof posts);
    console.log('[Admin Posts API] Posts is array?', Array.isArray(posts));

    console.log('[Admin Posts API] Found', posts.length, 'submitted posts');
    console.log('[Admin Posts API] Posts data:', posts.map((p: ForumPost) => ({ id: p.id, title: p.title, author: p.author })));

    const responseData = {
      success: true,
      data: {
        posts,
        count: posts.length
      }
    };

    console.log('[Admin Posts API] Response data:', responseData);

    return NextResponse.json(responseData);
  } catch (error: unknown) {
    console.error('[Admin Posts API] Error getting submitted posts:', error);
    console.error('[Admin Posts API] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code,
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get submitted posts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get all posts (approved and pending) for admin view
async function getAllPostsHandler(request: AuthenticatedRequest) {
  try {
    console.log('[Admin Posts API] Getting all posts...');
    console.log('[Admin Posts API] Current admin UID:', request.admin.uid);

    const allPosts = await getAllPosts(100);

    const approvedPosts = allPosts.filter((post: ForumPost) => post.isApproved);
    const pendingPosts = allPosts.filter((post: ForumPost) => !post.isApproved);

    console.log('[Admin Posts API] Found', allPosts.length, 'total posts');

    return NextResponse.json({
      success: true,
      data: {
        posts: allPosts,
        approvedCount: approvedPosts.length,
        pendingCount: pendingPosts.length,
        totalCount: allPosts.length
      }
    });
  } catch (error: unknown) {
    console.error('[Admin Posts API] Error getting all posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get posts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(async (request: AuthenticatedRequest) => {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'submitted' || type === 'pending') {
    return getSubmittedPostsHandler(request);
  } else {
    return getAllPostsHandler(request);
  }
});

// Temporary test endpoint to create a sample post (no auth required for testing)
export const POST = async () => {
  try {
    console.log('[Admin Posts API] Creating test post...');

    const testPost = {
      title: "Test Post for Debugging",
      content: "This is a test post to verify the submitted_posts collection works",
      author: "Test Admin",
      authorId: "admin123",
      category: "GENERAL",
      tags: ["test", "debug"],
      likes: 0,
      views: 0,
      isPinned: false,
      isLocked: false,
      isApproved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('[Admin Posts API] Test post data:', testPost);

    const { addDoc, collection, getFirestore } = await import('firebase/firestore');
    const db = getFirestore();
    const submittedPostsRef = collection(db, 'submitted_posts');

    console.log('[Admin Posts API] About to add test post to submitted_posts...');
    const docRef = await addDoc(submittedPostsRef, testPost);
    console.log('[Admin Posts API] Test post created with ID:', docRef.id);

    return NextResponse.json({
      success: true,
      message: 'Test post created successfully',
      postId: docRef.id,
      post: testPost
    });

  } catch (error: unknown) {
    console.error('[Admin Posts API] Error creating test post:', error);
    console.error('[Admin Posts API] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code,
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create test post',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}; 