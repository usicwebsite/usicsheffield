import { NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/auth-api';
import { getSubmittedPosts, getAllPosts, ForumPost } from '@/lib/firebase-admin-utils';
import { categoryUtils } from '@/lib/static-data';

// Get submitted posts for admin approval
async function getSubmittedPostsHandler() {
  try {
    const posts = await getSubmittedPosts(50);

    const responseData = {
      success: true,
      data: {
        posts,
        count: posts.length
      }
    };


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
async function getAllPostsHandler() {
  try {

    const allPosts = await getAllPosts(100);

    const approvedPosts = allPosts.filter((post: ForumPost) => post.isApproved);
    const pendingPosts = allPosts.filter((post: ForumPost) => !post.isApproved);


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
    return getSubmittedPostsHandler();
  } else {
    return getAllPostsHandler();
  }
});

// Temporary test endpoint to create a sample post (no auth required for testing)
export const POST = async () => {
  try {

    const testPost = {
      title: "Test Post for Debugging",
      content: "This is a test post to verify the submitted_posts collection works",
      author: "Test Admin",
      authorId: "admin123",
      category: categoryUtils.getCategoryIds()[0],
      likes: 0,
      views: 0,
      isPinned: false,
      isLocked: false,
      isApproved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };


    const { addDoc, collection, getFirestore } = await import('firebase/firestore');
    const db = getFirestore();
    const submittedPostsRef = collection(db, 'submitted_posts');

    const docRef = await addDoc(submittedPostsRef, testPost);

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