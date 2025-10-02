'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { cn } from '@/lib/utils';

// Mock auth hook - replace with actual auth
const useAuth = () => {
  const router = useRouter();
  
  const getStoredUser = () => {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    const userData = localStorage.getItem('user_data');
    
    if (!token) return null;
    
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (e) {
        // fallback to basic user data
      }
    }
    
    return {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      role: role || 'applicant' as 'applicant' | 'provider' | 'admin',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    };
  };
  
  return {
    user: getStoredUser(),
    isAuthenticated: typeof window !== 'undefined' && localStorage.getItem('auth_token') !== null,
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_data');
      }
      router.push('/');
    }
  };
};

const publicNavigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
];

const applicantNavigation = [
  { name: 'Dashboard', href: '/applicant/dashboard' },
  { name: 'Scholarships', href: '/applicant/scholarships' },
  { name: 'Applications', href: '/applicant/applications' },
  { name: 'Messages', href: '/messages' },
  { name: 'Profile', href: '/applicant/profile' },
];

const providerNavigation = [
  { name: 'Dashboard', href: '/provider/dashboard' },
  { name: 'My Scholarships', href: '/provider/scholarships' },
  { name: 'Applications', href: '/provider/applications' },
  { name: 'Messages', href: '/messages' },
  { name: 'Analytics', href: '/provider/analytics' },
];

const adminNavigation = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Scholarships', href: '/admin/scholarships' },
  { name: 'Messages', href: '/messages' },
  { name: 'Reports', href: '/admin/reports' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  // Prevent hydration mismatch by only showing dynamic content after hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const getNavigation = () => {
    // Show public navigation on server-side and before hydration
    if (!isHydrated || !isAuthenticated) return publicNavigation;
    
    switch (user?.role) {
      case 'provider':
        return providerNavigation;
      case 'admin':
        return adminNavigation;
      default:
        return applicantNavigation;
    }
  };

  const navigation = getNavigation();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl text-foreground">EduMatch</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-brand-blue-50 text-brand-blue-700"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {isHydrated && isAuthenticated ? (
              <>
                {/* Notifications */}
                <NotificationDropdown />

                {/* User Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                      <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </Button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-background border rounded-lg shadow-elevated py-1 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      
                      <Link
                        href={`/${user?.role}/profile`}
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      
                      <Link
                        href={`/${user?.role}/settings`}
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      
                      <div className="border-t my-1" />
                      
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-base font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-brand-blue-50 text-brand-blue-700"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-4 border-t space-y-2">
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start">
                    <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
              
              {isAuthenticated && (
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center px-3 py-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                      <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link 
                      href={`/${user?.role}/profile`} 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </Button>
                  
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link 
                      href={`/${user?.role}/settings`} 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-danger-600"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click overlay to close menus */}
      {(isMobileMenuOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
}