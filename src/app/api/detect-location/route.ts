import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code') ||
    request.headers.get('cloudfront-viewer-country');

  const city =
    request.headers.get('x-vercel-ip-city') ||
    request.headers.get('cf-ipcity');

  if (country && country !== 'XX' && country !== 'T1') {
    return NextResponse.json({
      countryCode: country.toUpperCase(),
      city: city || undefined,
    });
  }

  return NextResponse.json({ countryCode: null });
}
