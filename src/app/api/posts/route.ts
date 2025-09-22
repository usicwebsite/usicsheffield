import { NextResponse } from 'next/server';
import { withAuth, UserAuthenticatedRequest } from '@/lib/auth-api';
import { createPost } from '@/lib/firebase-admin-utils';
import { categoryUtils } from '@/lib/static-data';

export const POST = withAuth(async (request: UserAuthenticatedRequest) => {
  try {
    const body = await request.json();
    const { title, content, category, author, authorId } = body;

    // Validate required fields
    if (!title || !content || !category || !author || !authorId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'Title, content, category, author, and authorId are required'
      }, { status: 400 });
    }

    // Validate field lengths and formats
    if (title.length < 5 || title.length > 200) {
      return NextResponse.json({
        success: false,
        error: 'Invalid title length',
        message: 'Title must be between 5 and 200 characters'
      }, { status: 400 });
    }

    if (content.length < 10 || content.length > 10000) {
      return NextResponse.json({
        success: false,
        error: 'Invalid content length',
        message: 'Content must be between 10 and 10,000 characters'
      }, { status: 400 });
    }

    if (author.length < 1 || author.length > 100) {
      return NextResponse.json({
        success: false,
        error: 'Invalid author length',
        message: 'Author name must be between 1 and 100 characters'
      }, { status: 400 });
    }

    if (!authorId || authorId.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid author ID',
        message: 'Author ID is required'
      }, { status: 400 });
    }

    // Validate category
    const validCategories = categoryUtils.getCategoryIds();
    if (!validCategories.includes(category)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category',
        message: 'Please select a valid category'
      }, { status: 400 });
    }

    // Create the post
    const postId = await createPost({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      authorId: authorId.trim(),
      category
    });

    return NextResponse.json({
      success: true,
      data: {
        postId,
        message: 'Post submitted for approval successfully!'
      }
    });

  } catch (error) {
    console.error('[Posts API] Error creating post:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: errorMessage
    }, { status: 500 });
  }
});
