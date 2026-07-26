import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    // In a real production app, use hashed passwords and a database.
    // For this hackathon demo, we use a simple hardcoded password.
    if (password === 'backblaze2026') {
      const response = NextResponse.json({ success: true });
      
      // Set an HttpOnly cookie to persist the login session
      response.cookies.set({
        name: 'demo_auth',
        value: 'authenticated',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      
      return response;
    } else {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
