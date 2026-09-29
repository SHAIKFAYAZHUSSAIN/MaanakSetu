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
    // Allow /login to render so it can display active session or login form
    return NextResponse.next();
  }

  // Allow all prototype routes without forced login redirects
  return NextResponse.next();
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

