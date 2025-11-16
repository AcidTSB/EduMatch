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
      // Invalid user data in cookies
    }
  }

  // Allow public access to scholarships list and details for browsing
  // Support both legacy and new route names (applicant -> user)
  const publicScholarshipRoutes = [
    '/applicant/scholarships',
    '/applicant/scholarships/',
    '/user/scholarships',
    '/user/scholarships/'
  ];
  
  const isPublicScholarshipRoute = publicScholarshipRoutes.some(route => 
    pathname.startsWith(route) && !pathname.includes('/applications')
  );

  // Protect provider/employer routes (always require login)
  if (pathname.startsWith('/provider') || pathname.startsWith('/employer')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url));
    }
    // Accept legacy and new role names: 'provider' or 'employer'
    if (userRole !== 'provider' && userRole !== 'employer') {
      // Redirect wrong role to their own dashboard
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userRole === 'applicant' || userRole === 'user') {
        // send applicant/user to applicant/user area
        const dest = (userRole === 'user') ? '/user/dashboard' : '/applicant/dashboard';
        return NextResponse.redirect(new URL(dest, request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect applicant/user routes (except public scholarship browsing)
  if ((pathname.startsWith('/applicant') || pathname.startsWith('/user')) && !isPublicScholarshipRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url));
    }
    // Accept legacy and new role names: 'applicant' or 'user'
    if (userRole !== 'applicant' && userRole !== 'user') {
      // Redirect wrong role to their own dashboard
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userRole === 'provider' || userRole === 'employer') {
        const dest = (userRole === 'employer') ? '/employer/dashboard' : '/provider/dashboard';
        return NextResponse.redirect(new URL(dest, request.url));
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
      if (userRole === 'provider' || userRole === 'employer') {
        const dest = (userRole === 'employer') ? '/employer/dashboard' : '/provider/dashboard';
        return NextResponse.redirect(new URL(dest, request.url));
      } else if (userRole === 'applicant' || userRole === 'user') {
        const dest = (userRole === 'user') ? '/user/dashboard' : '/applicant/dashboard';
        return NextResponse.redirect(new URL(dest, request.url));
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
    '/employer/:path*',
    '/applicant/:path*', 
    '/user/:path*',
    '/admin/:path*'
  ]
};