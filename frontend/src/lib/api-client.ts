/**
 * API Client - Axios wrapper with JWT token interceptor
 * Tự động đính kèm JWT token vào mọi request
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// DEPRECATION NOTE: Prefer using src/lib/api.ts. This file remains for legacy imports.
const GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';

// Route all services through the API Gateway
const AUTH_API_URL = `${GATEWAY_URL}/api/auth`;
const SCHOLARSHIP_API_URL = `${GATEWAY_URL}/api/scholarships`;
const MATCHING_API_URL = `${GATEWAY_URL}/api/matching`;

/**
 * Create axios instance với interceptors
 */
function createApiClient(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
  });

  // REQUEST INTERCEPTOR - Tự động thêm JWT token
  instance.interceptors.request.use(
    (config) => {
      // Lấy token từ localStorage
  const token = localStorage.getItem('auth_token');
      
      if (token) {
        // Đính kèm token vào Authorization header
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`🔐 [API Client] Added token to ${config.method?.toUpperCase()} ${config.url}`);
      }
      
      return config;
    },
    (error) => {
      console.error('❌ [API Client] Request error:', error);
      return Promise.reject(error);
    }
  );

  // RESPONSE INTERCEPTOR - Xử lý response và errors
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`✅ [API Client] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
      return response;
    },
    (error) => {
      if (error.response) {
        const status = error.response.status;
        const url = error.config?.url;
        
        console.error(`❌ [API Client] ${error.config?.method?.toUpperCase()} ${url} - ${status}`);
        console.error('❌ [API Client] Error data:', error.response.data);
        
        // Handle specific error cases
        if (status === 401) {
          console.warn('⚠️ [API Client] Unauthorized - Token expired or invalid');
          // Optionally redirect to login or refresh token
          // window.location.href = '/auth/login';
        } else if (status === 403) {
          console.warn('⚠️ [API Client] Forbidden - Insufficient permissions');
        }
      } else if (error.request) {
        console.error('❌ [API Client] No response received:', error.request);
      } else {
        console.error('❌ [API Client] Error:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
}

// Create API clients for each service
export const authApiClient = createApiClient(AUTH_API_URL);
export const scholarshipApiClient = createApiClient(SCHOLARSHIP_API_URL);
export const matchingApiClient = createApiClient(MATCHING_API_URL);

// Export default client (auth)
export default authApiClient;

/**
 * Helper functions for common API operations
 */
export const apiClient = {
  auth: authApiClient,
  scholarship: scholarshipApiClient,
  matching: matchingApiClient,
  
  // Utility to get current token
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },
  
  // Utility to check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
  
  // Utility to clear auth data
  clearAuth: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_user');
  },
};
