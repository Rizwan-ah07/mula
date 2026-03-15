import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Ongeldig wachtwoord.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_auth', process.env.ADMIN_PASSWORD, {
    httpOnly: true,
    sameSite: 'strict',
    path:     '/',
    maxAge:   60 * 60 * 24, // 24 hours
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('admin_auth');
  return res;
}
