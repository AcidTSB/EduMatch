/**
 * 🔐 AUTH SERVICE WITH AUTO-FALLBACK
 * =========================================
 * ✅ Real API when backend online
 * ✅ Mock data when backend offline
 * ✅ Seamless user experience
 * =========================================
 */

'use client';

import { apiWrapper } from '@/lib/api-wrapper';
import { mockApi } from '@/lib/mock-data';
import API_CONFIG from '@/lib/api-config';

const { AUTH } = API_CONFIG.ENDPOINTS;

// Helper: Decode JWT token and extract roles
const decodeJWT = (token: string): { roles: string[] } | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
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
  /**
   * 🔓 LOGIN
   */
  login: async (data: LoginCredentials): Promise<LoginResponse & { user: UserResponse }> => {
    try {
      const loginData = await apiWrapper<LoginResponse>(
        AUTH.SIGNIN,
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
          
          if (!mockResponse.success || !mockResponse.data) {
            throw new Error(mockResponse.error || 'Invalid credentials');
          }
          
          return {
            accessToken: mockResponse.data.token || 'mock-token-' + Date.now(),
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
        AUTH.ME,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginData.accessToken}`,
          },
        },
        async () => {
          const mockResponse = await mockApi.auth.getCurrentUser();
          if (!mockResponse.success || !mockResponse.data) {
            throw new Error(mockResponse.error || 'Not authenticated');
          }
          
          const mockUser = mockResponse.data;
          return {
            id: parseInt(mockUser.id.replace(/\D/g, '')) || 1,
            username: mockUser.username,
            email: mockUser.email,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            roles: [mockUser.role],
            enabled: mockUser.enabled ?? true,
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
      
      localStorage.setItem('user', JSON.stringify(enrichedUser));
      
      return {
        ...loginData,
        user: enrichedUser,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Invalid credentials');
    }
  },

  /**
   * 📝 REGISTER
   */
  register: async (data: RegisterCredentials): Promise<LoginResponse & { user: UserResponse }> => {
    try {
      const registerData = await apiWrapper<LoginResponse>(
        AUTH.SIGNUP,
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
          
          if (!mockResponse.success || !mockResponse.data) {
            throw new Error(mockResponse.error || 'Registration not implemented in mock');
          }
          
          return {
            accessToken: mockResponse.data.token || 'mock-token-' + Date.now(),
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
        AUTH.ME,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${registerData.accessToken}`,
          },
        },
        async () => {
          return {
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
      
      localStorage.setItem('user', JSON.stringify(enrichedUser));
      
      return {
        ...registerData,
        user: enrichedUser,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Đăng ký thất bại');
    }
  },

  /**
   * 🚪 LOGOUT
   */
  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await apiWrapper(
          AUTH.LOGOUT,
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
      // Ignore errors during logout
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('mock_current_user');
      if (typeof document !== 'undefined') {
        document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'auth_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
  },

  /**
   * 👤 GET CURRENT USER
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    const token = localStorage.getItem('auth_token');
    return await apiWrapper<UserResponse>(
      AUTH.ME,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      },
      async () => {
        const mockResponse = await mockApi.auth.getCurrentUser();
        
        if (!mockResponse.success || !mockResponse.data) {
          throw new Error(mockResponse.error || 'Not authenticated');
        }
        
        const mockUser = mockResponse.data;
        return {
          id: parseInt(mockUser.id.replace(/\D/g, '')) || 1,
          username: mockUser.username,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          roles: [mockUser.role],
          enabled: mockUser.enabled ?? true,
        };
      }
    );
  },

  /**
   * 🎭 GET USER ROLE
   */
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

  /**
   * 💾 GET STORED USER
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
