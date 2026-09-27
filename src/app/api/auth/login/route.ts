import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'node:crypto';
import { createSession, SESSION_COOKIE } from '@/lib/session';
export const runtime = 'nodejs';
const digest = (value: string) => createHash('sha256').update(value).digest();
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (origin && origin !== req.nextUrl.origin) {
    const isLocal =
      (origin.includes('localhost') || origin.includes('127.0.0.1')) &&
      (host?.includes('localhost') || host?.includes('127.0.0.1'));
    const isVercel = origin.includes('vercel.app') || (host ? origin.includes(host) : false);
    if (!isLocal && !isVercel) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 403 });
    }
  }
  const email = process.env.AUTH_LOGIN_EMAIL || 'officer@maanaksetu.demo';
  const password = process.env.AUTH_LOGIN_PASSWORD || 'password';
  try {
    const body = await req.json();
    if (typeof body.email !== 'string' || typeof body.password !== 'string' || body.email.length > 254 || body.password.length > 256) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
    const emailMatches = timingSafeEqual(digest(body.email.trim().toLowerCase()), digest(email.toLowerCase()));
    const passwordMatches = timingSafeEqual(digest(body.password), digest(password));
    if (!emailMatches || !passwordMatches) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    const response = NextResponse.json({ success: true });
    response.headers.set('Cache-Control', 'no-store');
    response.cookies.set(SESSION_COOKIE, await createSession(), { httpOnly: true, secure: req.nextUrl.protocol === 'https:', sameSite: 'lax', path: '/', maxAge: 8 * 60 * 60 });
    return response;
  } catch { return NextResponse.json({ error: 'Unable to sign in. Please try again.' }, { status: 400 }); }
}
