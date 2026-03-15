import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page through
  if (pathname === '/admin/login') return NextResponse.next();

  const cookie = request.cookies.get('admin_auth')?.value;
  if (!process.env.ADMIN_PASSWORD || cookie !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/(.*)'],
};
