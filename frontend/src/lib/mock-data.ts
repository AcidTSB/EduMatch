import { 
  AuthUser, 
  LoginCredentials, 
  RegisterCredentials, 
  ApiResponse,
  Scholarship, 
  UserRole, 
  ScholarshipType, 
  ScholarshipStatus,
  UserProfile,
  Application,
  ApplicationStatus,
  Notification
} from '@/types';

// =============================================================================
// MOCK USERS DATABASE
// =============================================================================
export const mockUsers: AuthUser[] = [
  {
    id: '1',
    email: 'student@demo.com',
    name: 'John Student',
    role: UserRole.STUDENT,
    emailVerified: true,
    status: 'ACTIVE' as any,
    subscriptionType: 'FREE' as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'provider@demo.com',
    name: 'Jane Provider',
    role: UserRole.PROVIDER,
    emailVerified: true,
    status: 'ACTIVE' as any,
    subscriptionType: 'FREE' as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: UserRole.ADMIN,
    emailVerified: true,
    status: 'ACTIVE' as any,
    subscriptionType: 'FREE' as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
] as AuthUser[];

// =============================================================================
// MOCK USER PROFILES
// =============================================================================
export const mockUserProfiles: UserProfile[] = [
  {
    id: '1',
    userId: '1',
    firstName: 'John',
    lastName: 'Student',
    phone: '+1 (555) 123-4567',
    dateOfBirth: new Date('1998-05-15'),
    university: 'Tech University',
    major: 'Computer Science',
    gpa: 3.8,
    verified: false,
    skills: ['JavaScript', 'React', 'Node.js'],
    interests: ['Technology', 'Research'],
    languages: ['English', 'Spanish'],
    createdAt: new Date(),
    updatedAt: new Date(),
    graduationYear: 2025,
    experience: [
      {
        company: 'Tech Startup Inc.',
        position: 'Software Engineering Intern',
        duration: 'Summer 2024',
        description: 'Developed web applications using React and Node.js'
      }
    ],
    education: [
      {
        institution: 'Tech University',
        degree: 'Bachelor of Science in Computer Science',
        graduationYear: 2025,
        gpa: 3.8
      }
    ],
    publications: [
      {
        name: 'EduMatch Clone',
        description: 'A scholarship matching platform built with Next.js',
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
        github: 'https://github.com/johndoe/edumatch-clone'
      }
    ],
    bio: 'Passionate computer science student with a focus on full-stack development and machine learning. Always eager to learn new technologies and solve complex problems.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  }
];

// =============================================================================
// MOCK SCHOLARSHIPS DATABASE
// =============================================================================
export const mockScholarships: Scholarship[] = [
  {
    id: '1',
    providerId: 'provider1',
    title: 'Full-Stack Development Research Grant',
    description: 'Looking for talented students to join our research team focusing on modern web technologies and distributed systems.',
    type: ScholarshipType.RESEARCH,
    status: ScholarshipStatus.PUBLISHED,
    university: 'Tech University',
    department: 'Computer Science',
    location: 'San Francisco, CA',
    isRemote: true,
    amount: 50000,
    currency: 'USD',
    duration: 12,
    isPaidMonthly: true,
    requirements: [
      'Currently enrolled in Computer Science or related field',
      'Minimum GPA of 3.5',
      'Portfolio demonstrating web development skills',
      'Available for full-time commitment'
    ],
    eligibility: {},
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'Database Design'],
    preferredSkills: ['TypeScript', 'Cloud Computing', 'DevOps'],
    minGpa: 3.5,
    applicationDeadline: new Date('2024-12-31'),
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-12-15'),
    tags: ['full-time', 'research', 'technology'],
    website: 'https://techuni.edu/research',
    contactEmail: 'research@techuni.edu',
    isVisible: true,
    viewCount: 125,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    // Legacy fields for compatibility
    stipend: 50000,
    deadline: '2024-12-31',
    field: ['Computer Science', 'Software Engineering'],
    level: 'Graduate',
    studyMode: 'Full-time',
    
    providerName: 'Tech University'
  },
  {
    id: '2',
    providerId: 'provider2',
    title: 'AI/ML Research Fellowship',
    description: 'Join our cutting-edge artificial intelligence research lab working on machine learning applications.',
    type: ScholarshipType.RESEARCH,
    status: ScholarshipStatus.PUBLISHED,
    university: 'AI Institute',
    department: 'Artificial Intelligence',
    location: 'Boston, MA',
    isRemote: false,
    amount: 60000,
    currency: 'USD',
    duration: 24,
    isPaidMonthly: true,
    requirements: [
      'PhD student in AI/ML or related field',
      'Publications in top-tier conferences preferred',
      'Strong mathematical background',
      'Experience with deep learning frameworks'
    ],
    eligibility: {},
    requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'Research'],
    preferredSkills: ['TensorFlow', 'PyTorch', 'Deep Learning'],
    minGpa: 3.7,
    applicationDeadline: new Date('2024-11-30'),
    startDate: new Date('2025-01-01'),
    endDate: new Date('2026-12-31'),
    tags: ['research', 'AI', 'fellowship'],
    website: 'https://aiinstitute.edu/fellowship',
    contactEmail: 'fellowship@aiinstitute.edu',
    isVisible: true,
    viewCount: 89,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    // Legacy fields
    stipend: 50000,
    deadline: '2024-11-30',
    field: ['Artificial Intelligence', 'Machine Learning'],
    level: 'PhD',
    studyMode: 'Full-time',
    
    providerName: 'AI Institute'
  },
  {
    id: '3',
    providerId: 'provider3',
    title: 'Sustainability Engineering Grant',
    description: 'Research opportunity in renewable energy systems and environmental engineering solutions.',
    type: ScholarshipType.RESEARCH,
    status: ScholarshipStatus.PUBLISHED,
    university: 'Green Tech University',
    department: 'Environmental Engineering',
    location: 'Seattle, WA',
    isRemote: true,
    amount: 45000,
    currency: 'USD',
    duration: 18,
    isPaidMonthly: true,
    requirements: [
      'Masters or PhD in Environmental Engineering',
      'Research experience in sustainability',
      'Strong analytical skills',
      'Commitment to environmental causes'
    ],
    eligibility: {},
    requiredSkills: ['Engineering', 'Environmental Science', 'Data Analysis'],
    preferredSkills: ['Renewable Energy', 'CAD Software', 'Project Management'],
    minGpa: 3.3,
    applicationDeadline: new Date('2025-01-15'),
    startDate: new Date('2025-02-01'),
    endDate: new Date('2026-07-31'),
    tags: ['sustainability', 'engineering', 'environment'],
    website: 'https://greentech.edu/grants',
    contactEmail: 'grants@greentech.edu',
    isVisible: true,
    viewCount: 67,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    // Legacy fields
    stipend: 50000,
    deadline: '2025-01-15',
    field: ['Environmental Engineering', 'Sustainability'],
    level: 'Graduate',
    studyMode: 'Full-time',
    
    providerName: 'Green Tech University'
  }
];

// =============================================================================
// MOCK APPLICATIONS DATABASE
// =============================================================================
export const mockApplications: Application[] = [
  {
    id: '1',
    scholarshipId: '1',
    applicantId: '1',
    status: ApplicationStatus.SUBMITTED,
    coverLetter: 'I am very interested in this research opportunity...',
    additionalDocs: [],
    submittedAt: new Date('2024-09-15'),
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-09-15')
  },
  {
    id: '2',
    scholarshipId: '2',
    applicantId: '1',
    status: ApplicationStatus.ACCEPTED,
    coverLetter: 'I am excited about the AI research opportunity...',
    additionalDocs: [],
    submittedAt: new Date('2024-08-20'),
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2024-08-25')
  }
];

// =============================================================================
// MOCK NOTIFICATIONS DATABASE
// =============================================================================
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Application Status Update',
    message: 'Your application for AI/ML Research Fellowship has been accepted!',
    type: 'success',
    read: false,
    createdAt: new Date('2024-09-25'),
    
  },
  {
    id: '2',
    userId: '1',
    title: 'New Scholarship Match',
    message: 'We found a new scholarship that matches your profile!',
    type: 'info',
    read: false,
    createdAt: new Date('2024-09-24'),
    
  },
  {
    id: '3',
    userId: '1',
    title: 'Application Deadline Reminder',
    message: 'Don\'t forget! Application deadline for Full-Stack Development Grant is in 5 days.',
    type: 'warning',
    read: true,
    createdAt: new Date('2024-09-20'),
    
  }
];

// =============================================================================
// REFERENCE DATA
// =============================================================================
export const commonSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 
  'Java', 'C++', 'Machine Learning', 'Data Science', 'Cloud Computing',
  'DevOps', 'Database Design', 'Mobile Development', 'UI/UX Design',
  'Project Management', 'Research', 'Statistics', 'Mathematics'
];

export const studyFields = [
  'Computer Science', 'Software Engineering', 'Artificial Intelligence',
  'Machine Learning', 'Data Science', 'Environmental Engineering',
  'Sustainability', 'Renewable Energy', 'Biotechnology', 'Materials Science',
  'Robotics', 'Cybersecurity', 'Information Systems', 'Electrical Engineering',
  'Mechanical Engineering', 'Chemical Engineering', 'Physics', 'Mathematics',
  'Statistics', 'Business Administration', 'Economics', 'Finance'
];

export const mockCountries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'Australia',
  'Singapore', 'Netherlands', 'Sweden', 'Switzerland', 'France',
  'Japan', 'South Korea', 'New Zealand', 'Denmark', 'Norway'
];

export const mockLevels = [
  'Undergraduate', 'Graduate', 'PhD', 'Postdoc'
];

export const mockStudyModes = [
  'Full-time', 'Part-time', 'Remote'
];

// =============================================================================
// MOCK API CONFIGURATION
// =============================================================================
export const shouldUseMockApi = true;

// =============================================================================
// MOCK API IMPLEMENTATION
// =============================================================================
export const mockApi = {
  // Authentication APIs
  auth: {
    login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user || credentials.password !== 'password') {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }
      
      return {
        success: true,
        data: {
          user,
          token: 'mock-jwt-token-' + user.id
        }
      };
    },

    register: async (credentials: RegisterCredentials): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const existingUser = mockUsers.find(u => u.email === credentials.email);
      if (existingUser) {
        return {
          success: false,
          error: 'Email already registered'
        };
      }
      
      const newUser: AuthUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: credentials.email,
        name: credentials.name || `${credentials.firstName} ${credentials.lastName}`,
        role: credentials.role,
        emailVerified: false,
        status: 'ACTIVE' as any,
        subscriptionType: 'FREE' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as AuthUser;
      
      mockUsers.push(newUser);
      
      return {
        success: true,
        data: {
          user: newUser,
          token: 'mock-jwt-token-' + newUser.id
        }
      };
    },

    logout: async (): Promise<ApiResponse> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, message: 'Logged out successfully' };
    },

    refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: { token: 'refreshed-mock-jwt-token' }
      };
    }
  },

  // Scholarship APIs
  scholarships: {
    getAll: async (): Promise<ApiResponse<Scholarship[]>> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, data: mockScholarships };
    },

    getById: async (id: string): Promise<ApiResponse<Scholarship>> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const scholarship = mockScholarships.find(s => s.id === id);
      
      if (!scholarship) {
        return { success: false, error: 'Scholarship not found' };
      }
      
      return { success: true, data: scholarship };
    },

    getByProvider: async (providerId: string): Promise<ApiResponse<Scholarship[]>> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const scholarships = mockScholarships.filter(s => s.providerId === providerId);
      return { success: true, data: scholarships };
    }
  },

  // Application APIs
  applications: {
    getByUser: async (userId: string): Promise<ApiResponse<Application[]>> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const applications = mockApplications.filter(a => a.applicantId === userId);
      return { success: true, data: applications };
    },

    getByScholarship: async (scholarshipId: string): Promise<ApiResponse<Application[]>> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const applications = mockApplications.filter(a => a.scholarshipId === scholarshipId);
      return { success: true, data: applications };
    },

    submit: async (applicationData: any): Promise<ApiResponse<Application>> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newApplication: Application = {
        id: Math.random().toString(36).substr(2, 9),
        scholarshipId: applicationData.scholarshipId,
        applicantId: applicationData.applicantId,
        status: ApplicationStatus.SUBMITTED,
        coverLetter: applicationData.coverLetter,
        additionalDocs: applicationData.additionalDocs || [],
        submittedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockApplications.push(newApplication);
      
      return { success: true, data: newApplication };
    }
  },

  // Profile APIs
  profiles: {
    getById: async (userId: string): Promise<ApiResponse<UserProfile>> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const profile = mockUserProfiles.find(p => p.id === userId);
      
      if (!profile) {
        return { success: false, error: 'Profile not found' };
      }
      
      return { success: true, data: profile };
    },

    update: async (userId: string, profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const profileIndex = mockUserProfiles.findIndex(p => p.id === userId);
      if (profileIndex === -1) {
        return { success: false, error: 'Profile not found' };
      }
      
      mockUserProfiles[profileIndex] = { ...mockUserProfiles[profileIndex], ...profileData };
      
      return { success: true, data: mockUserProfiles[profileIndex] };
    }
  },

  // Notification APIs
  notifications: {
    getByUser: async (userId: string): Promise<ApiResponse<Notification[]>> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const notifications = mockNotifications.filter(n => n.userId === userId);
      return { success: true, data: notifications };
    },

    markAsRead: async (notificationId: string): Promise<ApiResponse> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const notification = mockNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
      
      return { success: true, message: 'Notification marked as read' };
    }
  }
};
