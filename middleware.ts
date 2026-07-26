import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect /studio and /gallery routes
  if (request.nextUrl.pathname.startsWith('/studio') || request.nextUrl.pathname.startsWith('/gallery')) {
    const authCookie = request.cookies.get('demo_auth');

    if (!authCookie || authCookie.value !== 'authenticated') {
      // Redirect to login if cookie is missing or invalid
      const loginUrl = new URL('/login', request.url);
      // Optional: pass the original URL as a redirect parameter
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow access to all other routes
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/studio/:path*',
    '/gallery/:path*',
  ],
};
