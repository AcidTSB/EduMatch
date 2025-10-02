import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // TEMPORARY: Disable middleware for debugging
  return NextResponse.next();
  
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!token;
  
  // Debug logging
  console.log('Middleware debug:', { 
    pathname, 
    hasToken: !!token,
    tokenLength: token?.length || 0,
    allCookies: request.cookies.getAll().map(c => c.name)
  });
  
  // Get user role from cookies
  let userRole = null;
  if (token) {
    try {
      const userData = request.cookies.get('auth_user')?.value;
      if (userData) {
        const user = JSON.parse(decodeURIComponent(userData!));
        userRole = user.role;
        console.log('User role from cookie:', userRole);
      }
    } catch (error) {
      console.log('Error parsing user data:', error);
      // Invalid user data
    }
  }

  // Allow public access to scholarships list and details for browsing
  const publicScholarshipRoutes = [
    '/applicant/scholarships',
    '/applicant/scholarships/'
  ];
  
  const isPublicScholarshipRoute = publicScholarshipRoutes.some(route => 
    pathname.startsWith(route) && !pathname.includes('/applications')
  );

  // Protect provider routes (always require login)
  if (pathname.startsWith('/provider')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url));
    }
    if (userRole !== 'provider') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect applicant routes (except public scholarship browsing)
  if (pathname.startsWith('/applicant') && !isPublicScholarshipRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url));
    }
    if (userRole !== 'applicant') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url));
    }
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/provider/:path*',
    '/applicant/:path*', 
    '/admin/:path*'
  ]
};