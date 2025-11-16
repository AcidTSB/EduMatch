/**
 * Scholarship Service API
 * Tích hợp với scholarship-service backend
 */

import { 
  ApiResponse, 
  PaginatedResponse, 
  Scholarship, 
  Application 
} from '@/types';

// API Base URL - sử dụng gateway (port 80)
// Nếu chạy local development, có thể cần http://localhost:80/api hoặc http://localhost/api
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost') + '/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// Helper function to create authenticated headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API call function
async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Scholarship Filters Interface
export interface ScholarshipSearchFilters {
  q?: string; // Search query
  gpa?: number; // Minimum GPA
  studyMode?: string; // FULL_TIME, PART_TIME, ONLINE, HYBRID
  level?: string; // UNDERGRADUATE, MASTER, PHD, etc.
  isPublic?: boolean;
  currentDate?: string; // YYYY-MM-DD
  page?: number;
  size?: number;
  sort?: string;
}

// Application Request Interface
export interface CreateApplicationRequest {
  opportunityId: number; // BE expects opportunityId, not scholarshipId
  documents?: Array<{
    documentName: string;
    documentUrl: string;
  }>;
  // Additional fields from FE form
  applicantUserName?: string;
  applicantEmail?: string;
  phone?: string;
  gpa?: number;
  coverLetter?: string;
  motivation?: string;
  additionalInfo?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

// Scholarship Service API
export const scholarshipServiceApi = {
  /**
   * Tìm kiếm và lọc scholarships (opportunities)
   * GET /api/scholarships
   */
  getScholarships: async (filters?: ScholarshipSearchFilters) => {
    const searchParams = new URLSearchParams();
    
    if (filters) {
      if (filters.q) searchParams.append('q', filters.q);
      if (filters.gpa !== undefined) searchParams.append('gpa', filters.gpa.toString());
      if (filters.studyMode) searchParams.append('studyMode', filters.studyMode);
      if (filters.level) searchParams.append('level', filters.level);
      if (filters.isPublic !== undefined) searchParams.append('isPublic', filters.isPublic.toString());
      if (filters.currentDate) searchParams.append('currentDate', filters.currentDate);
      if (filters.page !== undefined) searchParams.append('page', filters.page.toString());
      if (filters.size !== undefined) searchParams.append('size', filters.size.toString());
      if (filters.sort) searchParams.append('sort', filters.sort);
    }
    
    const queryString = searchParams.toString();
    return apiCall<PaginatedResponse<Scholarship>>(`/api/scholarships${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Lấy chi tiết một scholarship (opportunity)
   * GET /api/scholarships/{id}
   */
  getScholarshipById: async (id: string | number) => {
    return apiCall<{ opportunity: Scholarship; matchScore?: number }>(`/api/scholarships/${id}`);
  },

  /**
   * Tạo application (nộp đơn)
   * POST /api/applications
   */
  createApplication: async (request: CreateApplicationRequest) => {
    return apiCall<Application>('/api/applications', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Lấy danh sách applications của user hiện tại
   * GET /api/applications/my
   */
  getMyApplications: async () => {
    return apiCall<Application[]>('/api/applications/my');
  },

  /**
   * Toggle bookmark (bookmark/unbookmark)
   * POST /api/bookmarks/{opportunityId}
   */
  toggleBookmark: async (opportunityId: string | number) => {
    return apiCall<{ bookmarked: boolean }>(`/api/bookmarks/${opportunityId}`, {
      method: 'POST',
    });
  },

  /**
   * Lấy danh sách bookmarks của user hiện tại
   * GET /api/bookmarks/my
   */
  getMyBookmarks: async () => {
    return apiCall<Array<{
      id: number;
      applicantUserId: number;
      opportunity: Scholarship;
    }>>('/api/bookmarks/my');
  },
};

export default scholarshipServiceApi;

