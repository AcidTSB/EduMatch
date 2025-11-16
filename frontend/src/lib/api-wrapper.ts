/**
 * API Wrapper with Smart Fallback
 * Automatically uses mock data when backend is offline
 */

import { mockApi } from './mock-data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const ENABLE_MOCK_FALLBACK = process.env.NEXT_PUBLIC_ENABLE_MOCK_FALLBACK !== 'false';

let backendStatus: 'online' | 'offline' | 'unknown' = 'unknown';
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

interface FetchOptions extends RequestInit {
  skipFallback?: boolean;
}

function shouldUseMockFallback(error: any): boolean {
  if (!ENABLE_MOCK_FALLBACK) return false;
  
  if (error.message?.includes('ERR_CONNECTION_REFUSED')) return true;
  if (error.message?.includes('ERR_NETWORK')) return true;
  if (error.message?.includes('Failed to fetch')) return true;
  if (error.message?.includes('NetworkError')) return true;
  if (error.code === 'ECONNREFUSED') return true;
  
  return false;
}

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
      return true;
    }
  } catch (error) {
    // Ignore
  }
  
  backendStatus = 'offline';
  lastHealthCheck = now;
  return false;
}

export async function apiWrapper<T = any>(
  endpoint: string,
  options: FetchOptions = {},
  mockFallback?: () => Promise<any>
): Promise<T> {
  const { skipFallback, ...fetchOptions } = options;
  
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const error: any = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    const data = await response.json();
    backendStatus = 'online';
    return data;
    
  } catch (error: any) {
    if (!skipFallback && shouldUseMockFallback(error) && mockFallback) {
      if (backendStatus === 'online') {
        backendStatus = 'offline';
      }
      return await mockFallback();
    }
    throw error;
  }
}

export { API_BASE_URL, ENABLE_MOCK_FALLBACK, checkBackendHealth, backendStatus };
