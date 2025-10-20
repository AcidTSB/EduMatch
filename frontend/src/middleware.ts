import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!token;
  
  // Get user role from cookies
  let userRole = null;
  if (token) {
    try {
      const userData = request.cookies.get('auth_user')?.value;
      if (userData) {
        const user = JSON.parse(decodeURIComponent(userData));
        userRole = user.role;
      }
    } catch (error) {
      console.log('Error parsing user data:', error);
    }
  }

  // ===== REDIRECT AUTHENTICATED USERS FROM HOME PAGE =====
  // When authenticated users visit home page, redirect to their dashboard
  if (pathname === '/' && isAuthenticated && userRole) {
    switch (userRole) {
      case 'admin':
        return NextResponse.redirect(new URL('/admin', request.url));
      case 'provider':
        return NextResponse.redirect(new URL('/provider/dashboard', request.url));
      case 'applicant':
        return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
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
      // Redirect wrong role to their own dashboard
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userRole === 'applicant') {
        return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect applicant routes (except public scholarship browsing)
  if (pathname.startsWith('/applicant') && !isPublicScholarshipRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url));
    }
    if (userRole !== 'applicant') {
      // Redirect wrong role to their own dashboard
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userRole === 'provider') {
        return NextResponse.redirect(new URL('/provider/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url));
    }
    if (userRole !== 'admin') {
      // Redirect wrong role to their own dashboard
      if (userRole === 'provider') {
        return NextResponse.redirect(new URL('/provider/dashboard', request.url));
      } else if (userRole === 'applicant') {
        return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',  // Add home page to matcher for role-based redirect
    '/provider/:path*',
    '/applicant/:path*', 
    '/admin/:path*'
  ]
};