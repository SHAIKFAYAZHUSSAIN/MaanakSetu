import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/session';
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (origin && origin !== req.nextUrl.origin) {
    const isLocal = (origin.includes('localhost') || origin.includes('127.0.0.1')) && (host?.includes('localhost') || host?.includes('127.0.0.1'));
    if (!isLocal && !origin.includes(host || '')) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 403 });
    }
  }
  const response = NextResponse.redirect(new URL('/login', req.url), 303);
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', secure: req.nextUrl.protocol === 'https:', path: '/', maxAge: 0 });
  return response;
}
