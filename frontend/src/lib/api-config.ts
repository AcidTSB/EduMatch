/**
 * 🔧 API CONFIGURATION
 * ====================================
 * Centralized API configuration
 * ====================================
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 0, // No retry (use mock instead)
  ENABLE_MOCK_FALLBACK: process.env.NEXT_PUBLIC_ENABLE_MOCK_FALLBACK !== 'false',
  
  ENDPOINTS: {
    // Auth
    AUTH: {
      SIGNIN: '/api/auth/signin',
      SIGNUP: '/api/auth/signup',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      ME: '/api/auth/me',
      VERIFY: '/api/auth/verify',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
    },
    
    // Users
    USERS: {
      BASE: '/api/users',
      PROFILE: '/api/users/profile',
      AVATAR: '/api/users/avatar',
      ACCOUNT: '/api/users/account',
      BY_ID: (userId: string) => `/api/users/${userId}`,
    },
    
    // Scholarships
    SCHOLARSHIPS: {
      BASE: '/api/scholarships',
      RECOMMENDATIONS: '/api/scholarships/recommendations',
      SAVED: '/api/scholarships/saved',
      BY_ID: (id: string) => `/api/scholarships/${id}`,
      SAVE: (scholarshipId: string) => `/api/scholarships/${scholarshipId}/save`,
      APPLICATIONS: (scholarshipId: string) => `/api/scholarships/${scholarshipId}/applications`,
    },
    
    // Applications
    APPLICATIONS: {
      BASE: '/api/applications',
      BY_ID: (id: string) => `/api/applications/${id}`,
      SUBMIT: (id: string) => `/api/applications/${id}/submit`,
      WITHDRAW: (id: string) => `/api/applications/${id}/withdraw`,
      DOCUMENTS: (applicationId: string) => `/api/applications/${applicationId}/documents`,
      STATUS: (applicationId: string) => `/api/applications/${applicationId}/status`,
    },
    
    // Notifications
    NOTIFICATIONS: {
      BASE: '/api/notifications',
      BY_ID: (id: string) => `/api/notifications/${id}`,
      MARK_READ: (id: string) => `/api/notifications/${id}/read`,
      MARK_ALL_READ: '/api/notifications/read-all',
      UNREAD_COUNT: '/api/notifications/unread-count',
    },
    
    // Messages
    MESSAGES: {
      BASE: '/api/messages',
      CONVERSATIONS: '/api/messages/conversations',
      CONVERSATION_MESSAGES: (conversationId: string) => `/api/messages/conversations/${conversationId}`,
      MARK_READ: (conversationId: string) => `/api/messages/conversations/${conversationId}/read`,
    },
    
    // Admin
    ADMIN: {
      USERS: '/api/admin/users',
      CREATE_USER: '/api/admin/create-user',
      CREATE_EMPLOYER: '/api/admin/create-employer',
      TOGGLE_USER_STATUS: (userId: string) => `/api/admin/users/${userId}/toggle-status`,
      DELETE_USER: (userId: string) => `/api/admin/users/${userId}`,
      SCHOLARSHIPS: '/api/admin/scholarships',
      APPROVE_SCHOLARSHIP: (scholarshipId: string) => `/api/admin/scholarships/${scholarshipId}/approve`,
      REJECT_SCHOLARSHIP: (scholarshipId: string) => `/api/admin/scholarships/${scholarshipId}/reject`,
      AUDIT_LOGS: '/api/admin/audit/logs',
      AUDIT_USER: (userId: string) => `/api/admin/audit/users/${userId}`,
      ANALYTICS: '/api/admin/analytics',
    },
  }
} as const;

export default API_CONFIG;
