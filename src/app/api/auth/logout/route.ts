import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (sessionCookie) {
      // Clear the session cookie
      cookieStore.delete('session');
    } else {
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
