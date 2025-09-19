import { NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/auth-api';
import { createPost } from '@/lib/firebase-utils';

export const POST = withAdminAuth(async (request: AuthenticatedRequest) => {
  try {
    
    const body = await request.json();
    const { title, content, author, authorId, category } = body;
    
    if (!title || !content || !author || !authorId || !category) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields',
          message: 'Title, content, author, authorId, and category are required' 
        },
        { status: 400 }
      );
    }
    
    
    await createPost({
      title,
      content,
      author,
      authorId,
      category,
    });
    
    
    return NextResponse.json({
      success: true,
      data: {
        title,
        author,
        category
      }
    });
  } catch (error: unknown) {
    console.error('[Seed Posts API] Error creating post:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create post',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});
