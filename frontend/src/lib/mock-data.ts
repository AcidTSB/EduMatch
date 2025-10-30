/**
 * UNIFIED MOCK DATA SYSTEM
 * Centralized mock data that syncs across Admin, Provider, and Student dashboards
 * All relationships (user->scholarship->application) are properly linked
 */

import { 
  AuthUser, 
  UserRole, 
  Scholarship, 
  ScholarshipStatus,
  ScholarshipType,
  Application,
  ApplicationStatus,
  Notification,
  UserProfile
} from '@/types';

// =============================================================================
// USERS - Core user accounts (Admin, Providers, Students)
// =============================================================================

export const USERS: AuthUser[] = [
  // ==================== ADMIN ====================
  {
    id: 'admin-1',
    email: 'admin@edumatch.com',
    name: 'System Admin',
    role: UserRole.ADMIN,
    emailVerified: true,
    status: 'ACTIVE' as any,
    subscriptionType: 'FREE' as any,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2025-01-01'),
  },

  // ==================== PROVIDERS ====================
  {
    id: 'provider-1',
    email: 'mit@scholarships.edu',
    name: 'MIT Research Lab',
    role: UserRole.PROVIDER,
    emailVerified: true,
    status: 'ACTIVE' as any,
    subscriptionType: 'PREMIUM' as any,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'provider-2',
    email: 'stanford@scholarships.edu',
    name: 'Stanford University',
    role: UserRole.PROVIDER,
    emailVerified: true,
    status: 'ACTIVE' as any,
    subscriptionType: 'PREMIUM' as any,
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2025-01-09'),
  },
  {
    id: 'provider-3',
    email: 'google@scholarships.com',
    name: 'Google Education',
    role: UserRole.PROVIDER,
    emailVerified: true,
    status: 'ACTIVE' as any,
    subscriptionType: 'ENTERPRISE' as any,
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2025-01-08'),
  },
  {
    id: 'provider-4',
    email: 'berkeley@scholarships.edu',
    name: 'UC Berkeley',
    role: UserRole.PROVIDER,
    emailVerified: true,
    status: 'ACTIVE' as any,
    subscriptionType: 'PREMIUM' as any,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2025-01-07'),
  },

  // ==================== STUDENTS ====================
  {
    id: 'student-1',
    email: 'john.doe@student.edu',
    name: 'John Doe',
    role: UserRole.STUDENT,
    emailVerified: true,
    status: 'ACTIVE' as any,
    subscriptionType: 'FREE' as any,
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: 'student-2',
    email: 'jane.smith@student.edu',
    name: 'Jane Smith',
    role: UserRole.STUDENT,
    emailVerified: true,
    status: 'ACTIVE' as any,
    subscriptionType: 'PREMIUM' as any,
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2025-01-11'),
  },
  {
    id: 'student-3',
    email: 'mike.johnson@student.edu',
    name: 'Mike Johnson',
    role: UserRole.STUDENT,
    emailVerified: true,
    status: 'ACTIVE' as any,
    subscriptionType: 'FREE' as any,
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2025-01-09'),
  },
  {
    id: 'student-4',
    email: 'emily.chen@student.edu',
    name: 'Emily Chen',
    role: UserRole.STUDENT,
    emailVerified: true,
    status: 'ACTIVE' as any,
    subscriptionType: 'FREE' as any,
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'student-5',
    email: 'sarah.williams@student.edu',
    name: 'Sarah Williams',
    role: UserRole.STUDENT,
    emailVerified: true,
    status: 'ACTIVE' as any,
    subscriptionType: 'PREMIUM' as any,
    createdAt: new Date('2024-09-05'),
    updatedAt: new Date('2025-01-08'),
  },
];

// =============================================================================
// USER PROFILES - Extended profile information
// =============================================================================

export const USER_PROFILES: UserProfile[] = [
  // Student Profiles
  {
    id: 'profile-student-1',
    userId: 'student-1',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 (555) 123-4567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    bio: 'Computer Science student passionate about AI and Machine Learning',
    currentLocation: 'San Francisco, CA',
    university: 'Stanford University',
    major: 'Computer Science',
    gpa: 3.8,
    graduationYear: 2026,
    verified: true,
    skills: ['Python', 'JavaScript', 'React', 'TensorFlow', 'AWS'],
    interests: ['Artificial Intelligence', 'Web Development', 'Cloud Computing'],
    languages: ['English', 'Spanish'],
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: 'profile-student-2',
    userId: 'student-2',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1 (555) 234-5678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    bio: 'UX Designer and Frontend Developer creating beautiful user experiences',
    currentLocation: 'New York, NY',
    university: 'MIT',
    major: 'Design & Computer Science',
    gpa: 3.9,
    graduationYear: 2025,
    verified: true,
    skills: ['Figma', 'React', 'TypeScript', 'UI/UX Design', 'HTML/CSS'],
    interests: ['User Experience', 'Interface Design', 'Accessibility'],
    languages: ['English', 'French'],
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2025-01-11'),
  },
  {
    id: 'profile-student-3',
    userId: 'student-3',
    firstName: 'Mike',
    lastName: 'Johnson',
    phone: '+1 (555) 345-6789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    bio: 'Data Science enthusiast with focus on predictive analytics',
    currentLocation: 'Boston, MA',
    university: 'Harvard University',
    major: 'Statistics & Data Science',
    gpa: 3.7,
    graduationYear: 2026,
    verified: true,
    skills: ['Python', 'R', 'SQL', 'Tableau', 'Machine Learning'],
    interests: ['Data Analytics', 'Statistics', 'Business Intelligence'],
    languages: ['English'],
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2025-01-09'),
  },
  {
    id: 'profile-student-4',
    userId: 'student-4',
    firstName: 'Emily',
    lastName: 'Chen',
    phone: '+1 (555) 456-7890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    bio: 'Cybersecurity researcher focused on network security',
    currentLocation: 'Austin, TX',
    university: 'UC Berkeley',
    major: 'Cybersecurity',
    gpa: 3.85,
    graduationYear: 2025,
    verified: true,
    skills: ['Network Security', 'Penetration Testing', 'Python', 'Linux', 'Cryptography'],
    interests: ['Information Security', 'Ethical Hacking', 'Privacy'],
    languages: ['English', 'Mandarin'],
    createdAt: new Date('2024-08-20'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'profile-student-5',
    userId: 'student-5',
    firstName: 'Sarah',
    lastName: 'Williams',
    phone: '+1 (555) 567-8901',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Full-stack developer building scalable web applications',
    currentLocation: 'Seattle, WA',
    university: 'University of Washington',
    major: 'Software Engineering',
    gpa: 3.75,
    graduationYear: 2025,
    verified: true,
    skills: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'Kubernetes'],
    interests: ['Cloud Architecture', 'DevOps', 'Microservices'],
    languages: ['English'],
    createdAt: new Date('2024-09-05'),
    updatedAt: new Date('2025-01-08'),
  },

  // Provider Profiles
  {
    id: 'profile-provider-1',
    userId: 'provider-1',
    firstName: 'MIT',
    lastName: 'Research',
    phone: '+1 (617) 253-1000',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MIT',
    bio: 'Leading research institution offering scholarships for innovative students',
    currentLocation: 'Cambridge, MA',
    organizationName: 'MIT Research Lab',
    website: 'https://web.mit.edu',
    verified: true,
    skills: [],
    interests: [],
    languages: ['English'],
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'profile-provider-2',
    userId: 'provider-2',
    firstName: 'Stanford',
    lastName: 'University',
    phone: '+1 (650) 723-2300',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Stanford',
    bio: 'Stanford University - Supporting excellence in education',
    currentLocation: 'Stanford, CA',
    organizationName: 'Stanford University',
    website: 'https://www.stanford.edu',
    verified: true,
    skills: [],
    interests: [],
    languages: ['English'],
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2025-01-09'),
  },
  {
    id: 'profile-provider-3',
    userId: 'provider-3',
    firstName: 'Google',
    lastName: 'Education',
    phone: '+1 (650) 253-0000',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Google',
    bio: 'Google Education Foundation - Empowering the next generation of technologists',
    currentLocation: 'Mountain View, CA',
    organizationName: 'Google Education Foundation',
    website: 'https://edu.google.com',
    verified: true,
    skills: [],
    interests: [],
    languages: ['English'],
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2025-01-08'),
  },
  {
    id: 'profile-provider-4',
    userId: 'provider-4',
    firstName: 'UC',
    lastName: 'Berkeley',
    phone: '+1 (510) 642-6000',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Berkeley',
    bio: 'UC Berkeley - Excellence and equity in education',
    currentLocation: 'Berkeley, CA',
    organizationName: 'University of California, Berkeley',
    website: 'https://www.berkeley.edu',
    verified: true,
    skills: [],
    interests: [],
    languages: ['English'],
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2025-01-07'),
  },
];

// =============================================================================
// SCHOLARSHIPS
// =============================================================================

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'scholarship-1',
    providerId: 'provider-1',
    title: 'MIT AI Research Fellowship 2025',
    description: 'Full scholarship for graduate students pursuing AI and Machine Learning research at MIT',
    type: ScholarshipType.GRADUATE,
    status: ScholarshipStatus.PUBLISHED,
    university: 'Massachusetts Institute of Technology',
    department: 'Computer Science',
    location: 'Cambridge, MA',
    isRemote: false,
    amount: 50000,
    currency: 'USD',
    duration: 24,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.5,
      englishProficiency: 'TOEFL 100+',
      documents: ['CV', 'Research Proposal', 'Transcripts']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 22, max: 35 }
    },
    requiredSkills: ['Python', 'TensorFlow', 'Research'],
    preferredSkills: ['PyTorch', 'NLP', 'Computer Vision'],
    minGpa: 3.5,
    applicationDeadline: new Date('2025-03-31'),
    startDate: new Date('2025-09-01'),
    endDate: new Date('2027-08-31'),
    tags: ['AI', 'Machine Learning', 'Research', 'Graduate'],
    website: 'https://web.mit.edu/fellowships',
    contactEmail: 'fellowships@mit.edu',
    isVisible: true,
    viewCount: 1250,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'scholarship-2',
    providerId: 'provider-2',
    title: 'Stanford Cybersecurity Excellence Program',
    description: 'Comprehensive scholarship for outstanding students in cybersecurity and network security',
    type: ScholarshipType.GRADUATE,
    status: ScholarshipStatus.PUBLISHED,
    university: 'Stanford University',
    department: 'Computer Science',
    location: 'Stanford, CA',
    isRemote: false,
    amount: 45000,
    currency: 'USD',
    duration: 24,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.6,
      englishProficiency: 'TOEFL 95+',
      documents: ['CV', 'Statement of Purpose', 'Recommendation Letters']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 21, max: 30 }
    },
    requiredSkills: ['Network Security', 'Cryptography', 'Linux'],
    preferredSkills: ['Penetration Testing', 'Ethical Hacking'],
    minGpa: 3.6,
    applicationDeadline: new Date('2025-04-15'),
    startDate: new Date('2025-09-15'),
    endDate: new Date('2027-06-15'),
    tags: ['Cybersecurity', 'Network Security', 'Graduate'],
    website: 'https://www.stanford.edu/cybersecurity',
    contactEmail: 'cybersec@stanford.edu',
    isVisible: true,
    viewCount: 980,
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2025-01-09'),
  },
  {
    id: 'scholarship-3',
    providerId: 'provider-3',
    title: 'Google UX Design Scholarship',
    description: 'Supporting the next generation of UX designers with full tuition coverage',
    type: ScholarshipType.UNDERGRADUATE,
    status: ScholarshipStatus.PUBLISHED,
    university: 'Various Partner Universities',
    location: 'Remote/Online',
    isRemote: true,
    amount: 30000,
    currency: 'USD',
    duration: 12,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.3,
      documents: ['Portfolio', 'CV', 'Design Samples']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 18, max: 25 }
    },
    requiredSkills: ['Figma', 'UI/UX Design', 'Prototyping'],
    preferredSkills: ['HTML/CSS', 'JavaScript', 'User Research'],
    minGpa: 3.3,
    applicationDeadline: new Date('2025-05-01'),
    startDate: new Date('2025-09-01'),
    tags: ['UX Design', 'UI Design', 'Undergraduate'],
    website: 'https://edu.google.com/scholarships',
    contactEmail: 'scholarships@google.com',
    isVisible: true,
    viewCount: 1520,
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2025-01-08'),
  },
  {
    id: 'scholarship-4',
    providerId: 'provider-4',
    title: 'Berkeley Data Science Fellowship',
    description: 'Advanced fellowship for data science researchers and practitioners',
    type: ScholarshipType.PHD,
    status: ScholarshipStatus.PUBLISHED,
    university: 'UC Berkeley',
    department: 'Statistics',
    location: 'Berkeley, CA',
    isRemote: false,
    amount: 55000,
    currency: 'USD',
    duration: 48,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.7,
      englishProficiency: 'TOEFL 105+',
      documents: ['Research Proposal', 'Publications', 'CV', 'Transcripts']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 24, max: 40 }
    },
    requiredSkills: ['Python', 'R', 'Statistics', 'Machine Learning'],
    preferredSkills: ['Deep Learning', 'Big Data', 'SQL'],
    minGpa: 3.7,
    applicationDeadline: new Date('2025-02-28'),
    startDate: new Date('2025-08-01'),
    endDate: new Date('2029-07-31'),
    tags: ['Data Science', 'Statistics', 'PhD', 'Research'],
    website: 'https://www.berkeley.edu/datascience',
    contactEmail: 'datascience@berkeley.edu',
    isVisible: true,
    viewCount: 850,
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2025-01-07'),
  },
  {
    id: 'scholarship-5',
    providerId: 'provider-1',
    title: 'MIT Software Engineering Scholarship',
    description: 'Merit-based scholarship for exceptional software engineering students',
    type: ScholarshipType.UNDERGRADUATE,
    status: ScholarshipStatus.PUBLISHED,
    university: 'MIT',
    department: 'EECS',
    location: 'Cambridge, MA',
    isRemote: false,
    amount: 35000,
    currency: 'USD',
    duration: 36,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.6,
      englishProficiency: 'TOEFL 100+',
      documents: ['CV', 'GitHub Profile', 'Coding Samples']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 18, max: 24 }
    },
    requiredSkills: ['JavaScript', 'Python', 'Git'],
    preferredSkills: ['React', 'Node.js', 'Docker'],
    minGpa: 3.6,
    applicationDeadline: new Date('2025-04-30'),
    startDate: new Date('2025-09-01'),
    tags: ['Software Engineering', 'Programming', 'Undergraduate'],
    website: 'https://web.mit.edu/eecs',
    contactEmail: 'eecs@mit.edu',
    isVisible: true,
    viewCount: 1680,
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2025-01-06'),
  },
  {
    id: 'scholarship-6',
    providerId: 'provider-3',
    title: 'Google Cloud Computing Scholarship',
    description: 'Cloud infrastructure and development scholarship program',
    type: ScholarshipType.GRADUATE,
    status: ScholarshipStatus.PUBLISHED,
    university: 'Various Partner Universities',
    location: 'Remote/Hybrid',
    isRemote: true,
    amount: 40000,
    currency: 'USD',
    duration: 24,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.4,
      documents: ['CV', 'Cloud Certifications', 'Project Portfolio']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 22, max: 35 }
    },
    requiredSkills: ['AWS', 'Docker', 'Kubernetes'],
    preferredSkills: ['GCP', 'Terraform', 'CI/CD'],
    minGpa: 3.4,
    applicationDeadline: new Date('2025-06-30'),
    startDate: new Date('2025-10-01'),
    tags: ['Cloud Computing', 'DevOps', 'Infrastructure'],
    website: 'https://cloud.google.com/edu',
    contactEmail: 'cloud-edu@google.com',
    isVisible: true,
    viewCount: 1120,
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: 'scholarship-7',
    providerId: 'provider-2',
    title: 'Stanford Computer Science Merit Award',
    description: 'Prestigious scholarship for top computer science students',
    type: ScholarshipType.UNDERGRADUATE,
    status: ScholarshipStatus.DRAFT,
    university: 'Stanford University',
    department: 'Computer Science',
    location: 'Stanford, CA',
    isRemote: false,
    amount: 42000,
    currency: 'USD',
    duration: 48,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.8,
      englishProficiency: 'TOEFL 110+',
      documents: ['CV', 'Academic Records', 'Essays']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 17, max: 22 }
    },
    requiredSkills: ['Programming', 'Algorithms', 'Data Structures'],
    preferredSkills: ['C++', 'Java', 'Python'],
    minGpa: 3.8,
    applicationDeadline: new Date('2025-12-15'),
    startDate: new Date('2026-09-01'),
    tags: ['Computer Science', 'Merit-Based', 'Undergraduate'],
    website: 'https://www.stanford.edu/cs',
    contactEmail: 'cs-scholarships@stanford.edu',
    isVisible: false,
    viewCount: 0,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-04'),
  },
  // NEW SCHOLARSHIPS WITH VALID DEADLINES (November 2025 - March 2026)
  {
    id: 'scholarship-8',
    providerId: 'provider-1',
    title: 'MIT Artificial Intelligence Winter Program 2026',
    description: 'Intensive AI research program with full funding for exceptional graduate students. Focus on cutting-edge machine learning, neural networks, and AI applications.',
    type: ScholarshipType.GRADUATE,
    status: ScholarshipStatus.PUBLISHED,
    university: 'Massachusetts Institute of Technology',
    department: 'Computer Science & AI Lab',
    location: 'Cambridge, MA',
    isRemote: false,
    amount: 52000,
    currency: 'USD',
    duration: 24,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.6,
      englishProficiency: 'TOEFL 105+ or IELTS 7.5+',
      documents: ['CV', 'Research Proposal', 'Transcripts', '2 Recommendation Letters']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 22, max: 35 }
    },
    requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'Research'],
    preferredSkills: ['TensorFlow', 'PyTorch', 'Computer Vision', 'NLP'],
    minGpa: 3.6,
    applicationDeadline: new Date('2025-12-31'),
    startDate: new Date('2026-02-01'),
    endDate: new Date('2028-01-31'),
    tags: ['AI', 'Machine Learning', 'Deep Learning', 'Research', 'Graduate'],
    website: 'https://web.mit.edu/ai-fellowship',
    contactEmail: 'ai-fellowship@mit.edu',
    isVisible: true,
    viewCount: 245,
    createdAt: new Date('2025-10-01'),
    updatedAt: new Date('2025-10-20'),
  },
  {
    id: 'scholarship-9',
    providerId: 'provider-2',
    title: 'Stanford Full-Stack Development Scholarship 2026',
    description: 'Comprehensive scholarship for aspiring full-stack developers. Covers tuition, living expenses, and includes mentorship from industry professionals.',
    type: ScholarshipType.UNDERGRADUATE,
    status: ScholarshipStatus.PUBLISHED,
    university: 'Stanford University',
    department: 'Computer Science',
    location: 'Stanford, CA',
    isRemote: false,
    amount: 48000,
    currency: 'USD',
    duration: 24,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.4,
      englishProficiency: 'TOEFL 95+',
      documents: ['CV', 'Portfolio', 'GitHub Profile', 'Personal Statement']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 18, max: 25 }
    },
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
    preferredSkills: ['TypeScript', 'Next.js', 'MongoDB', 'Docker'],
    minGpa: 3.4,
    applicationDeadline: new Date('2025-11-30'),
    startDate: new Date('2026-01-15'),
    endDate: new Date('2028-01-15'),
    tags: ['Full-Stack', 'Web Development', 'JavaScript', 'Undergraduate'],
    website: 'https://www.stanford.edu/fullstack',
    contactEmail: 'fullstack@stanford.edu',
    isVisible: true,
    viewCount: 387,
    createdAt: new Date('2025-10-05'),
    updatedAt: new Date('2025-10-21'),
  },
  {
    id: 'scholarship-10',
    providerId: 'provider-3',
    title: 'Google Data Science & Analytics Scholarship',
    description: 'Elite program for data science enthusiasts. Includes access to Google Cloud Platform, mentorship, and potential internship opportunities.',
    type: ScholarshipType.GRADUATE,
    status: ScholarshipStatus.PUBLISHED,
    university: 'Various Partner Universities',
    location: 'Remote/Hybrid',
    isRemote: true,
    amount: 45000,
    currency: 'USD',
    duration: 18,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.5,
      documents: ['CV', 'Data Analysis Portfolio', 'Kaggle Profile', 'Statement of Purpose']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 21, max: 32 }
    },
    requiredSkills: ['Python', 'SQL', 'Statistics', 'Data Visualization'],
    preferredSkills: ['R', 'Tableau', 'Machine Learning', 'Big Data'],
    minGpa: 3.5,
    applicationDeadline: new Date('2026-01-31'),
    startDate: new Date('2026-03-01'),
    endDate: new Date('2027-08-31'),
    tags: ['Data Science', 'Analytics', 'Machine Learning', 'Remote'],
    website: 'https://edu.google.com/data-science',
    contactEmail: 'datascience@google.com',
    isVisible: true,
    viewCount: 562,
    createdAt: new Date('2025-10-10'),
    updatedAt: new Date('2025-10-22'),
  },
  {
    id: 'scholarship-11',
    providerId: 'provider-4',
    title: 'UC Berkeley Quantum Computing Research Fellowship',
    description: 'Groundbreaking research fellowship in quantum computing and quantum information science. Full funding plus research budget.',
    type: ScholarshipType.PHD,
    status: ScholarshipStatus.PUBLISHED,
    university: 'UC Berkeley',
    department: 'Physics & Computer Science',
    location: 'Berkeley, CA',
    isRemote: false,
    amount: 58000,
    currency: 'USD',
    duration: 60,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.8,
      englishProficiency: 'TOEFL 110+',
      documents: ['Research Proposal', 'Publications', 'CV', 'Transcripts', '3 Recommendation Letters']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 24, max: 40 }
    },
    requiredSkills: ['Quantum Mechanics', 'Linear Algebra', 'Python', 'Research'],
    preferredSkills: ['Qiskit', 'Quantum Algorithms', 'C++', 'MATLAB'],
    minGpa: 3.8,
    applicationDeadline: new Date('2025-12-15'),
    startDate: new Date('2026-08-01'),
    endDate: new Date('2031-07-31'),
    tags: ['Quantum Computing', 'Physics', 'PhD', 'Research', 'Cutting-edge'],
    website: 'https://www.berkeley.edu/quantum',
    contactEmail: 'quantum@berkeley.edu',
    isVisible: true,
    viewCount: 189,
    createdAt: new Date('2025-10-08'),
    updatedAt: new Date('2025-10-20'),
  },
  {
    id: 'scholarship-12',
    providerId: 'provider-1',
    title: 'MIT Blockchain & Web3 Innovation Scholarship',
    description: 'Forward-thinking scholarship for students passionate about blockchain technology, cryptocurrency, and decentralized applications.',
    type: ScholarshipType.GRADUATE,
    status: ScholarshipStatus.PUBLISHED,
    university: 'Massachusetts Institute of Technology',
    department: 'Sloan School of Management & CSAIL',
    location: 'Cambridge, MA',
    isRemote: false,
    amount: 46000,
    currency: 'USD',
    duration: 24,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.5,
      englishProficiency: 'TOEFL 100+',
      documents: ['CV', 'Blockchain Project Portfolio', 'Technical Whitepaper', 'Recommendation Letters']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 22, max: 35 }
    },
    requiredSkills: ['Solidity', 'Smart Contracts', 'Ethereum', 'Cryptography'],
    preferredSkills: ['Web3.js', 'DeFi', 'NFTs', 'Rust'],
    minGpa: 3.5,
    applicationDeadline: new Date('2026-02-28'),
    startDate: new Date('2026-09-01'),
    endDate: new Date('2028-08-31'),
    tags: ['Blockchain', 'Web3', 'Cryptocurrency', 'DeFi', 'Graduate'],
    website: 'https://web.mit.edu/blockchain',
    contactEmail: 'blockchain@mit.edu',
    isVisible: true,
    viewCount: 421,
    createdAt: new Date('2025-10-12'),
    updatedAt: new Date('2025-10-22'),
  },
  {
    id: 'scholarship-13',
    providerId: 'provider-2',
    title: 'Stanford Mobile App Development Excellence Award',
    description: 'Scholarship for talented mobile developers specializing in iOS and Android development. Includes Apple and Google certification programs.',
    type: ScholarshipType.UNDERGRADUATE,
    status: ScholarshipStatus.PUBLISHED,
    university: 'Stanford University',
    department: 'Computer Science',
    location: 'Stanford, CA',
    isRemote: false,
    amount: 38000,
    currency: 'USD',
    duration: 36,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.3,
      englishProficiency: 'TOEFL 90+',
      documents: ['CV', 'App Portfolio', 'App Store/Play Store Links', 'Personal Statement']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 18, max: 24 }
    },
    requiredSkills: ['Swift', 'Kotlin', 'React Native', 'UI/UX'],
    preferredSkills: ['Flutter', 'Firebase', 'API Integration', 'CI/CD'],
    minGpa: 3.3,
    applicationDeadline: new Date('2026-01-15'),
    startDate: new Date('2026-09-01'),
    endDate: new Date('2029-06-01'),
    tags: ['Mobile Development', 'iOS', 'Android', 'React Native', 'Undergraduate'],
    website: 'https://www.stanford.edu/mobile-dev',
    contactEmail: 'mobile-dev@stanford.edu',
    isVisible: true,
    viewCount: 298,
    createdAt: new Date('2025-10-15'),
    updatedAt: new Date('2025-10-22'),
  },
  {
    id: 'scholarship-14',
    providerId: 'provider-3',
    title: 'Google Cloud & DevOps Engineering Scholarship',
    description: 'Comprehensive scholarship covering cloud infrastructure, DevOps practices, and site reliability engineering with hands-on Google Cloud training.',
    type: ScholarshipType.GRADUATE,
    status: ScholarshipStatus.PUBLISHED,
    university: 'Various Partner Universities',
    location: 'Remote',
    isRemote: true,
    amount: 43000,
    currency: 'USD',
    duration: 24,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.4,
      documents: ['CV', 'Cloud Certifications', 'DevOps Project Portfolio', 'GitHub Profile']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 21, max: 35 }
    },
    requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    preferredSkills: ['GCP', 'Terraform', 'Jenkins', 'Prometheus'],
    minGpa: 3.4,
    applicationDeadline: new Date('2025-11-25'),
    startDate: new Date('2026-01-10'),
    endDate: new Date('2028-01-10'),
    tags: ['Cloud Computing', 'DevOps', 'GCP', 'Kubernetes', 'Remote'],
    website: 'https://cloud.google.com/edu/devops',
    contactEmail: 'devops-edu@google.com',
    isVisible: true,
    viewCount: 334,
    createdAt: new Date('2025-10-18'),
    updatedAt: new Date('2025-10-22'),
  },
  {
    id: 'scholarship-15',
    providerId: 'provider-4',
    title: 'Berkeley Bioinformatics & Computational Biology Scholarship',
    description: 'Interdisciplinary scholarship for students at the intersection of biology, computer science, and data analysis.',
    type: ScholarshipType.PHD,
    status: ScholarshipStatus.PUBLISHED,
    university: 'UC Berkeley',
    department: 'Molecular & Cell Biology',
    location: 'Berkeley, CA',
    isRemote: false,
    amount: 54000,
    currency: 'USD',
    duration: 60,
    isPaidMonthly: true,
    requirements: {
      minGpa: 3.7,
      englishProficiency: 'TOEFL 105+',
      documents: ['Research Proposal', 'CV', 'Transcripts', 'Publications (if any)', '3 Recommendation Letters']
    },
    eligibility: {
      citizenship: ['Any'],
      ageRange: { min: 24, max: 40 }
    },
    requiredSkills: ['Python', 'R', 'Statistics', 'Biology'],
    preferredSkills: ['Genomics', 'Proteomics', 'Machine Learning', 'Next-gen Sequencing'],
    minGpa: 3.7,
    applicationDeadline: new Date('2026-03-15'),
    startDate: new Date('2026-09-01'),
    endDate: new Date('2031-08-31'),
    tags: ['Bioinformatics', 'Computational Biology', 'PhD', 'Research', 'Genomics'],
    website: 'https://www.berkeley.edu/bioinformatics',
    contactEmail: 'bioinformatics@berkeley.edu',
    isVisible: true,
    viewCount: 167,
    createdAt: new Date('2025-10-20'),
    updatedAt: new Date('2025-10-22'),
  },
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
    coverLetter: 'I am deeply passionate about AI research and have completed several projects in NLP...',
    cv: 'https://storage.example.com/resumes/john-doe.pdf',
    additionalDocs: ['research-proposal.pdf', 'transcripts.pdf'],
    submittedAt: new Date('2024-12-15'),
    reviewedAt: new Date('2025-01-05'),
    respondedAt: new Date('2025-01-08'),
    feedback: 'Excellent research proposal. Strong academic background.',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2025-01-08'),
  },
  {
    id: 'app-2',
    applicantId: 'student-1',
    scholarshipId: 'scholarship-5',
    status: ApplicationStatus.SUBMITTED,
    coverLetter: 'My passion for software engineering started in high school...',
    cv: 'https://storage.example.com/resumes/john-doe.pdf',
    additionalDocs: ['github-profile.pdf'],
    submittedAt: new Date('2025-01-10'),
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'app-3',
    applicantId: 'student-2',
    scholarshipId: 'scholarship-3',
    status: ApplicationStatus.UNDER_REVIEW,
    coverLetter: 'As a UX designer, I believe user experience is paramount...',
    cv: 'https://storage.example.com/resumes/jane-smith.pdf',
    additionalDocs: ['portfolio.pdf', 'design-samples.pdf'],
    submittedAt: new Date('2024-12-20'),
    reviewedAt: new Date('2025-01-02'),
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2025-01-09'),
  },
  {
    id: 'app-4',
    applicantId: 'student-2',
    scholarshipId: 'scholarship-6',
    status: ApplicationStatus.SUBMITTED,
    coverLetter: 'Cloud computing is the future of technology infrastructure...',
    cv: 'https://storage.example.com/resumes/jane-smith.pdf',
    additionalDocs: ['aws-cert.pdf', 'projects.pdf'],
    submittedAt: new Date('2025-01-11'),
    createdAt: new Date('2025-01-09'),
    updatedAt: new Date('2025-01-11'),
  },
  {
    id: 'app-5',
    applicantId: 'student-3',
    scholarshipId: 'scholarship-4',
    status: ApplicationStatus.UNDER_REVIEW,
    coverLetter: 'Data science combines my love for statistics and programming...',
    cv: 'https://storage.example.com/resumes/mike-johnson.pdf',
    additionalDocs: ['research-proposal.pdf', 'publications.pdf'],
    submittedAt: new Date('2024-12-05'),
    reviewedAt: new Date('2024-12-28'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'app-6',
    applicantId: 'student-3',
    scholarshipId: 'scholarship-1',
    status: ApplicationStatus.SUBMITTED,
    coverLetter: 'My interest in AI and data science makes this fellowship ideal...',
    cv: 'https://storage.example.com/resumes/mike-johnson.pdf',
    additionalDocs: ['transcripts.pdf'],
    submittedAt: new Date('2025-01-12'),
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: 'app-7',
    applicantId: 'student-4',
    scholarshipId: 'scholarship-2',
    status: ApplicationStatus.REJECTED,
    coverLetter: 'Cybersecurity is my passion and expertise...',
    cv: 'https://storage.example.com/resumes/emily-chen.pdf',
    additionalDocs: ['certifications.pdf'],
    submittedAt: new Date('2024-12-01'),
    reviewedAt: new Date('2024-12-20'),
    respondedAt: new Date('2024-12-22'),
    feedback: 'Strong application but highly competitive this year.',
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-12-22'),
  },
  {
    id: 'app-8',
    applicantId: 'student-5',
    scholarshipId: 'scholarship-5',
    status: ApplicationStatus.UNDER_REVIEW,
    coverLetter: 'Full-stack development is where I thrive...',
    cv: 'https://storage.example.com/resumes/sarah-williams.pdf',
    additionalDocs: ['github-profile.pdf', 'projects.pdf'],
    submittedAt: new Date('2024-12-22'),
    reviewedAt: new Date('2025-01-04'),
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2025-01-11'),
  },
  {
    id: 'app-9',
    applicantId: 'student-5',
    scholarshipId: 'scholarship-6',
    status: ApplicationStatus.SUBMITTED,
    coverLetter: 'My experience with cloud platforms makes me a strong candidate...',
    cv: 'https://storage.example.com/resumes/sarah-williams.pdf',
    additionalDocs: ['aws-cert.pdf', 'kubernetes-projects.pdf'],
    submittedAt: new Date('2025-01-09'),
    createdAt: new Date('2025-01-07'),
    updatedAt: new Date('2025-01-09'),
  },
  {
    id: 'app-10',
    applicantId: 'student-1',
    scholarshipId: 'scholarship-2',
    status: ApplicationStatus.WAITLISTED,
    coverLetter: 'While my primary focus is AI, cybersecurity fascinates me...',
    cv: 'https://storage.example.com/resumes/john-doe.pdf',
    additionalDocs: ['projects.pdf'],
    submittedAt: new Date('2024-12-18'),
    reviewedAt: new Date('2025-01-06'),
    createdAt: new Date('2024-12-16'),
    updatedAt: new Date('2025-01-06'),
  },
];

// =============================================================================
// NOTIFICATIONS
// =============================================================================

export const NOTIFICATIONS: Notification[] = [
  // Provider notifications
  {
    id: 'notif-1',
    userId: 'provider-1',
    title: 'New Application Received',
    message: 'John Doe has applied to MIT AI Research Fellowship 2025',
    type: 'APPLICATION',
    read: false,
    createdAt: new Date('2024-12-15T10:30:00'),
    actionUrl: '/provider/applications/app-1',
  },
  {
    id: 'notif-2',
    userId: 'provider-1',
    title: 'Application Review Reminder',
    message: 'You have 3 pending applications that need review',
    type: 'REMINDER',
    read: false,
    createdAt: new Date('2025-01-10T09:00:00'),
  },
  {
    id: 'notif-3',
    userId: 'provider-3',
    title: 'New Application Received',
    message: 'Jane Smith has applied to Google UX Design Scholarship',
    type: 'APPLICATION',
    read: true,
    createdAt: new Date('2024-12-20T14:20:00'),
    actionUrl: '/provider/applications/app-3',
  },

  // Student notifications
  {
    id: 'notif-4',
    userId: 'student-1',
    title: 'Application Accepted! 🎉',
    message: 'Congratulations! Your application to MIT AI Research Fellowship has been accepted',
    type: 'APPLICATION_STATUS',
    read: false,
    createdAt: new Date('2025-01-08T16:45:00'),
    actionUrl: '/applicant/applications/app-1',
  },
  {
    id: 'notif-5',
    userId: 'student-1',
    title: 'Application Received',
    message: 'Your application to MIT Software Engineering Scholarship has been received',
    type: 'APPLICATION_STATUS',
    read: true,
    createdAt: new Date('2025-01-10T11:20:00'),
    actionUrl: '/applicant/applications/app-2',
  },
  {
    id: 'notif-6',
    userId: 'student-2',
    title: 'New Matching Scholarship',
    message: 'Stanford Cybersecurity Excellence Program matches your profile',
    type: 'MATCH',
    read: false,
    createdAt: new Date('2025-01-09T08:30:00'),
    actionUrl: '/applicant/scholarships/scholarship-6',
  },
  {
    id: 'notif-7',
    userId: 'student-2',
    title: 'Application Under Review',
    message: 'Your application to Google UX Design Scholarship is being reviewed',
    type: 'APPLICATION_STATUS',
    read: true,
    createdAt: new Date('2025-01-02T13:15:00'),
    actionUrl: '/applicant/applications/app-3',
  },
  {
    id: 'notif-8',
    userId: 'student-3',
    title: 'Deadline Reminder',
    message: 'Application deadline for Berkeley Data Science Fellowship is approaching (28 days left)',
    type: 'REMINDER',
    read: false,
    createdAt: new Date('2025-01-01T10:00:00'),
  },
  {
    id: 'notif-9',
    userId: 'student-4',
    title: 'Application Update',
    message: 'Your application to Stanford Cybersecurity Excellence Program has been reviewed',
    type: 'APPLICATION_STATUS',
    read: true,
    createdAt: new Date('2024-12-20T15:30:00'),
    actionUrl: '/applicant/applications/app-5',
  },
  {
    id: 'notif-10',
    userId: 'student-5',
    title: 'Profile Views',
    message: 'Your profile has been viewed 12 times this week',
    type: 'SYSTEM',
    read: true,
    createdAt: new Date('2025-01-07T09:00:00'),
  },
  {
    id: 'notif-11',
    userId: 'student-1',
    title: 'Application Waitlisted',
    message: 'Your application to Stanford Cybersecurity Excellence Program is on the waitlist',
    type: 'APPLICATION_STATUS',
    read: false,
    createdAt: new Date('2025-01-06T17:00:00'),
    actionUrl: '/applicant/applications/app-10',
  },
  {
    id: 'notif-12',
    userId: 'provider-2',
    title: 'Scholarship Published',
    message: 'Your scholarship "Stanford Cybersecurity Excellence Program" is now live',
    type: 'SCHOLARSHIP',
    read: true,
    createdAt: new Date('2024-11-05T10:00:00'),
  },
  {
    id: 'notif-13',
    userId: 'admin-1',
    title: 'New Report Submitted',
    message: 'A new report has been submitted for review',
    type: 'REPORT',
    read: false,
    createdAt: new Date('2025-01-11T14:30:00'),
  },
  {
    id: 'notif-14',
    userId: 'admin-1',
    title: 'System Maintenance Scheduled',
    message: 'System maintenance is scheduled for January 15, 2025 at 2:00 AM UTC',
    type: 'SYSTEM',
    read: false,
    createdAt: new Date('2025-01-10T09:00:00'),
  },
  {
    id: 'notif-15',
    userId: 'admin-1',
    title: 'Monthly Report Ready',
    message: 'Your monthly analytics report for December 2024 is ready',
    type: 'SYSTEM',
    read: true,
    createdAt: new Date('2025-01-01T08:00:00'),
  },
];

// =============================================================================
// REPORTS - Admin moderation
// =============================================================================

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  targetType: 'USER' | 'SCHOLARSHIP' | 'APPLICATION' | 'COMMENT';
  targetId: string;
  targetTitle: string;
  category: 'SPAM' | 'INAPPROPRIATE' | 'FRAUD' | 'HARASSMENT' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'DISMISSED';
  description: string;
  evidenceUrls?: string[];
  adminNotes?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const REPORTS: Report[] = [
  {
    id: 'report-1',
    reporterId: 'student-2',
    reporterName: 'Jane Smith',
    reporterEmail: 'jane.smith@student.edu',
    targetType: 'SCHOLARSHIP',
    targetId: 'scholarship-3',
    targetTitle: 'Google UX Design Scholarship',
    category: 'SPAM',
    priority: 'LOW',
    status: 'DISMISSED',
    description: 'This scholarship listing seems suspicious',
    resolvedBy: 'admin-1',
    resolvedAt: new Date('2025-01-09'),
    adminNotes: 'Verified with provider. Legitimate scholarship.',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-09'),
  },
  {
    id: 'report-2',
    reporterId: 'student-3',
    reporterName: 'Mike Johnson',
    reporterEmail: 'mike.johnson@student.edu',
    targetType: 'USER',
    targetId: 'student-4',
    targetTitle: 'Emily Chen',
    category: 'INAPPROPRIATE',
    priority: 'MEDIUM',
    status: 'IN_REVIEW',
    description: 'Inappropriate content in profile bio',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-11'),
  },
  {
    id: 'report-3',
    reporterId: 'provider-1',
    reporterName: 'MIT Research Lab',
    reporterEmail: 'mit@scholarships.edu',
    targetType: 'APPLICATION',
    targetId: 'app-2',
    targetTitle: 'Application by John Doe',
    category: 'FRAUD',
    priority: 'HIGH',
    status: 'NEW',
    description: 'Suspected fake documents submitted',
    evidenceUrls: ['https://evidence.example.com/doc1.pdf'],
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
  },
];

// =============================================================================
// TRANSACTIONS - Payment tracking
// =============================================================================

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  scholarshipId?: string;
  type: 'PAYMENT' | 'REFUND' | 'SUBSCRIPTION' | 'FEE';
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE';
  transactionId: string;
  description: string;
  metadata?: {
    referenceId?: string;
    invoiceUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    userId: 'student-1',
    userName: 'John Doe',
    userEmail: 'john.doe@student.edu',
    scholarshipId: 'scholarship-1',
    type: 'PAYMENT',
    amount: 50,
    currency: 'USD',
    status: 'COMPLETED',
    paymentMethod: 'CREDIT_CARD',
    transactionId: 'pi_3abc123xyz',
    description: 'Application fee for MIT AI Research Fellowship 2025',
    metadata: {
      referenceId: 'app-1',
      invoiceUrl: 'https://invoices.example.com/tx-1.pdf'
    },
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    id: 'tx-2',
    userId: 'student-2',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@student.edu',
    type: 'SUBSCRIPTION',
    amount: 29.99,
    currency: 'USD',
    status: 'COMPLETED',
    paymentMethod: 'STRIPE',
    transactionId: 'sub_def456uvw',
    description: 'Premium subscription - Monthly',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'tx-3',
    userId: 'student-3',
    userName: 'Mike Johnson',
    userEmail: 'mike.johnson@student.edu',
    scholarshipId: 'scholarship-4',
    type: 'PAYMENT',
    amount: 75,
    currency: 'USD',
    status: 'COMPLETED',
    paymentMethod: 'PAYPAL',
    transactionId: 'pp_789ghi012',
    description: 'Application fee for Berkeley Data Science Fellowship',
    metadata: {
      referenceId: 'app-5'
    },
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'tx-4',
    userId: 'student-4',
    userName: 'Emily Chen',
    userEmail: 'emily.chen@student.edu',
    scholarshipId: 'scholarship-2',
    type: 'PAYMENT',
    amount: 60,
    currency: 'USD',
    status: 'REFUNDED',
    paymentMethod: 'CREDIT_CARD',
    transactionId: 'pi_3jkl345mno',
    description: 'Application fee for Stanford Cybersecurity - REFUNDED',
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-12-22'),
  },
  {
    id: 'tx-5',
    userId: 'student-5',
    userName: 'Sarah Williams',
    userEmail: 'sarah.williams@student.edu',
    type: 'SUBSCRIPTION',
    amount: 29.99,
    currency: 'USD',
    status: 'COMPLETED',
    paymentMethod: 'CREDIT_CARD',
    transactionId: 'sub_pqr678stu',
    description: 'Premium subscription - Monthly',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
  },
  {
    id: 'tx-6',
    userId: 'provider-1',
    userName: 'MIT Research Lab',
    userEmail: 'mit@scholarships.edu',
    type: 'FEE',
    amount: 199,
    currency: 'USD',
    status: 'COMPLETED',
    paymentMethod: 'BANK_TRANSFER',
    transactionId: 'bt_vwx901yza',
    description: 'Scholarship posting fee - Annual',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },
  {
    id: 'tx-7',
    userId: 'student-1',
    userName: 'John Doe',
    userEmail: 'john.doe@student.edu',
    scholarshipId: 'scholarship-5',
    type: 'PAYMENT',
    amount: 45,
    currency: 'USD',
    status: 'PENDING',
    paymentMethod: 'CREDIT_CARD',
    transactionId: 'pi_3bcd234efg',
    description: 'Application fee for MIT Software Engineering Scholarship',
    metadata: {
      referenceId: 'app-2'
    },
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-08'),
  },
  {
    id: 'tx-8',
    userId: 'provider-3',
    userName: 'Google Education',
    userEmail: 'google@scholarships.com',
    type: 'SUBSCRIPTION',
    amount: 499,
    currency: 'USD',
    status: 'COMPLETED',
    paymentMethod: 'STRIPE',
    transactionId: 'sub_hij345klm',
    description: 'Enterprise subscription - Annual',
    createdAt: new Date('2024-08-10'),
    updatedAt: new Date('2024-08-10'),
  },
];

// =============================================================================
// AUDIT LOGS - System activity tracking
// =============================================================================

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'APPROVE' | 'REJECT' | 'BAN' | 'UNBAN' | 'LOGIN';
  entityType: 'USER' | 'SCHOLARSHIP' | 'APPLICATION' | 'REPORT' | 'TRANSACTION' | 'SYSTEM';
  entityId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  changes?: Record<string, any>;
  success: boolean;
  createdAt: Date;
}

export const AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    adminId: 'admin-1',
    adminName: 'System Admin',
    action: 'Approved scholarship',
    actionType: 'APPROVE',
    entityType: 'SCHOLARSHIP',
    entityId: 'scholarship-1',
    details: 'Approved MIT AI Research Fellowship 2025',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    changes: {
      status: { from: 'PENDING_REVIEW', to: 'PUBLISHED' }
    },
    success: true,
    createdAt: new Date('2024-11-01T10:30:00'),
  },
  {
    id: 'log-2',
    adminId: 'admin-1',
    adminName: 'System Admin',
    action: 'Resolved report',
    actionType: 'UPDATE',
    entityType: 'REPORT',
    entityId: 'report-1',
    details: 'Dismissed spam report for Google UX Design Scholarship',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    changes: {
      status: { from: 'NEW', to: 'DISMISSED' },
      adminNotes: { from: null, to: 'Verified with provider. Legitimate scholarship.' }
    },
    success: true,
    createdAt: new Date('2025-01-09T15:20:00'),
  },
  {
    id: 'log-3',
    adminId: 'admin-1',
    adminName: 'System Admin',
    action: 'Viewed user details',
    actionType: 'VIEW',
    entityType: 'USER',
    entityId: 'student-1',
    details: 'Accessed profile for John Doe',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    success: true,
    createdAt: new Date('2025-01-10T09:15:00'),
  },
  {
    id: 'log-4',
    adminId: 'admin-1',
    adminName: 'System Admin',
    action: 'Updated application status',
    actionType: 'UPDATE',
    entityType: 'APPLICATION',
    entityId: 'app-1',
    details: 'Changed application status to ACCEPTED',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    changes: {
      status: { from: 'UNDER_REVIEW', to: 'ACCEPTED' }
    },
    success: true,
    createdAt: new Date('2025-01-08T16:30:00'),
  },
  {
    id: 'log-5',
    adminId: 'admin-1',
    adminName: 'System Admin',
    action: 'Processed refund',
    actionType: 'UPDATE',
    entityType: 'TRANSACTION',
    entityId: 'tx-4',
    details: 'Issued refund for transaction tx-4',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    changes: {
      status: { from: 'COMPLETED', to: 'REFUNDED' }
    },
    success: true,
    createdAt: new Date('2024-12-22T14:00:00'),
  },
  {
    id: 'log-6',
    adminId: 'admin-1',
    adminName: 'System Admin',
    action: 'Exported user data',
    actionType: 'VIEW',
    entityType: 'SYSTEM',
    details: 'Exported CSV of all users',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    success: true,
    createdAt: new Date('2025-01-11T11:00:00'),
  },
  {
    id: 'log-7',
    adminId: 'admin-1',
    adminName: 'System Admin',
    action: 'Admin login',
    actionType: 'LOGIN',
    entityType: 'SYSTEM',
    details: 'Successful admin login',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    success: true,
    createdAt: new Date('2025-01-12T08:30:00'),
  },
  {
    id: 'log-8',
    adminId: 'admin-1',
    adminName: 'System Admin',
    action: 'Deleted spam user',
    actionType: 'DELETE',
    entityType: 'USER',
    entityId: 'user-spam-123',
    details: 'Permanently deleted spam account',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    success: true,
    createdAt: new Date('2025-01-07T13:45:00'),
  },
  {
    id: 'log-9',
    adminId: 'admin-1',
    adminName: 'System Admin',
    action: 'Updated system settings',
    actionType: 'UPDATE',
    entityType: 'SYSTEM',
    details: 'Changed email notification settings',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    changes: {
      'email.notifications.enabled': { from: false, to: true }
    },
    success: true,
    createdAt: new Date('2025-01-06T10:20:00'),
  },
  {
    id: 'log-10',
    adminId: 'admin-1',
    adminName: 'System Admin',
    action: 'Reviewed report',
    actionType: 'VIEW',
    entityType: 'REPORT',
    entityId: 'report-2',
    details: 'Reviewed inappropriate content report',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    success: true,
    createdAt: new Date('2025-01-11T16:00:00'),
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get user by ID
 */
export const getUserById = (userId: string) => {
  return USERS.find(u => u.id === userId);
};

/**
 * Get user profile by user ID
 */
export const getUserProfile = (userId: string) => {
  return USER_PROFILES.find(p => p.userId === userId);
};

/**
 * Get scholarships by provider ID
 */
export const getScholarshipsByProvider = (providerId: string) => {
  return SCHOLARSHIPS.filter(s => s.providerId === providerId);
};

/**
 * Get applications by student ID
 */
export const getApplicationsByStudent = (studentId: string) => {
  return APPLICATIONS.filter(a => a.applicantId === studentId);
};

/**
 * Get applications by scholarship ID
 */
export const getApplicationsByScholarship = (scholarshipId: string) => {
  return APPLICATIONS.filter(a => a.scholarshipId === scholarshipId);
};

/**
 * Get application details with related data
 */
export const getApplicationDetails = (applicationId: string) => {
  const application = APPLICATIONS.find(a => a.id === applicationId);
  if (!application) return null;

  const scholarship = SCHOLARSHIPS.find(s => s.id === application.scholarshipId);
  const student = USERS.find(u => u.id === application.applicantId);
  const studentProfile = USER_PROFILES.find(p => p.userId === application.applicantId);
  const provider = scholarship ? USERS.find(u => u.id === scholarship.providerId) : null;

  return {
    ...application,
    scholarship,
    student,
    studentProfile,
    provider
  };
};

/**
 * Get statistics for admin dashboard
 */
export const getAdminStats = () => {
  return {
    totalUsers: USERS.length,
    totalStudents: USERS.filter(u => u.role === UserRole.STUDENT).length,
    totalProviders: USERS.filter(u => u.role === UserRole.PROVIDER).length,
    totalScholarships: SCHOLARSHIPS.length,
    activeScholarships: SCHOLARSHIPS.filter(s => s.status === ScholarshipStatus.PUBLISHED).length,
    totalApplications: APPLICATIONS.length,
    pendingApplications: APPLICATIONS.filter(a => a.status === ApplicationStatus.SUBMITTED).length,
    acceptedApplications: APPLICATIONS.filter(a => a.status === ApplicationStatus.ACCEPTED).length,
    totalTransactions: TRANSACTIONS.length,
    totalRevenue: TRANSACTIONS.filter(t => t.status === 'COMPLETED' && t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
    pendingReports: REPORTS.filter(r => r.status === 'NEW' || r.status === 'IN_REVIEW').length,
  };
};

/**
 * Get statistics for provider dashboard
 */
export const getProviderStats = (providerId: string) => {
  const scholarships = getScholarshipsByProvider(providerId);
  const scholarshipIds = scholarships.map(s => s.id);
  const applications = APPLICATIONS.filter(a => scholarshipIds.includes(a.scholarshipId));

  return {
    totalScholarships: scholarships.length,
    activeScholarships: scholarships.filter(s => s.status === ScholarshipStatus.PUBLISHED).length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === ApplicationStatus.SUBMITTED).length,
    acceptedApplications: applications.filter(a => a.status === ApplicationStatus.ACCEPTED).length,
    rejectedApplications: applications.filter(a => a.status === ApplicationStatus.REJECTED).length,
  };
};

/**
 * Get statistics for student dashboard
 */
export const getStudentStats = (studentId: string) => {
  const applications = getApplicationsByStudent(studentId);

  return {
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === ApplicationStatus.SUBMITTED).length,
    acceptedApplications: applications.filter(a => a.status === ApplicationStatus.ACCEPTED).length,
    rejectedApplications: applications.filter(a => a.status === ApplicationStatus.REJECTED).length,
    reviewingApplications: applications.filter(a => a.status === ApplicationStatus.UNDER_REVIEW).length,
  };
};

// Export legacy names for backward compatibility
export const mockUsers = USERS;
export const mockUserProfiles = USER_PROFILES;
export const mockScholarships = SCHOLARSHIPS;
export const mockApplications = APPLICATIONS;
export const mockNotifications = NOTIFICATIONS;
export const mockReports = REPORTS;
export const mockTransactions = TRANSACTIONS;
export const mockAuditLogs = AUDIT_LOGS;

// =============================================================================
// MOCK API - Authentication & API Simulation
// =============================================================================

import type { LoginCredentials, RegisterCredentials, ApiResponse } from '@/types';

/**
 * Always use mock API in development
 */
export const shouldUseMockApi = true;

/**
 * Mock API responses for authentication
 */
export const mockApi = {
  auth: {
    /**
     * Mock login - finds user by email
     */
    async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: AuthUser; token: string }>> {
      console.log('🔐 Mock API Login called with:', credentials);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = USERS.find(u => u.email === credentials.email);
      console.log('👤 User found:', user ? `${user.name} (${user.role})` : 'NOT FOUND');

      if (!user) {
        console.log('❌ Login failed: Invalid email');
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // In a real app, you'd verify the password hash
      // For mock, we accept any password for development
      const token = `mock_token_${user.id}_${Date.now()}`;
      
      console.log('✅ Login successful! Token:', token);

      return {
        success: true,
        data: {
          user: {
            ...user,
            token,
          },
          token,
        },
        message: 'Login successful',
      };
    },

    /**
     * Mock register - creates new user
     */
    async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: AuthUser; token: string }>> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if email already exists
      const existingUser = USERS.find(u => u.email === credentials.email);
      if (existingUser) {
        return {
          success: false,
          error: 'Email already registered',
        };
      }

      // Create new user
      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        email: credentials.email,
        name: credentials.name || `${credentials.firstName} ${credentials.lastName}`,
        role: credentials.role,
        emailVerified: false,
        status: 'ACTIVE' as any,
        subscriptionType: 'FREE' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const token = `mock_token_${newUser.id}_${Date.now()}`;

      // In a real app, you'd save to database
      // For mock, we just return the user

      return {
        success: true,
        data: {
          user: {
            ...newUser,
            token,
          },
          token,
        },
        message: 'Registration successful',
      };
    },

    /**
     * Mock logout
     */
    async logout(): Promise<ApiResponse> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        success: true,
        message: 'Logout successful',
      };
    },

    /**
     * Mock refresh token
     */
    async refreshToken(): Promise<ApiResponse<{ user: AuthUser; token: string }>> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 400));

      // Get user from localStorage
      if (typeof window === 'undefined') {
        return {
          success: false,
          error: 'Not in browser environment',
        };
      }

      const storedUser = localStorage.getItem('auth_user');
      if (!storedUser) {
        return {
          success: false,
          error: 'No user found',
        };
      }

      try {
        const user = JSON.parse(storedUser);
        const token = `mock_token_${user.id}_${Date.now()}`;

        return {
          success: true,
          data: {
            user: {
              ...user,
              token,
            },
            token,
          },
          message: 'Token refreshed',
        };
      } catch (error) {
        return {
          success: false,
          error: 'Invalid user data',
        };
      }
    },

    /**
     * Mock get current user
     */
    async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));

      if (typeof window === 'undefined') {
        return {
          success: false,
          error: 'Not in browser environment',
        };
      }

      const storedUser = localStorage.getItem('auth_user');
      if (!storedUser) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      try {
        const user = JSON.parse(storedUser);
        return {
          success: true,
          data: user,
        };
      } catch (error) {
        return {
          success: false,
          error: 'Invalid user data',
        };
      }
    },
  },

  /**
   * Mock profile API
   */
  profile: {
    async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
      await new Promise(resolve => setTimeout(resolve, 300));

      const profile = USER_PROFILES.find(p => p.userId === userId);
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found',
        };
      }

      return {
        success: true,
        data: profile,
      };
    },
  },
};
