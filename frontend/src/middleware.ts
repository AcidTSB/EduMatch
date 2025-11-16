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
    '/applicant/scholarships', // Legacy support
    '/applicant/scholarships/', // Legacy support
    '/user/scholarships',
    '/user/scholarships/'
  ];
  
  const isPublicScholarshipRoute = publicScholarshipRoutes.some(route => 
    pathname.startsWith(route) && !pathname.includes('/applications')
  );

  // Protect employer routes (always require login)
  // Support legacy '/provider' path for backward compatibility
  if (pathname.startsWith('/provider') || pathname.startsWith('/employer')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url));
    }
    // Backend only returns 'employer' role (from ROLE_EMPLOYER)
    if (userRole !== 'employer') {
      // Redirect wrong role to their own dashboard
      if (userRole === 'admin' || userRole === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userRole === 'user') {
        return NextResponse.redirect(new URL('/user/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect user routes (except public scholarship browsing)
  // Support legacy '/applicant' path for backward compatibility
  if ((pathname.startsWith('/applicant') || pathname.startsWith('/user')) && !isPublicScholarshipRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url));
    }
    // Backend only returns 'user' role (from ROLE_USER)
    if (userRole !== 'user') {
      // Redirect wrong role to their own dashboard
      if (userRole === 'admin' || userRole === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userRole === 'employer') {
        return NextResponse.redirect(new URL('/employer/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url));
    }
    if (userRole !== 'admin' && userRole !== 'ADMIN') {
      // Redirect wrong role to their own dashboard
      if (userRole === 'employer') {
        return NextResponse.redirect(new URL('/employer/dashboard', request.url));
      } else if (userRole === 'user') {
        return NextResponse.redirect(new URL('/user/dashboard', request.url));
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