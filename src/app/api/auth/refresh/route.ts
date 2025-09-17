import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    let sessionData;
    try {
      sessionData = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Verify the session is still valid (you might want to add more sophisticated checks)
    if (!sessionData.uid || !sessionData.email) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 401 }
      );
    }

    // Extend the session
    const updatedSessionData = {
      ...sessionData,
      lastRefresh: new Date().toISOString(),
    };

    // Update the session cookie
    cookieStore.set('session', JSON.stringify(updatedSessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: updatedSessionData,
      message: 'Session refreshed successfully'
    });

  } catch (error) {
    console.error('[Refresh API] ❌ Refresh error:', error);
    return NextResponse.json(
      { error: 'Session refresh failed' },
      { status: 500 }
    );
  }
}
