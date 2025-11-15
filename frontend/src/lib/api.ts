// File: src/lib/api.ts (NỘI DUNG MỚI - KILL MA MOCK DATA)

import axios from 'axios';

// Hàm helper để lấy token từ localStorage
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// Single gateway URL for all services (default to local nginx gateway)
const GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';

// Derive service base URLs from the gateway
const AUTH_BASE_URL = `${GATEWAY_URL}/api/auth`;

// ===================================
// === 1. Client cho AUTH SERVICE ===
// (Dùng để Đăng nhập, Đăng ký)
// ===================================
export const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
});

if (typeof window !== 'undefined') {
  // Helpful debug once
  // eslint-disable-next-line no-console
  console.log('🔗 [API] AUTH baseURL =', AUTH_BASE_URL);
}

// Gắn "bộ chặn" (interceptor) để tự động đính kèm token cho AUTH API
// NHƯNG KHÔNG gắn token cho các endpoint public (signin, signup, refresh)
authApi.interceptors.request.use(
  (config) => {
    // Danh sách các endpoint PUBLIC - KHÔNG CẦN TOKEN
    const publicNames = new Set(['signin', 'signup', 'refresh', 'forgot-password']);

    // Chuẩn hoá url để nhận diện endpoint cuối cùng
    const rawUrl = config.url || '';
    const noProto = rawUrl.replace(/^https?:\/\/[^/]+/i, '');
    const normalized = noProto.startsWith('/') ? noProto : `/${noProto}`;
    const lastSegment = normalized.split('?')[0].split('/').filter(Boolean).pop() || '';

    const isPublicEndpoint = publicNames.has(lastSegment);

    console.log('🔍 [Interceptor] Request to:', config.url, '| Public?', isPublicEndpoint);
    console.log('🔍 [Interceptor] Current headers:', JSON.stringify(config.headers));
    
    // CHỈ gắn token nếu KHÔNG PHẢI endpoint public
    if (!isPublicEndpoint) {
      const token = getAuthToken();
      console.log('🔑 [Interceptor] Adding token to request:', token ? 'Yes' : 'No');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } else {
      console.log('🚫 [Interceptor] Skipping token for public endpoint');
      // XÓA Authorization header nếu có
      if (config.headers) {
        delete config.headers['Authorization'];
        delete config.headers['authorization'];
        console.log('🗑️ [Interceptor] Deleted Authorization header');
      }
    }
    
    console.log('🔍 [Interceptor] Final headers:', JSON.stringify(config.headers));
    return config;
  },
  (error) => Promise.reject(error)
);

// =======================================
// === 2. Client cho SCHOLARSHIP SERVICE ===
// (Dùng để lấy Học bổng, Nộp đơn, Bookmark)
// =======================================
export const scholarshipApi = axios.create({
  baseURL: `${GATEWAY_URL}/api/scholarships`,
});

// Gắn "bộ chặn" (interceptor) để tự động đính kèm token
scholarshipApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================
// === 3. Client cho MATCHING SERVICE ===
// (Dùng để lấy điểm Match, Gợi ý)
// =====================================
export const matchingApi = axios.create({
  baseURL: `${GATEWAY_URL}/api/matching`,
});

// Optional: Notification service client (kept for future wiring)
export const notificationApi = axios.create({
  baseURL: `${GATEWAY_URL}/api/notifications`,
});

// Expose the resolved base for quick diagnostics in the browser
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('🔗 [API] GATEWAY_URL =', GATEWAY_URL);
}

// Gắn "bộ chặn" (interceptor) để tự động đính kèm token
matchingApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
