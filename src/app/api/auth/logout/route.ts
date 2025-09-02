import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    console.log('[Logout API] Starting logout process...');

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (sessionCookie) {
      // Clear the session cookie
      cookieStore.delete('session');
      console.log('[Logout API] ✅ Session cookie cleared');
    } else {
      console.log('[Logout API] No session cookie found');
    }

    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('[Logout API] ❌ Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
