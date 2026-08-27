import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const payload = verifySessionToken(sessionCookie);
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: payload.email,
      role: payload.role,
    },
  });
}
