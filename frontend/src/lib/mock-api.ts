'use client';

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
// CENTRALIZED MOCK DATA STORE
// =============================================================================

class MockDataStore {
  private static instance: MockDataStore;
  
  // Data stores
  public users: AuthUser[] = [];
  public profiles: UserProfile[] = [];
  public scholarships: Scholarship[] = [];
  public applications: Application[] = [];
  public notifications: Notification[] = [];
  public savedScholarships: { [userId: string]: string[] } = {};
  public messages: any[] = [];
  
  // Settings
  public currentUser: AuthUser | null = null;

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): MockDataStore {
    if (!MockDataStore.instance) {
      MockDataStore.instance = new MockDataStore();
    }
    return MockDataStore.instance;
  }

  private initializeData() {
    // Initialize users
    this.users = [
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
    ];

    // Initialize profiles
    this.profiles = [
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
        bio: 'Passionate computer science student with a focus on full-stack development and machine learning.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      }
    ];

    // Initialize scholarships with match scores
    this.scholarships = [
      {
        id: 'sch1',
        providerId: '2',
        title: 'MIT AI Research Fellowship',
        description: 'Join our cutting-edge artificial intelligence research lab working on machine learning applications for real-world problems. This prestigious fellowship offers hands-on experience with cutting-edge AI technologies.',
        type: ScholarshipType.RESEARCH,
        status: ScholarshipStatus.PUBLISHED,
        university: 'MIT',
        department: 'Computer Science',
        location: 'Boston, MA',
        country: 'United States',
        isRemote: false,
        amount: 75000,
        stipend: 75000,
        currency: 'USD',
        duration: 12,
        isPaidMonthly: true,
        requirements: [
          'PhD student in AI/ML or related field',
          'Publications in top-tier conferences preferred',
          'Strong mathematical background',
          'Experience with deep learning frameworks'
        ],
        eligibility: { minGpa: 3.7 },
        requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'Research'],
        preferredSkills: ['TensorFlow', 'PyTorch', 'Deep Learning'],
        minGpa: 3.7,
        applicationDeadline: new Date('2024-11-30'),
        deadline: '2024-11-30',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        tags: ['research', 'AI', 'fellowship'],
        field: ['Artificial Intelligence', 'Machine Learning'],
        level: 'PhD',
        studyMode: 'Full-time',
        website: 'https://mit.edu/ai-fellowship',
        contactEmail: 'fellowship@mit.edu',
        isVisible: true,
        viewCount: 245,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        providerName: 'MIT',
        matchScore: 95
      },
      {
        id: 'sch2',
        providerId: '2',
        title: 'Full-Stack Development Research Grant',
        description: 'Looking for talented students to join our research team focusing on modern web technologies and distributed systems. Work on cutting-edge projects with industry impact.',
        type: ScholarshipType.RESEARCH,
        status: ScholarshipStatus.PUBLISHED,
        university: 'Tech University',
        department: 'Computer Science',
        location: 'San Francisco, CA',
        country: 'United States',
        isRemote: true,
        amount: 50000,
        stipend: 50000,
        currency: 'USD',
        duration: 12,
        isPaidMonthly: true,
        requirements: [
          'Currently enrolled in Computer Science or related field',
          'Minimum GPA of 3.5',
          'Portfolio demonstrating web development skills',
          'Available for full-time commitment'
        ],
        eligibility: { minGpa: 3.5 },
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'Database Design'],
        preferredSkills: ['TypeScript', 'Cloud Computing', 'DevOps'],
        minGpa: 3.5,
        applicationDeadline: new Date('2024-12-31'),
        deadline: '2024-12-31',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-12-15'),
        tags: ['full-time', 'research', 'technology'],
        field: ['Computer Science', 'Software Engineering'],
        level: 'Graduate',
        studyMode: 'Full-time',
        website: 'https://techuni.edu/research',
        contactEmail: 'research@techuni.edu',
        isVisible: true,
        viewCount: 189,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        providerName: 'Tech University',
        matchScore: 88
      },
      {
        id: 'sch3',
        providerId: '2',
        title: 'Sustainability Engineering Grant',
        description: 'Research opportunity in renewable energy systems and environmental engineering solutions. Help develop sustainable technologies for the future.',
        type: ScholarshipType.RESEARCH,
        status: ScholarshipStatus.PUBLISHED,
        university: 'Green Tech University',
        department: 'Environmental Engineering',
        location: 'Seattle, WA',
        country: 'United States',
        isRemote: true,
        amount: 45000,
        stipend: 45000,
        currency: 'USD',
        duration: 18,
        isPaidMonthly: true,
        requirements: [
          'Masters or PhD in Environmental Engineering',
          'Research experience in sustainability',
          'Strong analytical skills',
          'Commitment to environmental causes'
        ],
        eligibility: { minGpa: 3.3 },
        requiredSkills: ['Engineering', 'Environmental Science', 'Data Analysis'],
        preferredSkills: ['Renewable Energy', 'CAD Software', 'Project Management'],
        minGpa: 3.3,
        applicationDeadline: new Date('2025-01-15'),
        deadline: '2025-01-15',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2026-07-31'),
        tags: ['sustainability', 'engineering', 'environment'],
        field: ['Environmental Engineering', 'Sustainability'],
        level: 'Graduate',
        studyMode: 'Full-time',
        website: 'https://greentech.edu/grants',
        contactEmail: 'grants@greentech.edu',
        isVisible: true,
        viewCount: 156,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
        providerName: 'Green Tech University',
        matchScore: 72
      },
      {
        id: 'sch4',
        providerId: '2',
        title: 'Google PhD Fellowship',
        description: 'Prestigious fellowship program for PhD students conducting research in computer science and related fields. Includes mentorship and internship opportunities.',
        type: ScholarshipType.RESEARCH,
        status: ScholarshipStatus.PUBLISHED,
        university: 'Google',
        department: 'Research',
        location: 'Mountain View, CA',
        country: 'United States',
        isRemote: false,
        amount: 100000,
        stipend: 100000,
        currency: 'USD',
        duration: 24,
        isPaidMonthly: true,
        requirements: [
          'PhD student in Computer Science',
          'Exceptional research record',
          'Faculty recommendation required',
          'US citizenship or permanent residency'
        ],
        eligibility: { minGpa: 3.8 },
        requiredSkills: ['Research', 'Computer Science', 'Academic Writing'],
        preferredSkills: ['Machine Learning', 'Systems', 'Theory'],
        minGpa: 3.8,
        applicationDeadline: new Date('2024-10-15'),
        deadline: '2024-10-15',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2026-12-31'),
        tags: ['fellowship', 'research', 'google'],
        field: ['Computer Science', 'Research'],
        level: 'PhD',
        studyMode: 'Full-time',
        website: 'https://research.google.com/fellowship',
        contactEmail: 'fellowship@google.com',
        isVisible: true,
        viewCount: 312,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        providerName: 'Google',
        matchScore: 92
      },
      {
        id: 'sch5',
        providerId: '2',
        title: 'Innovation Scholarship Program',
        description: 'Supporting innovative undergraduate and graduate students with groundbreaking project ideas in technology and entrepreneurship.',
        type: ScholarshipType.UNDERGRADUATE,
        status: ScholarshipStatus.PUBLISHED,
        university: 'Innovation Institute',
        department: 'Entrepreneurship',
        location: 'Austin, TX',
        country: 'United States',
        isRemote: true,
        amount: 25000,
        stipend: 25000,
        currency: 'USD',
        duration: 12,
        isPaidMonthly: false,
        requirements: [
          'Undergraduate or Graduate student',
          'Innovative project proposal',
          'Strong academic record',
          'Entrepreneurial mindset'
        ],
        eligibility: { minGpa: 3.0 },
        requiredSkills: ['Innovation', 'Project Management', 'Presentation'],
        preferredSkills: ['Business Development', 'Technology', 'Leadership'],
        minGpa: 3.0,
        applicationDeadline: new Date('2024-11-01'),
        deadline: '2024-11-01',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        tags: ['innovation', 'entrepreneurship', 'merit'],
        field: ['Entrepreneurship', 'Innovation', 'Technology'],
        level: 'Undergraduate',
        studyMode: 'Part-time',
        website: 'https://innovation.edu/scholarship',
        contactEmail: 'scholarship@innovation.edu',
        isVisible: true,
        viewCount: 98,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15'),
        providerName: 'Innovation Institute',
        matchScore: 78
      }
    ];

    // Initialize applications
    this.applications = [
      {
        id: 'app1',
        scholarshipId: 'sch1',
        applicantId: '1',
        status: ApplicationStatus.UNDER_REVIEW,
        coverLetter: 'I am very interested in this AI research opportunity and believe my background aligns well with the requirements. I have experience in machine learning and have published papers in the field.',
        additionalDocs: ['resume.pdf', 'transcript.pdf'],
        submittedAt: new Date('2024-09-15'),
        createdAt: new Date('2024-09-15'),
        updatedAt: new Date('2024-09-20'),
        scholarship: this.scholarships.find(s => s.id === 'sch1'),
        applicant: {
          id: '1',
          name: 'John Student',
          email: 'student@demo.com',
          university: 'Tech University',
          major: 'Computer Science',
          gpa: 3.8,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          profile: {
            university: 'Tech University',
            major: 'Computer Science',
            gpa: 3.8,
            graduationYear: '2025',
            skills: ['Python', 'Machine Learning', 'React', 'Node.js'],
            bio: 'PhD student focusing on AI research with strong background in machine learning.'
          }
        }
      },
      {
        id: 'app2',
        scholarshipId: 'sch2',
        applicantId: '2',
        status: ApplicationStatus.ACCEPTED,
        coverLetter: 'I am excited about the full-stack development research opportunity and have extensive experience in modern web technologies.',
        additionalDocs: ['portfolio.pdf'],
        submittedAt: new Date('2024-08-20'),
        createdAt: new Date('2024-08-20'),
        updatedAt: new Date('2024-08-25'),
        scholarship: this.scholarships.find(s => s.id === 'sch2'),
        applicant: {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@demo.com',
          university: 'Stanford University',
          major: 'Software Engineering',
          gpa: 3.9,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          profile: {
            university: 'Stanford University',
            major: 'Software Engineering',
            gpa: 3.9,
            graduationYear: '2024',
            skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'GraphQL'],
            bio: 'Full-stack developer with passion for creating innovative web applications.'
          }
        }
      },
      {
        id: 'app3',
        scholarshipId: 'sch4',
        applicantId: '3',
        status: ApplicationStatus.SUBMITTED,
        coverLetter: 'The Google PhD Fellowship aligns perfectly with my research goals in distributed systems and cloud computing.',
        additionalDocs: ['research_proposal.pdf', 'publications.pdf'],
        submittedAt: new Date('2024-09-10'),
        createdAt: new Date('2024-09-10'),
        updatedAt: new Date('2024-09-10'),
        scholarship: this.scholarships.find(s => s.id === 'sch4'),
        applicant: {
          id: '3',
          name: 'Michael Chen',
          email: 'michael.chen@demo.com',
          university: 'MIT',
          major: 'Computer Science PhD',
          gpa: 4.0,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
          profile: {
            university: 'MIT',
            major: 'Computer Science PhD',
            gpa: 4.0,
            graduationYear: '2026',
            skills: ['Java', 'Distributed Systems', 'Cloud Computing', 'Kubernetes'],
            bio: 'PhD candidate researching distributed systems and cloud-native technologies.'
          }
        }
      }
    ];

    // Initialize notifications
    this.notifications = [
      {
        id: 'notif1',
        userId: '1',
        title: 'Application Status Update',
        message: 'Your application for MIT AI Research Fellowship is now under review.',
        type: 'info',
        read: false,
        createdAt: new Date('2024-09-28'),
        actionUrl: '/applicant/applications'
      },
      {
        id: 'notif2',
        userId: '1',
        title: 'Application Accepted!',
        message: 'Congratulations! Your application for Full-Stack Development Research Grant has been accepted.',
        type: 'success',
        read: false,
        createdAt: new Date('2024-09-25'),
        actionUrl: '/applicant/applications'
      },
      {
        id: 'notif3',
        userId: '1',
        title: 'Deadline Reminder',
        message: 'Google PhD Fellowship application deadline is in 2 weeks.',
        type: 'warning',
        read: true,
        createdAt: new Date('2024-09-20'),
        actionUrl: '/applicant/scholarships/sch4'
      },
      {
        id: 'notif4',
        userId: '1',
        title: 'New Scholarship Match',
        message: 'We found 3 new scholarships that match your profile.',
        type: 'info',
        read: true,
        createdAt: new Date('2024-09-18'),
        actionUrl: '/applicant/scholarships'
      }
    ];

    // Initialize saved scholarships
    this.savedScholarships = {
      '1': ['sch1', 'sch2', 'sch4']
    };

    // Set current user (for demo purposes)
    this.currentUser = this.users[0]; // John Student
  }

  // Utility methods
  public addScholarship(scholarship: Scholarship) {
    this.scholarships.push(scholarship);
  }

  public updateScholarship(id: string, updates: Partial<Scholarship>) {
    const index = this.scholarships.findIndex(s => s.id === id);
    if (index !== -1) {
      this.scholarships[index] = { ...this.scholarships[index], ...updates };
    }
  }

  public addApplication(application: Application) {
    this.applications.push(application);
  }

  public updateApplicationStatus(id: string, status: ApplicationStatus) {
    const application = this.applications.find(a => a.id === id);
    if (application) {
      application.status = status;
      application.updatedAt = new Date();
    }
  }

  public toggleSavedScholarship(userId: string, scholarshipId: string) {
    if (!this.savedScholarships[userId]) {
      this.savedScholarships[userId] = [];
    }
    
    const saved = this.savedScholarships[userId];
    const index = saved.indexOf(scholarshipId);
    
    if (index === -1) {
      saved.push(scholarshipId);
    } else {
      saved.splice(index, 1);
    }
  }

  public isScholarshipSaved(userId: string, scholarshipId: string): boolean {
    return this.savedScholarships[userId]?.includes(scholarshipId) || false;
  }

  public addNotification(notification: Notification) {
    this.notifications.unshift(notification);
  }

  public markNotificationAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }
}

// =============================================================================
// MOCK API IMPLEMENTATION
// =============================================================================

const store = MockDataStore.getInstance();

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Authentication
  auth: {
    login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
      await delay(500);
      
      const user = store.users.find(u => u.email === credentials.email);
      
      if (!user || credentials.password !== 'password') {
        return { success: false, error: 'Invalid email or password' };
      }
      
      store.currentUser = user;
      
      return {
        success: true,
        data: { user, token: `mock-jwt-token-${user.id}` }
      };
    },

    register: async (credentials: RegisterCredentials): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
      await delay(500);
      
      const existingUser = store.users.find(u => u.email === credentials.email);
      if (existingUser) {
        return { success: false, error: 'Email already registered' };
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
      
      store.users.push(newUser);
      store.currentUser = newUser;
      
      return {
        success: true,
        data: { user: newUser, token: `mock-jwt-token-${newUser.id}` }
      };
    },

    logout: async (): Promise<ApiResponse> => {
      await delay(300);
      store.currentUser = null;
      return { success: true, message: 'Logged out successfully' };
    },

    getCurrentUser: async (): Promise<ApiResponse<AuthUser>> => {
      await delay(200);
      if (!store.currentUser) {
        return { success: false, error: 'Not authenticated' };
      }
      return { success: true, data: store.currentUser };
    }
  },

  // Scholarships
  scholarships: {
    getAll: async (filters?: any): Promise<ApiResponse<Scholarship[]>> => {
      await delay(300);
      let scholarships = [...store.scholarships];
      
      // Apply filters if provided
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        scholarships = scholarships.filter(s => 
          s.title.toLowerCase().includes(search) ||
          s.description.toLowerCase().includes(search) ||
          s.providerName?.toLowerCase().includes(search) ||
          s.field?.some(f => f.toLowerCase().includes(search))
        );
      }
      
      if (filters?.level && filters.level !== 'all') {
        scholarships = scholarships.filter(s => s.level === filters.level);
      }
      
      if (filters?.field && filters.field !== 'all') {
        scholarships = scholarships.filter(s => s.field?.includes(filters.field));
      }
      
      return { success: true, data: scholarships };
    },

    getById: async (id: string): Promise<ApiResponse<Scholarship>> => {
      await delay(300);
      const scholarship = store.scholarships.find(s => s.id === id);
      
      if (!scholarship) {
        return { success: false, error: 'Scholarship not found' };
      }
      
      // Increment view count
      scholarship.viewCount = (scholarship.viewCount || 0) + 1;
      
      return { success: true, data: scholarship };
    },

    getByProvider: async (providerId: string): Promise<ApiResponse<Scholarship[]>> => {
      await delay(300);
      const scholarships = store.scholarships.filter(s => s.providerId === providerId);
      return { success: true, data: scholarships };
    },

    create: async (scholarshipData: Partial<Scholarship>): Promise<ApiResponse<Scholarship>> => {
      await delay(500);
      
      const newScholarship: Scholarship = {
        id: `sch${Date.now()}`,
        providerId: store.currentUser?.id || '2',
        ...scholarshipData,
        status: ScholarshipStatus.PUBLISHED,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Scholarship;
      
      store.addScholarship(newScholarship);
      
      return { success: true, data: newScholarship };
    },

    update: async (id: string, updates: Partial<Scholarship>): Promise<ApiResponse<Scholarship>> => {
      await delay(500);
      
      const scholarship = store.scholarships.find(s => s.id === id);
      if (!scholarship) {
        return { success: false, error: 'Scholarship not found' };
      }
      
      store.updateScholarship(id, { ...updates, updatedAt: new Date() });
      
      return { success: true, data: store.scholarships.find(s => s.id === id)! };
    }
  },

  // Applications
  applications: {
    getByUser: async (userId: string): Promise<ApiResponse<Application[]>> => {
      await delay(300);
      const applications = store.applications.filter(a => a.applicantId === userId);
      return { success: true, data: applications };
    },

    getByScholarship: async (scholarshipId: string): Promise<ApiResponse<Application[]>> => {
      await delay(300);
      const applications = store.applications.filter(a => a.scholarshipId === scholarshipId);
      return { success: true, data: applications };
    },

    submit: async (applicationData: any): Promise<ApiResponse<Application>> => {
      await delay(500);
      
      // Check if already applied
      const existingApplication = store.applications.find(
        a => a.scholarshipId === applicationData.scholarshipId && a.applicantId === applicationData.applicantId
      );
      
      if (existingApplication) {
        return { success: false, error: 'You have already applied to this scholarship' };
      }
      
      const newApplication: Application = {
        id: `app${Date.now()}`,
        scholarshipId: applicationData.scholarshipId,
        applicantId: applicationData.applicantId,
        status: ApplicationStatus.SUBMITTED,
        coverLetter: applicationData.coverLetter,
        additionalDocs: applicationData.additionalDocs || [],
        submittedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        scholarship: store.scholarships.find(s => s.id === applicationData.scholarshipId),
        applicant: {
          id: applicationData.applicantId,
          name: store.currentUser?.name || 'Unknown',
          email: store.currentUser?.email || 'unknown@email.com',
          university: 'Tech University',
          major: 'Computer Science',
          gpa: 3.8,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
        }
      };
      
      store.addApplication(newApplication);
      
      // Add notification
      store.addNotification({
        id: `notif${Date.now()}`,
        userId: applicationData.applicantId,
        title: 'Application Submitted',
        message: `Your application for "${newApplication.scholarship?.title}" has been submitted successfully.`,
        type: 'success',
        read: false,
        createdAt: new Date(),
        actionUrl: '/applicant/applications'
      });
      
      return { success: true, data: newApplication };
    },

    updateStatus: async (id: string, status: ApplicationStatus): Promise<ApiResponse<Application>> => {
      await delay(400);
      
      const application = store.applications.find(a => a.id === id);
      if (!application) {
        return { success: false, error: 'Application not found' };
      }
      
      store.updateApplicationStatus(id, status);
      
      // Add notification
      const statusText = status === ApplicationStatus.ACCEPTED ? 'accepted' : 
                        status === ApplicationStatus.REJECTED ? 'rejected' : 'updated';
      
      store.addNotification({
        id: `notif${Date.now()}`,
        userId: application.applicantId,
        title: 'Application Status Update',
        message: `Your application for "${application.scholarship?.title}" has been ${statusText}.`,
        type: status === ApplicationStatus.ACCEPTED ? 'success' : 
              status === ApplicationStatus.REJECTED ? 'error' : 'info',
        read: false,
        createdAt: new Date(),
        actionUrl: '/applicant/applications'
      });
      
      return { success: true, data: store.applications.find(a => a.id === id)! };
    },

    checkApplicationStatus: async (scholarshipId: string, userId: string): Promise<ApiResponse<{ hasApplied: boolean; application?: Application }>> => {
      await delay(200);
      
      const application = store.applications.find(
        a => a.scholarshipId === scholarshipId && a.applicantId === userId
      );
      
      return {
        success: true,
        data: {
          hasApplied: !!application,
          application
        }
      };
    }
  },

  // Saved Scholarships
  savedScholarships: {
    getByUser: async (userId: string): Promise<ApiResponse<string[]>> => {
      await delay(200);
      return { success: true, data: store.savedScholarships[userId] || [] };
    },

    toggle: async (userId: string, scholarshipId: string): Promise<ApiResponse<{ saved: boolean }>> => {
      await delay(300);
      
      const wasSaved = store.isScholarshipSaved(userId, scholarshipId);
      store.toggleSavedScholarship(userId, scholarshipId);
      
      return {
        success: true,
        data: { saved: !wasSaved }
      };
    }
  },

  // Notifications
  notifications: {
    getByUser: async (userId: string): Promise<ApiResponse<Notification[]>> => {
      await delay(300);
      const notifications = store.notifications.filter(n => n.userId === userId);
      return { success: true, data: notifications };
    },

    markAsRead: async (id: string): Promise<ApiResponse> => {
      await delay(200);
      store.markNotificationAsRead(id);
      return { success: true, message: 'Notification marked as read' };
    },

    markAllAsRead: async (userId: string): Promise<ApiResponse> => {
      await delay(300);
      store.notifications
        .filter(n => n.userId === userId && !n.read)
        .forEach(n => n.read = true);
      return { success: true, message: 'All notifications marked as read' };
    }
  },

  // Profile
  profiles: {
    getById: async (userId: string): Promise<ApiResponse<UserProfile>> => {
      await delay(300);
      const profile = store.profiles.find(p => p.userId === userId);
      
      if (!profile) {
        return { success: false, error: 'Profile not found' };
      }
      
      return { success: true, data: profile };
    },

    update: async (userId: string, profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
      await delay(500);
      
      const profileIndex = store.profiles.findIndex(p => p.userId === userId);
      if (profileIndex === -1) {
        return { success: false, error: 'Profile not found' };
      }
      
      store.profiles[profileIndex] = { 
        ...store.profiles[profileIndex], 
        ...profileData,
        updatedAt: new Date()
      };
      
      return { success: true, data: store.profiles[profileIndex] };
    }
  },

  // Analytics (for provider)
  analytics: {
    getDashboardStats: async (providerId: string): Promise<ApiResponse<any>> => {
      await delay(300);
      
      const providerScholarships = store.scholarships.filter(s => s.providerId === providerId);
      const scholarshipIds = providerScholarships.map(s => s.id);
      const applications = store.applications.filter(a => scholarshipIds.includes(a.scholarshipId));
      
      const stats = {
        totalScholarships: providerScholarships.length,
        totalApplications: applications.length,
        acceptedApplications: applications.filter(a => a.status === ApplicationStatus.ACCEPTED).length,
        pendingApplications: applications.filter(a => a.status === ApplicationStatus.SUBMITTED || a.status === ApplicationStatus.UNDER_REVIEW).length,
        averageApplicationsPerScholarship: applications.length / Math.max(providerScholarships.length, 1)
      };
      
      return { success: true, data: stats };
    }
  }
};

// Export the store instance for direct access if needed
export const dataStore = store;

// Export commonly used data
export const mockScholarships = store.scholarships;
export const mockApplications = store.applications;
export const mockNotifications = store.notifications;
export const mockUsers = store.users;
export const mockProfiles = store.profiles;