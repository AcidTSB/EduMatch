/**
 * 🔥 ENHANCED API WRAPPER WITH AUTO-FALLBACK TO MOCK DATA
 * ============================================================
 * ✅ Auto-detects backend offline/errors
 * ✅ Seamlessly switches to mock-data
 * ✅ Preserves UI/UX - no error screens
 * ✅ Health check monitoring
 * ============================================================
 */

'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081';
const ENABLE_MOCK_FALLBACK = process.env.NEXT_PUBLIC_ENABLE_MOCK_FALLBACK !== 'false';
const REQUEST_TIMEOUT = 10000; // 10 seconds

let backendStatus: 'online' | 'offline' | 'unknown' = 'unknown';
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

interface FetchOptions extends RequestInit {
  skipFallback?: boolean;
  timeout?: number;
}

/**
 * 🎯 DETECT BACKEND OFFLINE ERRORS
 */
function isBackendOffline(error: any): boolean {
  if (!ENABLE_MOCK_FALLBACK) return false;
  
  // Network errors
  if (error.code === 'ERR_NETWORK') return true;
  if (error.code === 'ECONNREFUSED') return true;
  if (error.code === 'ECONNRESET') return true;
  if (error.code === 'ETIMEDOUT') return true;
  if (error.code === 'ERR_CONNECTION_REFUSED') return true;
  
  // Error messages
  if (error.message?.toLowerCase().includes('failed to fetch')) return true;
  if (error.message?.toLowerCase().includes('networkerror')) return true;
  if (error.message?.toLowerCase().includes('network request failed')) return true;
  if (error.message?.toLowerCase().includes('connection refused')) return true;
  if (error.message?.toLowerCase().includes('timeout')) return true;
  
  // HTTP status codes
  const status = error.status || error.response?.status;
  if (status && (status === 500 || status === 502 || status === 503 || status === 504)) {
    return true;
  }
  
  // No response = backend offline
  if (!error.response && error.request) return true;
  
  return false;
}

/**
 * 🏥 HEALTH CHECK
 */
async function checkBackendHealth(): Promise<boolean> {
  const now = Date.now();
  if (now - lastHealthCheck < HEALTH_CHECK_INTERVAL && backendStatus !== 'unknown') {
    return backendStatus === 'online';
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${API_BASE_URL}/actuator/health`, {
      method: 'GET',
      signal: controller.signal,
    }).catch(() => null);
    
    clearTimeout(timeoutId);
    
    if (response && response.ok) {
      backendStatus = 'online';
      lastHealthCheck = now;
      if (typeof window !== 'undefined') {
        console.info('✅ Backend is ONLINE');
      }
      return true;
    }
  } catch (error) {
    // Ignore
  }
  
  backendStatus = 'offline';
  lastHealthCheck = now;
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Backend is OFFLINE - using mock data');
  }
  return false;
}

/**
 * 🚀 MAIN API WRAPPER WITH AUTO-FALLBACK
 */
export async function apiWrapper<T = any>(
  endpoint: string,
  options: FetchOptions = {},
  mockFallback?: () => Promise<any>
): Promise<T> {
  const { skipFallback, timeout = REQUEST_TIMEOUT, ...fetchOptions } = options;
  
  // Try real API first
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    // Timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    const data = await response.json();
    
    // Mark backend as online
    if (backendStatus !== 'online') {
      backendStatus = 'online';
      if (typeof window !== 'undefined') {
        console.info('✅ Backend reconnected');
      }
    }
    
    return data;
    
  } catch (error: any) {
    // 🎯 AUTO-FALLBACK TO MOCK DATA
    if (!skipFallback && isBackendOffline(error) && mockFallback) {
      if (backendStatus === 'online') {
        backendStatus = 'offline';
        if (typeof window !== 'undefined') {
          console.warn('⚠️ Backend offline - switching to mock data');
        }
      }
      
      try {
        return await mockFallback();
      } catch (mockError) {
        console.error('❌ Mock fallback also failed:', mockError);
        throw error; // Throw original error
      }
    }
    
    // Re-throw error if no fallback or fallback disabled
    throw error;
  }
}

/**
 * 🔄 PERIODIC HEALTH CHECK
 */
if (typeof window !== 'undefined') {
  setInterval(() => {
    checkBackendHealth();
  }, HEALTH_CHECK_INTERVAL);
  
  // Initial check
  checkBackendHealth();
}

export { 
  API_BASE_URL, 
  ENABLE_MOCK_FALLBACK, 
  checkBackendHealth, 
  backendStatus,
  isBackendOffline 
};
