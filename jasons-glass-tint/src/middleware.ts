import { NextResponse, type NextRequest } from 'next/server';

// The admin upload pages have no login, and the public site no longer reads the
// images they manage (see src/lib/siteImageSnapshot.ts). Hide them on the live
// site; they still run under `next dev` for local editing.
export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.rewrite(new URL('/_not-found', req.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin-gallery/:path*', '/admin-hero-layout/:path*'] };
