// File: src/services/auth.service.ts (NỘI DUNG MỚI - DÙNG AXIOS THẬT)

import { authApi } from '@/lib/api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // sex removed - backend không hỗ trợ
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  refreshToken?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  enabled: boolean;
}

export const authService = {
  /**
   * Login - POST /signin
   */
  login: async (data: LoginCredentials): Promise<LoginResponse & { user: UserResponse }> => {
    try {
      console.log('🔐 [AuthService] Login attempt with REAL API...');
      console.log('📤 Request payload:', { username: data.email, password: '***' });
      
      // Step 1: Login to get token - ENDPOINT: /signin (KHÔNG PHẢI /auth/login)
      const loginResponse = await authApi.post<LoginResponse>('signin', {
        username: data.email, // Backend expects 'username' field
        password: data.password,
      });
      
      console.log('✅ [AuthService] Login successful, token received');
      
      // Save token immediately (localStorage + cookie for middleware)
      if (loginResponse.data.accessToken) {
        const token = loginResponse.data.accessToken;
        localStorage.setItem('auth_token', token);
        if (loginResponse.data.refreshToken) {
          localStorage.setItem('refresh_token', loginResponse.data.refreshToken);
        }
        // Also set cookie for Edge middleware
        if (typeof document !== 'undefined') {
          document.cookie = `auth_token=${token}; Path=/; Max-Age=86400`;
        }
      }
      
        // Step 2: Get user info - ENDPOINT: /me (baseURL is /api/auth)
      console.log('👤 [AuthService] Fetching user info...');
        const userResponse = await authApi.get<UserResponse>('me');
      
      console.log('📝 [AuthService] User info retrieved:', userResponse.data);
      
      // Save user info (localStorage + cookie for middleware)
      const userStr = JSON.stringify(userResponse.data);
      localStorage.setItem('user', userStr);
      localStorage.setItem('auth_user', userStr);
      if (typeof document !== 'undefined') {
        document.cookie = `auth_user=${encodeURIComponent(userStr)}; Path=/; Max-Age=86400`;
      }
      
      return {
        ...loginResponse.data,
        user: userResponse.data,
      };
    } catch (error: any) {
      console.error('❌ [AuthService] Login failed:', error);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Response status:', error.response?.status);
      
      // Throw lại error với message rõ ràng
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Invalid credentials';
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Register - POST /signup
   */
  register: async (data: RegisterCredentials): Promise<LoginResponse & { user: UserResponse }> => {
    try {
      console.log('📝 [AuthService] Register attempt with REAL API...');
      console.log('📤 [AuthService] Sending registration data:', {
        username: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: '***',
      });
      
      // Step 1: Register - ENDPOINT: /signup (KHÔNG PHẢI /auth/register)
      const registerResponse = await authApi.post<LoginResponse>('signup', {
        username: data.email, // Use email as username
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        // Backend KHÔNG có trường sex - đã remove
      });
      
      console.log('✅ [AuthService] Registration successful, token received:', registerResponse.data);
      
      // Save token immediately (localStorage + cookie)
      if (registerResponse.data.accessToken) {
        const token = registerResponse.data.accessToken;
        localStorage.setItem('auth_token', token);
        if (registerResponse.data.refreshToken) {
          localStorage.setItem('refresh_token', registerResponse.data.refreshToken);
        }
        if (typeof document !== 'undefined') {
          document.cookie = `auth_token=${token}; Path=/; Max-Age=86400`;
        }
      }
      
        // Step 2: Get user info
      console.log('👤 [AuthService] Fetching user info with token...');
        const userResponse = await authApi.get<UserResponse>('me');
      
      console.log('✅ [AuthService] User info retrieved:', userResponse.data);
      
      // Save user info (localStorage + cookie)
      const userStr = JSON.stringify(userResponse.data);
      localStorage.setItem('user', userStr);
      localStorage.setItem('auth_user', userStr);
      if (typeof document !== 'undefined') {
        document.cookie = `auth_user=${encodeURIComponent(userStr)}; Path=/; Max-Age=86400`;
      }
      
      return {
        ...registerResponse.data,
        user: userResponse.data,
      };
    } catch (error: any) {
      console.error('❌ [AuthService] Registration failed:', error);
      console.error('📝 [AuthService] Error response:', error.response?.data);
      console.error('📝 [AuthService] Error message:', error.message);
      
      // Extract error message from backend
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Đăng ký thất bại';
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    try {
  await authApi.post('logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_user');
      if (typeof document !== 'undefined') {
        // Clear cookies
        document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'auth_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await authApi.get<UserResponse>('me');
    return response.data;
  },

  /**
   * Get user role from stored user data
   */
  getUserRole: (): string | null => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user: UserResponse = JSON.parse(userStr);
      if (!user.roles || user.roles.length === 0) return null;
      
      // Return first role and remove 'ROLE_' prefix
      // Example: 'ROLE_ADMIN' -> 'admin'
      return user.roles[0].replace('ROLE_', '').toLowerCase();
    } catch {
      return null;
    }
  },

  /**
   * Get stored user
   */
  getStoredUser: (): UserResponse | null => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
};
