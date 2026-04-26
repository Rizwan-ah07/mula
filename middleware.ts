import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();

    const cookie = request.cookies.get('admin_auth')?.value;
    if (!process.env.ADMIN_PASSWORD || cookie !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/kitchen') || pathname.startsWith('/chef')) {
    if (pathname === '/kitchen/login') return NextResponse.next();

    const expectedPin = process.env.KITCHEN_PIN ?? process.env.ADMIN_PASSWORD;
    const cookie = request.cookies.get('kitchen_auth')?.value;

    if (!expectedPin || cookie !== expectedPin) {
      const loginUrl = new URL('/kitchen/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/(.*)', '/kitchen', '/kitchen/(.*)', '/chef', '/chef/(.*)'],
};
