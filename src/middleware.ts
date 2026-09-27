import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, validSession } from './lib/session';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Immediately pass all Next.js internal paths, static files, and assets
  if (
    path.startsWith('/_next') ||
    path.startsWith('/favicon.ico') ||
    path.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Allow public endpoints (Home page, login, auth endpoints, public APIs)
  if (
    path === '/' ||
    path === '/login' ||
    path === '/api/auth/login' ||
    path === '/api/auth/logout' ||
    path === '/api/auth/status' ||
    path.startsWith('/api/v1/recommend') ||
    path.startsWith('/api/analyze')
  ) {
    // If authenticated user visits /login, redirect to dashboard /
    if (path === '/login') {
      const token = req.cookies.get(SESSION_COOKIE)?.value;
      if (token && (await validSession(token))) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    return NextResponse.next();
  }

  // 3. Check for valid session
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token && (await validSession(token))) {
    return NextResponse.next();
  }

  // 4. Return 401 JSON for unauthenticated API requests
  if (path.startsWith('/api/')) {
    return NextResponse.json({ error: 'Please sign in to continue.' }, { status: 401 });
  }

  // 5. Redirect unauthenticated page requests to /login
  return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next (all internal files, static chunks, HMR, data)
     * - favicon.ico
     * - static files with extensions (.svg, .png, .jpg, etc.)
     */
    '/((?!_next|favicon\\.ico|.*\\.[\\w]+$).*)',
  ],
};

