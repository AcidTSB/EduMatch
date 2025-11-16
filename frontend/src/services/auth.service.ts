// File: src/services/auth.service.ts (Using fetch API with smart fallback)

import { apiWrapper } from '@/lib/api-wrapper';
import { mockApi } from '@/lib/mock-data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
const AUTH_API_URL = `${API_BASE_URL}/api/auth`;

// Helper: Decode JWT token and extract roles
const decodeJWT = (token: string): { roles: string[] } | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    // JWT has roles as "USER,ADMIN,EMPLOYER" string
    const rolesStr = decoded.roles || '';
    const roles = rolesStr.split(',').map((r: string) => r.trim()).filter(Boolean);
    return { roles };
  } catch (error) {
    return null;
  }
};

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
  sex: 'MALE' | 'FEMALE' | 'OTHER';
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
  login: async (data: LoginCredentials): Promise<LoginResponse & { user: UserResponse }> => {
    try {
      const loginData = await apiWrapper<LoginResponse>(
        `${AUTH_API_URL}/signin`,
        {
          method: 'POST',
          body: JSON.stringify({
            username: data.email,
            password: data.password,
          }),
        },
        async () => {
          const mockResponse = await mockApi.auth.login({
            email: data.email,
            password: data.password,
          });
          return {
            accessToken: mockResponse.data?.token || 'mock-token',
            tokenType: 'Bearer',
          };
        }
      );
      
      if (loginData.accessToken) {
        const token = loginData.accessToken;
        localStorage.setItem('auth_token', token);
        if (loginData.refreshToken) {
          localStorage.setItem('refresh_token', loginData.refreshToken);
        }
        if (typeof document !== 'undefined') {
          document.cookie = `auth_token=${token}; Path=/; Max-Age=86400`;
        }
      }
      
      const userData = await apiWrapper<UserResponse>(
        `${AUTH_API_URL}/me`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginData.accessToken}`,
          },
        },
        async () => {
          const mockResponse = await mockApi.auth.getCurrentUser();
          if (mockResponse.data) {
            // Map AuthUser from mock to UserResponse format
            const mockUser = mockResponse.data;
            return {
              id: parseInt(mockUser.id.replace(/\D/g, '')) || 1,
              username: mockUser.username,
              email: mockUser.email,
              firstName: mockUser.firstName,
              lastName: mockUser.lastName,
              roles: [mockUser.role], // Use actual role from mock user
              enabled: mockUser.enabled ?? true,
            };
          }
          return {
            id: 1,
            username: data.email,
            email: data.email,
            roles: ['USER'],
            enabled: true,
          };
        }
      );
      
      const tokenData = decodeJWT(loginData.accessToken);
      const roles = tokenData?.roles || userData.roles || ['USER'];
      
      const enrichedUser = {
        ...userData,
        roles,
        role: roles[0] || 'USER',
        enabled: true,
        firstName: userData.firstName || userData.username?.split(' ')[0] || userData.username,
        lastName: userData.lastName || userData.username?.split(' ').slice(1).join(' ') || '',
      };
      
      // Store user in localStorage for persistence
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(enrichedUser));
      }
      
      return {
        ...loginData,
        user: enrichedUser,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Invalid credentials');
    }
  },

  register: async (data: RegisterCredentials): Promise<LoginResponse & { user: UserResponse }> => {
    try {
      const registerData = await apiWrapper<LoginResponse>(
        `${AUTH_API_URL}/signup`,
        {
          method: 'POST',
          body: JSON.stringify({
            username: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            sex: data.sex,
          }),
        },
        async () => {
          const mockResponse = await mockApi.auth.register({
            email: data.email,
            name: `${data.firstName} ${data.lastName}`,
            password: data.password,
            role: 1,
          } as any);
          return {
            accessToken: mockResponse.data?.token || 'mock-token',
            tokenType: 'Bearer',
          };
        }
      );
      
      if (registerData.accessToken) {
        const token = registerData.accessToken;
        localStorage.setItem('auth_token', token);
        if (registerData.refreshToken) {
          localStorage.setItem('refresh_token', registerData.refreshToken);
        }
        if (typeof document !== 'undefined') {
          document.cookie = `auth_token=${token}; Path=/; Max-Age=86400`;
        }
      }
      
      const userData = await apiWrapper<UserResponse>(
        `${AUTH_API_URL}/me`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${registerData.accessToken}`,
          },
        },
        async () => {
          const mockResponse = await mockApi.auth.getCurrentUser();
          return mockResponse.data || {
            id: 1,
            username: data.email,
            email: data.email,
            roles: ['USER'],
            enabled: true,
            firstName: data.firstName,
            lastName: data.lastName,
          };
        }
      );
      
      const tokenData = decodeJWT(registerData.accessToken);
      const roles = tokenData?.roles || ['USER'];
      
      const enrichedUser = {
        ...userData,
        roles,
        role: roles[0] || 'USER',
        enabled: true,
        firstName: data.firstName,
        lastName: data.lastName,
      };
      
      return {
        ...registerData,
        user: enrichedUser,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Đăng ký thất bại');
    }
  },

  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await apiWrapper(
          `${AUTH_API_URL}/logout`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          },
          async () => {
            await mockApi.auth.logout();
            return {};
          }
        );
      }
    } catch (error) {
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('mock_current_user'); // Clear mock user
      if (typeof document !== 'undefined') {
        document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'auth_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const token = localStorage.getItem('auth_token');
    return await apiWrapper<UserResponse>(
      `${AUTH_API_URL}/me`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      },
      async () => {
        const mockResponse = await mockApi.auth.getCurrentUser();
        if (mockResponse.data) {
          // Map AuthUser from mock to UserResponse format
          const mockUser = mockResponse.data;
          return {
            id: parseInt(mockUser.id.replace(/\D/g, '')) || 1,
            username: mockUser.username,
            email: mockUser.email,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            roles: [mockUser.role], // Use actual role from mock user
            enabled: mockUser.enabled ?? true,
          };
        }
        return {
          id: 1,
          username: 'mockuser',
          email: 'mock@example.com',
          roles: ['USER'],
          enabled: true,
        };
      }
    );
  },

  getUserRole: (): string | null => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user: UserResponse = JSON.parse(userStr);
      if (!user.roles || user.roles.length === 0) return null;
      
      return user.roles[0].replace('ROLE_', '').toLowerCase();
    } catch {
      return null;
    }
  },

  getStoredUser: (): UserResponse | null => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
};
