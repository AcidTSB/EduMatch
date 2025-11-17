/**
 * 🚀 MAIN API CLIENT WITH AUTO-FALLBACK
 * =========================================
 * ✅ Real API when backend online
 * ✅ Mock data when backend offline
 * ✅ All endpoints organized by service
 * =========================================
 */

import { 
  ApiResponse, 
  PaginatedResponse, 
  Scholarship, 
  Application, 
  UserProfile, 
  ScholarshipFilters,
  LoginForm,
  SignupForm,
  ProfileForm,
  ScholarshipForm,
  Notification,
  Message,
  Conversation
} from '@/types';
import { apiWrapper } from './api-wrapper';
import { mockApi } from './mock-data';
import API_CONFIG from './api-config';

const { BASE_URL } = API_CONFIG;
const { AUTH, USERS, SCHOLARSHIPS, APPLICATIONS, NOTIFICATIONS, MESSAGES, ADMIN } = API_CONFIG.ENDPOINTS;

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

// Generic API call function with mock fallback
async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
  mockFallback?: () => Promise<any>
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  
  return apiWrapper<ApiResponse<T>>(
    url,
    {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    },
    mockFallback
  );
}

// Auth API
export const authApi = {
  // Login user
  login: (credentials: LoginForm) =>
    apiCall<{ user: UserProfile; token: string }>(
      AUTH.SIGNIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      async () => {
        const mockResponse = await mockApi.auth.login({
          email: credentials.email,
          password: credentials.password,
        });
        
        if (!mockResponse.success || !mockResponse.data) {
          throw new Error(mockResponse.error || 'Invalid credentials');
        }
        
        const mockUser = mockResponse.data.user;
        const userProfile: any = {
          id: mockUser.id,
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockUser.username}`,
          verified: mockUser.emailVerified,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        };
        
        return {
          success: true,
          data: {
            user: userProfile,
            token: mockResponse.data.token,
          },
        };
      }
    ),

  // Register user
  register: (userData: SignupForm) =>
    apiCall<{ user: UserProfile; token: string }>(
      AUTH.SIGNUP,
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      async () => {
        const mockResponse = await mockApi.auth.register({
          email: userData.email,
          name: userData.fullName || userData.email,
          password: userData.password,
          role: 1,
        } as any);
        
        if (!mockResponse.success || !mockResponse.data) {
          throw new Error(mockResponse.error || 'Registration failed');
        }
        
        const mockUser = mockResponse.data.user;
        const nameParts = (userData.fullName || '').split(' ');
        const userProfile: any = {
          id: mockUser.id,
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          firstName: nameParts[0] || mockUser.firstName,
          lastName: nameParts.slice(1).join(' ') || mockUser.lastName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockUser.username}`,
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        return {
          success: true,
          data: {
            user: userProfile,
            token: mockResponse.data.token,
          },
        };
      }
    ),

  // Logout user
  logout: () =>
    apiCall(
      AUTH.LOGOUT,
      {
        method: 'POST',
      },
      async () => {
        const mockResponse = await mockApi.auth.logout();
        return { success: true };
      }
    ),

  // Get current user
  me: () =>
    apiCall<UserProfile>(
      AUTH.ME,
      {},
      async () => {
        const mockResponse = await mockApi.auth.getCurrentUser();
        
        if (!mockResponse.success || !mockResponse.data) {
          throw new Error(mockResponse.error || 'Not authenticated');
        }
        
        const mockUser = mockResponse.data;
        const userProfile: any = {
          id: mockUser.id,
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockUser.username}`,
          bio: '',
          verified: mockUser.emailVerified,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        };
        
        return {
          success: true,
          data: userProfile,
        };
      }
    ),

  // Verify email
  verifyEmail: (token: string) =>
    apiCall(AUTH.VERIFY, {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  // Reset password
  requestPasswordReset: (email: string) =>
    apiCall(AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // Reset password with token
  resetPassword: (token: string, password: string) =>
    apiCall(AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

// Users API
export const usersApi = {
  // Get user profile
  getProfile: (userId?: string) =>
    apiCall<UserProfile>(userId ? USERS.BY_ID(userId) : USERS.PROFILE),

  // Update user profile
  updateProfile: (profileData: Partial<ProfileForm>) =>
    apiCall<UserProfile>(USERS.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  // Upload avatar
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiCall<{ avatarUrl: string }>(USERS.AVATAR, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
  },

  // Delete account
  deleteAccount: () =>
    apiCall(USERS.ACCOUNT, {
      method: 'DELETE',
    }),
};

// Scholarships API
export const scholarshipsApi = {
  // Get scholarships with filters and pagination
  getScholarships: (filters?: ScholarshipFilters, page = 1, limit = 20) => {
    const searchParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v.toString()));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    searchParams.append('page', page.toString());
    searchParams.append('limit', limit.toString());
    
    return apiCall<PaginatedResponse<Scholarship>>(`${SCHOLARSHIPS.BASE}?${searchParams.toString()}`);
  },

  // Get scholarship by ID
  getScholarship: (id: string) =>
    apiCall<Scholarship>(SCHOLARSHIPS.BY_ID(id)),

  // Create scholarship (provider only)
  createScholarship: (scholarshipData: ScholarshipForm) =>
    apiCall<Scholarship>(SCHOLARSHIPS.BASE, {
      method: 'POST',
      body: JSON.stringify(scholarshipData),
    }),

  // Update scholarship (provider only)
  updateScholarship: (id: string, scholarshipData: Partial<ScholarshipForm>) =>
    apiCall<Scholarship>(SCHOLARSHIPS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(scholarshipData),
    }),

  // Delete scholarship (provider only)
  deleteScholarship: (id: string) =>
    apiCall(SCHOLARSHIPS.BY_ID(id), {
      method: 'DELETE',
    }),

  // Get scholarship recommendations
  getRecommendations: (limit = 10) =>
    apiCall<Scholarship[]>(SCHOLARSHIPS.RECOMMENDATIONS + `?limit=${limit}`),

  // Save/bookmark scholarship
  saveScholarship: (scholarshipId: string) =>
    apiCall(SCHOLARSHIPS.SAVE(scholarshipId), {
      method: 'POST',
    }),

  // Unsave scholarship
  unsaveScholarship: (scholarshipId: string) =>
    apiCall(SCHOLARSHIPS.SAVE(scholarshipId), {
      method: 'DELETE',
    }),

  // Get saved scholarships
  getSavedScholarships: (page = 1, limit = 20) =>
    apiCall<PaginatedResponse<Scholarship>>(SCHOLARSHIPS.SAVED + `?page=${page}&limit=${limit}`),
};

// Applications API
export const applicationsApi = {
  // Get user's applications
  getApplications: (page = 1, limit = 20) =>
    apiCall<PaginatedResponse<Application>>(APPLICATIONS.BASE + `?page=${page}&limit=${limit}`),

  // Get application by ID
  getApplication: (id: string) =>
    apiCall<Application>(APPLICATIONS.BY_ID(id)),

  // Create application
  createApplication: (scholarshipId: string, applicationData: any) =>
    apiCall<Application>(APPLICATIONS.BASE, {
      method: 'POST',
      body: JSON.stringify({
        scholarshipId,
        ...applicationData,
      }),
    }),

  // Update application
  updateApplication: (id: string, applicationData: any) =>
    apiCall<Application>(APPLICATIONS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    }),

  // Submit application
  submitApplication: (id: string) =>
    apiCall<Application>(APPLICATIONS.SUBMIT(id), {
      method: 'POST',
    }),

  // Withdraw application
  withdrawApplication: (id: string) =>
    apiCall<Application>(APPLICATIONS.WITHDRAW(id), {
      method: 'POST',
    }),

  // Upload application document
  uploadDocument: (applicationId: string, file: File, documentType: string) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', documentType);
    
    return apiCall<{ url: string }>(APPLICATIONS.DOCUMENTS(applicationId), {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
  },

  // Get scholarship applications (for providers)
  getScholarshipApplications: (scholarshipId: string, page = 1, limit = 20) =>
    apiCall<PaginatedResponse<Application>>(SCHOLARSHIPS.APPLICATIONS(scholarshipId) + `?page=${page}&limit=${limit}`),

  // Update application status (for providers)
  updateApplicationStatus: (applicationId: string, status: string, feedback?: string) =>
    apiCall<Application>(APPLICATIONS.STATUS(applicationId), {
      method: 'PUT',
      body: JSON.stringify({ status, feedback }),
    }),
};

// Notifications API
export const notificationsApi = {
  // Get notifications
  getNotifications: (page = 1, limit = 20) =>
    apiCall<PaginatedResponse<Notification>>(NOTIFICATIONS.BASE + `?page=${page}&limit=${limit}`),

  // Mark notification as read
  markAsRead: (id: string) =>
    apiCall(NOTIFICATIONS.MARK_READ(id), {
      method: 'PUT',
    }),

  // Mark all notifications as read
  markAllAsRead: () =>
    apiCall(NOTIFICATIONS.MARK_ALL_READ, {
      method: 'PUT',
    }),

  // Delete notification
  deleteNotification: (id: string) =>
    apiCall(NOTIFICATIONS.BY_ID(id), {
      method: 'DELETE',
    }),

  // Get unread count
  getUnreadCount: () =>
    apiCall<{ count: number }>(NOTIFICATIONS.UNREAD_COUNT),
};

// Messages API
export const messagesApi = {
  // Get conversations
  getConversations: (page = 1, limit = 20) =>
    apiCall<PaginatedResponse<Conversation>>(MESSAGES.CONVERSATIONS + `?page=${page}&limit=${limit}`),

  // Get conversation messages
  getMessages: (conversationId: string, page = 1, limit = 50) =>
    apiCall<PaginatedResponse<Message>>(MESSAGES.CONVERSATION_MESSAGES(conversationId) + `?page=${page}&limit=${limit}`),

  // Send message
  sendMessage: (conversationId: string, content: string, attachments?: File[]) => {
    if (attachments && attachments.length > 0) {
      const formData = new FormData();
      formData.append('content', content);
      attachments.forEach(file => formData.append('attachments', file));
      
      return apiCall<Message>(MESSAGES.CONVERSATION_MESSAGES(conversationId), {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    } else {
      return apiCall<Message>(MESSAGES.CONVERSATION_MESSAGES(conversationId), {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    }
  },

  // Create conversation
  createConversation: (participantId: string) =>
    apiCall<Conversation>(MESSAGES.CONVERSATIONS, {
      method: 'POST',
      body: JSON.stringify({ participantId }),
    }),

  // Mark messages as read
  markAsRead: (conversationId: string) =>
    apiCall(MESSAGES.MARK_READ(conversationId), {
      method: 'PUT',
    }),
};

// Admin API
export const adminApi = {
  // Get users (admin only)
  getUsers: (page = 1, limit = 20, filters?: any) => {
    const searchParams = new URLSearchParams();
    searchParams.append('page', page.toString());
    searchParams.append('limit', limit.toString());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return apiCall<PaginatedResponse<UserProfile>>(ADMIN.USERS + `?${searchParams.toString()}`);
  },

  // Get scholarships (admin only)
  getAllScholarships: (page = 1, limit = 20, filters?: any) => {
    const searchParams = new URLSearchParams();
    searchParams.append('page', page.toString());
    searchParams.append('limit', limit.toString());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return apiCall<PaginatedResponse<Scholarship>>(ADMIN.SCHOLARSHIPS + `?${searchParams.toString()}`);
  },

  updateUserStatus: (userId: string) =>
    apiCall(ADMIN.TOGGLE_USER_STATUS(userId), {
      method: 'PATCH',
    }),

  createUser: (userData: any) =>
    apiCall(ADMIN.CREATE_USER, {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  createEmployer: (employerData: any) =>
    apiCall(ADMIN.CREATE_EMPLOYER, {
      method: 'POST',
      body: JSON.stringify(employerData),
    }),

  deleteUser: (userId: string) =>
    apiCall(ADMIN.DELETE_USER(userId), {
      method: 'DELETE',
    }),

  approveScholarship: (scholarshipId: string) =>
    apiCall(ADMIN.APPROVE_SCHOLARSHIP(scholarshipId), {
      method: 'PATCH',
    }),

  rejectScholarship: (scholarshipId: string, reason: string) =>
    apiCall(ADMIN.REJECT_SCHOLARSHIP(scholarshipId), {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),

  getAuditLogs: () =>
    apiCall(ADMIN.AUDIT_LOGS),

  getAuditLogsByUser: (userId: string) =>
    apiCall(ADMIN.AUDIT_USER(userId)),

  getAnalytics: () =>
    apiCall(ADMIN.ANALYTICS),
};

// Export all APIs
export const api = {
  auth: authApi,
  users: usersApi,
  scholarships: scholarshipsApi,
  applications: applicationsApi,
  notifications: notificationsApi,
  messages: messagesApi,
  admin: adminApi,
};

export default api;