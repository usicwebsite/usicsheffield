import { NextResponse } from 'next/server';
import { AuthenticatedRequest } from '@/lib/auth-api';
import { approvePost } from '@/lib/firebase-admin-utils';

export async function POST(request: AuthenticatedRequest) {
  try {
    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing postId',
          message: 'Post ID is required'
        },
        { status: 400 }
      );
    }

    await approvePost(postId, request.admin.uid);
    
    return NextResponse.json({
      success: true,
      data: {
        postId,
        approvedBy: request.admin.uid,
        approvedAt: new Date().toISOString()
      }
    });
  } catch (error: unknown) {
    console.error('[Approve Post API] Error approving post:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to approve post',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 