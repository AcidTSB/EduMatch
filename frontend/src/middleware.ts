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

  // Protect provider/employer routes (always require login)
  if (pathname.startsWith('/provider') || pathname.startsWith('/employer')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url));
    }
    // Accept legacy ('provider', 'employer') and new enum values ('PROVIDER', 'EMPLOYER')
    if (userRole !== 'provider' && userRole !== 'employer' && userRole !== 'PROVIDER' && userRole !== 'EMPLOYER') {
      // Redirect wrong role to their own dashboard
      if (userRole === 'admin' || userRole === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userRole === 'applicant' || userRole === 'user' || userRole === 'USER') {
        // send to user area
        return NextResponse.redirect(new URL('/user/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect applicant/user routes (except public scholarship browsing)
  if ((pathname.startsWith('/applicant') || pathname.startsWith('/user')) && !isPublicScholarshipRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url));
    }
    // Accept legacy ('applicant', 'user') and new enum value ('USER')
    if (userRole !== 'applicant' && userRole !== 'user' && userRole !== 'USER') {
      // Redirect wrong role to their own dashboard
      if (userRole === 'admin' || userRole === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userRole === 'provider' || userRole === 'employer' || userRole === 'EMPLOYER') {
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
      if (userRole === 'provider' || userRole === 'employer' || userRole === 'EMPLOYER') {
        return NextResponse.redirect(new URL('/employer/dashboard', request.url));
      } else if (userRole === 'applicant' || userRole === 'user' || userRole === 'USER') {
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