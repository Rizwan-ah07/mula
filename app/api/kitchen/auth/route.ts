import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function secondsUntilEndOfDay(): number {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return Math.max(60, Math.floor((end.getTime() - now.getTime()) / 1000));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const pin = typeof body?.pin === 'string' ? body.pin.trim() : '';

  const expectedPin = process.env.KITCHEN_PIN ?? process.env.ADMIN_PASSWORD;
  if (!expectedPin) {
    return NextResponse.json({ error: 'Kitchen PIN is not configured' }, { status: 500 });
  }

  if (!pin || pin !== expectedPin) {
    return NextResponse.json({ error: 'Invalid pincode' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: 'kitchen_auth',
    value: expectedPin,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: secondsUntilEndOfDay(),
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: 'kitchen_auth',
    value: '',
    path: '/',
    maxAge: 0,
  });
  return response;
}
