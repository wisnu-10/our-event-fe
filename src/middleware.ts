import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface JwtPayload {
  id?: string;
  role?: string;
  exp?: number;
}

function decodePayload(token: string): JwtPayload | null {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const json = Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function getAuth(req: NextRequest): { loggedIn: boolean; role?: string } {
  const token =
    req.cookies.get('accessToken')?.value ??
    req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return { loggedIn: false };
  const payload = decodePayload(token);
  if (!payload || !payload.exp || payload.exp * 1000 < Date.now()) {
    return { loggedIn: false };
  }
  return { loggedIn: true, role: payload.role };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = getAuth(req);

  if (pathname.startsWith('/orders')) {
    if (!auth.loggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (auth.loggedIn && auth.role !== 'CUSTOMER') {
        const url = req.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }
    if (!auth.loggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    if (auth.role === 'CUSTOMER' || !auth.role) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith('/dashboard/users') && auth.role !== 'SUPERADMIN') {
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith('/auth/')) {
    if (auth.loggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = auth.role !== 'CUSTOMER' ? '/dashboard' : '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/orders/:path*', '/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
};
