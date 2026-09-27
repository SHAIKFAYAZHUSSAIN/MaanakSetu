import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, validSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const isAuth = await validSession(token);
  return NextResponse.json({
    authenticated: isAuth,
    role: isAuth ? 'officer' : 'guest',
    email: isAuth ? (process.env.AUTH_LOGIN_EMAIL || 'officer@maanaksetu.demo') : null,
  });
}
