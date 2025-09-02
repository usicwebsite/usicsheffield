import { NextRequest, NextResponse } from 'next/server';
import { clearRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const { clientIP, endpoint } = await request.json();
    
    if (!clientIP || !endpoint) {
      return NextResponse.json(
        { error: 'Missing clientIP or endpoint' },
        { status: 400 }
      );
    }

    // Clear rate limit for the specified IP and endpoint
    clearRateLimit(clientIP, endpoint);

    return NextResponse.json({
      success: true,
      message: `Rate limit cleared for ${clientIP}:${endpoint}`
    });
  } catch (error) {
    console.error('Failed to clear rate limit:', error);
    return NextResponse.json(
      { error: 'Failed to clear rate limit' },
      { status: 500 }
    );
  }
}
