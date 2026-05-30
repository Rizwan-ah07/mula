import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json([], { status: 200 });
  }

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'json');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', '5');
  url.searchParams.set('q', query);

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'mula-app/1.0',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json([], { status: 200 });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: 200 });
}
