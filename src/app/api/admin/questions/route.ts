import { NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/auth-api';
import { adminDb } from '@/lib/firebase-admin';

export const GET = withAdminAuth(async (request: AuthenticatedRequest) => {
  try {
    console.log('[Admin Questions API] Getting questions...');
    
    if (!adminDb) {
      console.error('[Admin Questions API] Database connection error');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection error',
          message: 'Failed to connect to database'
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, in_progress, completed
    const limit = parseInt(searchParams.get('limit') || '50');
    
    console.log('[Admin Questions API] Fetching questions with status:', status);
    
    let querySnapshot;
    try {
      if (status && status !== 'all') {
        querySnapshot = await adminDb.collection('questions')
          .where('status', '==', status)
          .orderBy('createdAt', 'desc')
          .get();
      } else {
        querySnapshot = await adminDb.collection('questions')
          .orderBy('createdAt', 'desc')
          .get();
      }
    } catch (firestoreError) {
      console.error('[Admin Questions API] Firestore error:', firestoreError);
      
      // In development, return empty results instead of failing
      if (process.env.NODE_ENV === 'development') {
        console.log('[Admin Questions API] Development mode: returning empty results due to Firestore error');
        return NextResponse.json({
          success: true,
          data: {
            questions: [],
            count: 0,
            totalCount: 0
          }
        });
      } else {
        throw new Error('Firestore query failed');
      }
    }
    const questions: Array<{
      id: string;
      question: string;
      contactType?: string;
      whatsappNumber?: string;
      email?: string;
      isPublic: boolean;
      status: string;
      genre?: string;
      genreConfidence?: number;
      requiresManualGenreReview?: boolean;
      priority?: string;
      assignedTo?: string;
      assignedAt?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
      createdAt: any; // eslint-disable-line @typescript-eslint/no-explicit-any
      updatedAt?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
      completedAt?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }> = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      questions.push({
        id: doc.id,
        question: data.question,
        contactType: data.contactType,
        whatsappNumber: data.whatsappNumber,
        email: data.email,
        isPublic: data.isPublic,
        status: data.status,
        genre: data.genre,
        genreConfidence: data.genreConfidence,
        requiresManualGenreReview: data.requiresManualGenreReview,
        priority: data.priority,
        assignedTo: data.assignedTo,
        assignedAt: data.assignedAt,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        completedAt: data.completedAt
      });
    });
    
    // Apply limit
    const limitedQuestions = questions.slice(0, limit);
    
    console.log('[Admin Questions API] Found', limitedQuestions.length, 'questions');
    
    return NextResponse.json({
      success: true,
      data: {
        questions: limitedQuestions,
        count: limitedQuestions.length,
        totalCount: questions.length
      }
    });
  } catch (error: unknown) {
    console.error('[Admin Questions API] Error getting questions:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get questions',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});
