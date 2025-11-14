'use client';

import {
  AuthUser,
  UserRole,
  Scholarship,
  ScholarshipLevel,
  StudyMode,
  ModerationStatus,
  Application,
  ApplicationStatus,
  Notification,
  UserProfile,
  Report,
  Transaction,
  AuditLog,
  LoginCredentials,
  RegisterCredentials,
  ApiResponse,
} from '@/types';

// Helper để format Date thành 'YYYY-MM-DD'
function formatDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

// =============================================================================
// USERS
// =============================================================================
export const USERS: AuthUser[] = [
  {
    id: 'admin-1', email: 'admin@edumatch.com', name: 'System Admin', role: UserRole.ADMIN,
    emailVerified: true, status: 'ACTIVE' as any, subscriptionType: 'FREE' as any,
    createdAt: new Date('2023-01-01'), updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'provider-1', email: 'mit@scholarships.edu', name: 'MIT Research Lab', role: UserRole.PROVIDER,
    emailVerified: true, status: 'ACTIVE' as any, subscriptionType: 'PREMIUM' as any,
    createdAt: new Date('2023-06-15'), updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'provider-2', email: 'stanford@scholarships.edu', name: 'Stanford University', role: UserRole.PROVIDER,
    emailVerified: true, status: 'ACTIVE' as any, subscriptionType: 'PREMIUM' as any,
    createdAt: new Date('2023-07-01'), updatedAt: new Date('2025-01-09'),
  },
  {
    id: 'provider-3', email: 'google@scholarships.com', name: 'Google Education', role: UserRole.PROVIDER,
    emailVerified: true, status: 'ACTIVE' as any, subscriptionType: 'ENTERPRISE' as any,
    createdAt: new Date('2023-08-10'), updatedAt: new Date('2025-01-08'),
  },
  {
    id: 'student-1', email: 'john.doe@student.edu', name: 'John Doe', role: UserRole.STUDENT,
    emailVerified: true, status: 'ACTIVE' as any, subscriptionType: 'FREE' as any,
    createdAt: new Date('2024-09-01'), updatedAt: new Date('2025-01-12'),
  },
];

// =============================================================================
// USER PROFILES
// =============================================================================
export const USER_PROFILES: UserProfile[] = [
  {
    id: 'profile-student-1', userId: 'student-1', firstName: 'John', lastName: 'Doe', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', 
    bio: 'Computer Science student passionate about AI', 
    gpa: 3.8, skills: ['Python', 'React', 'TensorFlow'], 
    verified: true, 
    interests: ['Artificial Intelligence', 'Web Development'],
    languages: ['English', 'Spanish'],
    createdAt: new Date('2024-09-01'), updatedAt: new Date('2025-01-12'),
  },

  {
    id: 'profile-student-2',
    userId: 'student-2',
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    bio: 'UX Designer',
    gpa: 3.9,
    skills: ['Figma', 'React'],
    
    // === THÊM ===
    verified: true,
    interests: ['Design', 'Art'],
    languages: ['English', 'French'],
    // ==========
    
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2025-01-11'),
  }
];

// =============================================================================
// SCHOLARSHIPS (ĐÃ CẬP NHẬT: Thêm Location, University, MatchScore)
// =============================================================================
export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'scholarship-1',
    organizationId: 'provider-1',
    title: 'MIT AI Research Fellowship 2025',
    description: 'Full scholarship for graduate students pursuing AI and Machine Learning research at MIT',
    level: ScholarshipLevel.MASTER,
    moderationStatus: ModerationStatus.APPROVED,
    studyMode: StudyMode.FULL_TIME,
    scholarshipAmount: 50000,
    minGpa: 3.5,
    applicationDeadline: formatDateString(new Date('2025-03-31')),
    startDate: formatDateString(new Date('2025-09-01')),
    endDate: formatDateString(new Date('2027-08-31')),
    tags: ['AI', 'Machine Learning', 'Research'],
    requiredSkills: ['Python', 'TensorFlow', 'Research'],
    website: 'https://web.mit.edu/fellowships',
    contactEmail: 'fellowships@mit.edu',
    isPublic: true,
    viewsCnt: 1250,
    // === CÁC TRƯỜNG MỚI THÊM ===
    location: 'Cambridge, MA, USA',
    university: 'Massachusetts Institute of Technology',
    matchScore: 98,
  },
  {
    id: 'scholarship-2',
    organizationId: 'provider-2',
    title: 'Stanford Cybersecurity Excellence Program',
    description: 'Comprehensive scholarship for outstanding students in cybersecurity and network security',
    level: ScholarshipLevel.MASTER,
    moderationStatus: ModerationStatus.APPROVED,
    studyMode: StudyMode.FULL_TIME,
    scholarshipAmount: 45000,
    minGpa: 3.6,
    applicationDeadline: formatDateString(new Date('2025-04-15')),
    startDate: formatDateString(new Date('2025-09-15')),
    endDate: formatDateString(new Date('2027-06-15')),
    tags: ['Cybersecurity', 'Network Security'],
    requiredSkills: ['Network Security', 'Cryptography', 'Linux'],
    website: 'https://www.stanford.edu/cybersecurity',
    contactEmail: 'cybersec@stanford.edu',
    isPublic: true,
    viewsCnt: 980,
    // === CÁC TRƯỜNG MỚI THÊM ===
    location: 'Stanford, CA, USA',
    university: 'Stanford University',
    matchScore: 85,
  },
  {
    id: 'scholarship-3',
    organizationId: 'provider-3',
    title: 'Google UX Design Scholarship',
    description: 'Supporting the next generation of UX designers with full tuition coverage',
    level: ScholarshipLevel.UNDERGRADUATE,
    moderationStatus: ModerationStatus.APPROVED,
    studyMode: StudyMode.ONLINE,
    scholarshipAmount: 30000,
    minGpa: 3.3,
    applicationDeadline: formatDateString(new Date('2025-05-01')),
    startDate: formatDateString(new Date('2025-09-01')),
    tags: ['UX Design', 'UI Design'],
    requiredSkills: ['Figma', 'UI/UX Design', 'Prototyping'],
    website: 'https://edu.google.com/scholarships',
    contactEmail: 'scholarships@google.com',
    isPublic: true,
    viewsCnt: 1520,
    // === CÁC TRƯỜNG MỚI THÊM ===
    location: 'Remote / Online',
    university: 'Google Education',
    matchScore: 72,
  },
  // Bạn có thể thêm tiếp các scholarship 4, 5...
];

// =============================================================================
// APPLICATIONS
// =============================================================================
export const APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    applicantId: 'student-1',
    scholarshipId: 'scholarship-1',
    status: ApplicationStatus.ACCEPTED,
    additionalDocs: [],
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2025-01-08'),
  },
];

// =============================================================================
// NOTIFICATIONS
// =============================================================================
export const NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'student-1',
    title: 'Application Update',
    message: 'Your application status has changed.',
    type: 'INFO',
    read: false,
    createdAt: new Date(),
  }
];

// =============================================================================
// MOCK API IMPLEMENTATION
// =============================================================================

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const shouldUseMockApi = true;

// Helper helper
let currentMockUser: AuthUser | null = USERS.find(u => u.id === 'student-1') || null;

export const mockApi = {
  auth: {
    async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: AuthUser; token: string }>> {
      await delay(500);
      const user = USERS.find(u => u.email === credentials.email);
      if (user) {
        currentMockUser = user;
        return { success: true, data: { user, token: `mock-token-${user.id}` } };
      }
      return { success: false, error: 'Invalid credentials' };
    },
    async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: AuthUser; token: string }>> {
      await delay(500);
      return { success: false, error: 'Registration not implemented in mock' };
    },
    async logout(): Promise<ApiResponse> {
      await delay(300);
      currentMockUser = null;
      return { success: true };
    },
    async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
      await delay(200);
      if (currentMockUser) return { success: true, data: currentMockUser };
      return { success: false, error: 'Not authenticated' };
    },
  },

  profile: {
    async getById(userId: string): Promise<ApiResponse<UserProfile>> {
      await delay(300);
      const profile = USER_PROFILES.find(p => p.userId === userId);
      return profile ? { success: true, data: profile } : { success: false, error: 'Not found' };
    },
    async update(userId: string, data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
        await delay(300);
        return { success: false, error: "Not implemented" }
    }
  },

  scholarships: {
    async getAll(filters?: any): Promise<ApiResponse<Scholarship[]>> {
      await delay(300);
      let data = [...SCHOLARSHIPS];
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        data = data.filter(i => i.title.toLowerCase().includes(s));
      }
      return { success: true, data };
    },

    async getById(id: string): Promise<ApiResponse<Scholarship>> {
      await delay(300);
      const item = SCHOLARSHIPS.find(s => s.id === id);
      if (!item) return { success: false, error: 'Not found' };
      return { success: true, data: item };
    },

    async getByProvider(providerId: string): Promise<ApiResponse<Scholarship[]>> {
      await delay(300);
      return { success: true, data: SCHOLARSHIPS.filter(s => s.organizationId === providerId) };
    },

    async create(data: Partial<Scholarship>): Promise<ApiResponse<Scholarship>> {
        return { success: false, error: "Not implemented" }
    },
    async update(id: string, data: Partial<Scholarship>): Promise<ApiResponse<Scholarship>> {
        return { success: false, error: "Not implemented" }
    }
  },

  applications: {
    async getByUser(userId: string): Promise<ApiResponse<Application[]>> {
      await delay(300);
      return { success: true, data: APPLICATIONS.filter(a => a.applicantId === userId) };
    },
    async getByScholarship(id: string): Promise<ApiResponse<Application[]>> {
        return { success: true, data: APPLICATIONS.filter(a => a.scholarshipId === id) };
    },
    async submit(data: any): Promise<ApiResponse<Application>> {
        return { success: false, error: "Not implemented" }
    },
    async updateStatus(id: string, status: ApplicationStatus): Promise<ApiResponse<Application>> {
        return { success: false, error: "Not implemented" }
    },
    async checkApplicationStatus(scholarshipId: string, userId: string): Promise<ApiResponse<{ hasApplied: boolean; application?: Application }>> {
      await delay(200);
      const app = APPLICATIONS.find(a => a.scholarshipId === scholarshipId && a.applicantId === userId);
      return { success: true, data: { hasApplied: !!app, application: app } };
    }
  },

  savedScholarships: {
    async getByUser(userId: string): Promise<ApiResponse<string[]>> {
      await delay(200);
      return { success: true, data: [] };
    },
    async toggle(userId: string, scholarshipId: string): Promise<ApiResponse<{ saved: boolean }>> {
      await delay(200);
      return { success: true, data: { saved: true } };
    }
  },

  notifications: {
    async getByUser(userId: string): Promise<ApiResponse<Notification[]>> {
      await delay(200);
      return { success: true, data: NOTIFICATIONS.filter(n => n.userId === userId) };
    },
    async markAsRead(id: string): Promise<ApiResponse> { return { success: true } },
    async markAllAsRead(userId: string): Promise<ApiResponse> { return { success: true } }
  },

  analytics: {
    async getDashboardStats(providerId: string): Promise<ApiResponse<any>> {
      return { success: true, data: {} };
    }
  }
};

// Export legacy names to keep compatibility
export const mockUsers = USERS;
export const mockUserProfiles = USER_PROFILES;
export const mockScholarships = SCHOLARSHIPS;
export const mockApplications = APPLICATIONS;
export const mockNotifications = NOTIFICATIONS;