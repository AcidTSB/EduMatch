'use client';

import {
  AuthUser,
  UserRole,
  Role,
  Scholarship,
  Application,
  ApplicationDocument,
  ApplicationStatus,
  Bookmark,
  Skill,
  Tag,
  Notification,
  UserProfile,
  Report,
  LoginCredentials,
  RegisterCredentials,
  ApiResponse,
  ScholarshipType,   
  ScholarshipStatus,
  ReportStatus,     
  StudyMode,
  ModerationStatus,
  Transaction,
  AuditLog,
  Conversation,
  Message,
  FcmToken,
} from '@/types';

// Helper để format Date thành 'YYYY-MM-DD'
function formatDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

// =============================================================================
// USERS (Thêm nhiều student)
// =============================================================================
export const USERS: AuthUser[] = [
  {
    id: 'admin-1', 
    username: 'admin', 
    email: 'admin@edumatch.com', 
    firstName: 'System', 
    lastName: 'Admin',
    name: 'System Admin', 
    sex: 'OTHER',
    role: UserRole.ADMIN,
    enabled: true,
    emailVerified: true, 
    status: 'ACTIVE' as any, 
    subscriptionType: 'FREE' as any,
    createdAt: new Date('2023-01-01'), 
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'provider-1', 
    username: 'mit_research', 
    email: 'mit@scholarships.edu', 
    firstName: 'MIT',
    lastName: 'Research Lab',
    name: 'MIT Research Lab', 
    role: UserRole.EMPLOYER,
    enabled: true,
    organizationId: 'org-mit',
    emailVerified: true, 
    status: 'ACTIVE' as any, 
    subscriptionType: 'PREMIUM' as any,
    createdAt: new Date('2023-06-15'), 
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'provider-2', 
    username: 'stanford_uni', 
    email: 'stanford@scholarships.edu', 
    firstName: 'Stanford',
    lastName: 'University',
    name: 'Stanford University', 
    role: UserRole.EMPLOYER,
    enabled: true,
    organizationId: 'org-stanford',
    emailVerified: true, 
    status: 'ACTIVE' as any, 
    subscriptionType: 'PREMIUM' as any,
    createdAt: new Date('2023-07-01'), 
    updatedAt: new Date('2025-01-09'),
  },
  {
    id: 'provider-3', 
    username: 'google_edu', 
    email: 'google@scholarships.com', 
    firstName: 'Google',
    lastName: 'Education',
    name: 'Google Education', 
    role: UserRole.EMPLOYER,
    enabled: true,
    organizationId: 'org-google',
    emailVerified: true, 
    status: 'ACTIVE' as any, 
    subscriptionType: 'ENTERPRISE' as any,
    createdAt: new Date('2023-08-10'), 
    updatedAt: new Date('2025-01-08'),
  },
  {
    id: 'student-1', 
    username: 'john.doe', 
    email: 'john.doe@student.edu', 
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe', 
    sex: 'MALE',
    role: UserRole.USER,
    enabled: true,
    emailVerified: true, 
    status: 'ACTIVE' as any, 
    subscriptionType: 'FREE' as any,
    createdAt: new Date('2024-09-01'), 
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: 'student-2', 
    username: 'jane.smith', 
    email: 'jane.smith@student.edu', 
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith', 
    sex: 'FEMALE',
    role: UserRole.USER,
    enabled: true,
    emailVerified: true, 
    status: 'ACTIVE' as any, 
    subscriptionType: 'PREMIUM' as any,
    createdAt: new Date('2024-08-15'), 
    updatedAt: new Date('2025-01-11'),
  },
  {
    id: 'student-3', 
    username: 'alex.chen', 
    email: 'alex.chen@student.edu', 
    firstName: 'Alex',
    lastName: 'Chen',
    name: 'Alex Chen', 
    sex: 'MALE',
    role: UserRole.USER,
    enabled: true,
    emailVerified: true, 
    status: 'ACTIVE' as any, 
    subscriptionType: 'FREE' as any,
    createdAt: new Date('2024-10-01'), 
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'student-4', 
    username: 'maria.garcia', 
    email: 'maria.g@student.edu', 
    firstName: 'Maria',
    lastName: 'Garcia',
    name: 'Maria Garcia', 
    sex: 'FEMALE',
    role: UserRole.USER,
    enabled: true,
    emailVerified: true, 
    status: 'ACTIVE' as any, 
    subscriptionType: 'FREE' as any,
    createdAt: new Date('2024-11-05'), 
    updatedAt: new Date('2025-01-09'),
  },
];

// =============================================================================
// ROLES (Bảng roles trong auth_db)
// =============================================================================
export const ROLES: Role[] = [
  { id: 'role-1', name: 'USER' },
  { id: 'role-2', name: 'EMPLOYER' },
  { id: 'role-3', name: 'ADMIN' },
];

// =============================================================================
// SKILLS (Bảng skills trong scholarship_db)
// =============================================================================
export const SKILLS: Skill[] = [
  { id: 'skill-1', name: 'Python' },
  { id: 'skill-2', name: 'React' },
  { id: 'skill-3', name: 'TensorFlow' },
  { id: 'skill-4', name: 'Figma' },
  { id: 'skill-5', name: 'TypeScript' },
  { id: 'skill-6', name: 'SQL' },
  { id: 'skill-7', name: 'Tableau' },
  { id: 'skill-8', name: 'MATLAB' },
  { id: 'skill-9', name: 'Network Security' },
  { id: 'skill-10', name: 'Cryptography' },
  { id: 'skill-11', name: 'Linux' },
  { id: 'skill-12', name: 'Quantum Physics' },
];

// =============================================================================
// TAGS (Bảng tags trong scholarship_db)
// =============================================================================
export const TAGS: Tag[] = [
  { id: 'tag-1', name: 'AI' },
  { id: 'tag-2', name: 'Machine Learning' },
  { id: 'tag-3', name: 'Research' },
  { id: 'tag-4', name: 'Cybersecurity' },
  { id: 'tag-5', name: 'Network Security' },
  { id: 'tag-6', name: 'UX Design' },
  { id: 'tag-7', name: 'UI Design' },
  { id: 'tag-8', name: 'Quantum' },
  { id: 'tag-9', name: 'Physics' },
  { id: 'tag-10', name: 'Biotech' },
  { id: 'tag-11', name: 'Engineering' },
];

// =============================================================================
// BOOKMARKS (Bảng bookmarks trong scholarship_db)
// =============================================================================
export const BOOKMARKS: Bookmark[] = [
  {
    id: 'bookmark-1',
    userId: 'student-1',
    opportunityId: 'scholarship-2',
    createdAt: new Date('2024-12-20'),
  },
  {
    id: 'bookmark-2',
    userId: 'student-1',
    opportunityId: 'scholarship-5',
    createdAt: new Date('2025-01-05'),
  },
  {
    id: 'bookmark-3',
    userId: 'student-2',
    opportunityId: 'scholarship-1',
    createdAt: new Date('2024-12-18'),
  },
];

// =============================================================================
// USER PROFILES (Thêm cho student mới)
// =============================================================================
export const USER_PROFILES: UserProfile[] = [
  // Provider Profiles
  {
    id: 'profile-provider-1', userId: 'provider-1',
    email: 'mit@scholarships.edu', role: UserRole.EMPLOYER,
    firstName: 'MIT', lastName: 'Research Lab',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MIT',
    bio: 'Leading research institution offering fellowships and scholarships in technology and science',
    verified: true,
    interests: ['AI Research', 'Computer Science', 'Engineering'],
    languages: ['English'],
    createdAt: new Date('2023-06-15'), updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'profile-provider-2', userId: 'provider-2',
    email: 'stanford@scholarships.edu', role: UserRole.EMPLOYER,
    firstName: 'Stanford', lastName: 'University',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Stanford',
    bio: 'Premier university offering comprehensive scholarship programs across disciplines',
    verified: true,
    interests: ['Research', 'Innovation', 'Education'],
    languages: ['English'],
    createdAt: new Date('2023-07-01'), updatedAt: new Date('2025-01-09'),
  },
  {
    id: 'profile-provider-3', userId: 'provider-3',
    email: 'google@scholarships.com', role: UserRole.EMPLOYER,
    firstName: 'Google', lastName: 'Education',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Google',
    bio: 'Google Education offers scholarships and programs to support the next generation of technologists',
    verified: true,
    interests: ['Technology', 'Innovation', 'Diversity in Tech'],
    languages: ['English'],
    createdAt: new Date('2023-08-10'), updatedAt: new Date('2025-01-08'),
  },
  // Student Profiles
  {
    id: 'profile-student-1', userId: 'student-1', 
    email: 'john.doe@student.edu', role: UserRole.USER, // <-- THÊM VÀO
    firstName: 'John', lastName: 'Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    bio: 'Computer Science student passionate about AI',
    gpa: 3.8, skills: ['Python', 'React', 'TensorFlow'],
    verified: true,
    interests: ['Artificial Intelligence', 'Web Development'],
    languages: ['English', 'Spanish'],
    createdAt: new Date('2024-09-01'), updatedAt: new Date('2025-01-12'),
  },
  {
    id: 'profile-student-2', userId: 'student-2',
    email: 'jane.smith@student.edu', role: UserRole.USER, // <-- THÊM VÀO
    firstName: 'Jane', lastName: 'Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    bio: 'UX Designer & Frontend Developer.',
    gpa: 3.9, skills: ['Figma', 'React', 'TypeScript'],
    verified: true,
    interests: ['Design', 'Art', 'Frontend'],
    languages: ['English', 'French'],
    createdAt: new Date('2024-08-15'), updatedAt: new Date('2025-01-11'),
  },
  {
    id: 'profile-student-3', userId: 'student-3',
    email: 'alex.chen@student.edu', role: UserRole.USER, // <-- THÊM VÀO
    firstName: 'Alex', lastName: 'Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    bio: 'Data Science major.',
    gpa: 3.7, skills: ['Python', 'SQL', 'Tableau'],
    verified: true,
    interests: ['Data Analytics', 'Machine Learning'],
    languages: ['English', 'Mandarin'],
    createdAt: new Date('2024-10-01'), updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'profile-student-4', userId: 'student-4',
    email: 'maria.g@student.edu', role: UserRole.USER, // <-- THÊM VÀO
    firstName: 'Maria', lastName: 'Garcia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    bio: 'Biomedical Engineering student.',
    gpa: 3.85, skills: ['MATLAB', 'Biomedical Devices', 'Research'],
    verified: false,
    interests: ['Biotech', 'Healthcare'],
    languages: ['English', 'Spanish'],
    createdAt: new Date('2024-11-05'), updatedAt: new Date('2025-01-09'),
  }
];

// =============================================================================
// SCHOLARSHIPS (ĐÃ CHUẨN HÓA VÀ THÊM MỚI)
// =============================================================================
export const SCHOLARSHIPS: Scholarship[] = [
  // 1. Published Scholarship
  {
    id: 'scholarship-1',
    providerId: 'provider-1', 
    providerName: 'MIT Research Lab', 
    title: 'MIT AI Research Fellowship 2025',
    description: 'Full scholarship for graduate students pursuing AI and Machine Learning research at MIT',
    amount: 50000,
    type: ScholarshipType.RESEARCH,
    status: ScholarshipStatus.PUBLISHED,
    isRemote: false,

    applicationDeadline: formatDateString(new Date('2025-12-31')),
    location: 'Cambridge, MA, USA',
    university: 'Massachusetts Institute of Technology',
    department: 'CSAIL', 
    duration: 24, 
    minGpa: 3.5,
    requirements: { 
      minGpa: 3.5,
      englishProficiency: 'TOEFL 100+',
      documents: ['CV', 'Transcript', '3 Letters of Recommendation']
    },
    requiredSkills: ['Python', 'TensorFlow', 'Research'],
    preferredSkills: ['PyTorch', 'NLP'],
    preferredMajors: ['Computer Science', 'Artificial Intelligence', 'Data Science'],
    researchAreas: ['Machine Learning', 'Natural Language Processing', 'Computer Vision'],
    benefits: 'Full tuition coverage, monthly stipend of $2,500, health insurance, conference travel funding',
    viewCount: 1250, 
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2025-01-01'),
    publishedAt: new Date('2024-11-01'),
    tags: ['AI', 'Machine Learning', 'Research'],
    website: 'https://web.mit.edu/fellowships',
    contactEmail: 'fellowships@mit.edu',
    isPublic: true,
    matchScore: 98,
    // Optional legacy fields for backward compatibility
    level: ScholarshipType.RESEARCH,
    studyMode: StudyMode.FULL_TIME,
    moderationStatus: ModerationStatus.APPROVED,
    scholarshipAmount: 50000,
    currency: 'USD',
  },
  // 2. Pending Scholarship (cho admin duyệt)
  {
    id: 'scholarship-2',
    providerId: 'provider-2',
    providerName: 'Stanford University',
    title: 'Stanford Cybersecurity Excellence Program',
    description: 'Comprehensive scholarship for outstanding students in cybersecurity and network security',
    
    amount: 45000,
    type: ScholarshipType.RESEARCH,
    status: ScholarshipStatus.PENDING,
    isRemote: false,

    applicationDeadline: formatDateString(new Date('2025-04-15')),
    location: 'Stanford, CA, USA',
    university: 'Stanford University',
    department: 'Computer Science',
    duration: 24,
    minGpa: 3.6,
    requirements: {
      minGpa: 3.6,
      documents: ['CV', 'Transcript', 'Essay']
    },
    requiredSkills: ['Network Security', 'Cryptography', 'Linux'],
    preferredSkills: ['Penetration Testing'],
    viewCount: 980,
    createdAt: new Date('2024-12-01'),
    tags: ['Cybersecurity', 'Network Security'],
    website: 'https://www.stanford.edu/cybersecurity',
    contactEmail: 'cybersec@stanford.edu',
    isPublic: false,
    matchScore: 85,
    // Optional legacy fields for backward compatibility
    level: ScholarshipType.RESEARCH,
    studyMode: StudyMode.FULL_TIME,
    moderationStatus: ModerationStatus.PENDING,
    scholarshipAmount: 45000,
    currency: 'USD',
  },
  // 3. Draft Scholarship (Provider chưa submit)
  {
    id: 'scholarship-3',
    providerId: 'provider-3',
    providerName: 'Google Education',
    title: 'Google UX Design Scholarship',
    description: 'Supporting the next generation of UX designers with full tuition coverage',

    amount: 30000,
    type: ScholarshipType.UNDERGRADUATE,
    status: ScholarshipStatus.DRAFT,
    isRemote: true,
    
    applicationDeadline: formatDateString(new Date('2025-05-01')),
    location: 'Remote / Online',
    university: 'Google Education',
    department: 'Design',
    duration: 12,
    minGpa: 3.3,
    requirements: {
      documents: ['Portfolio', 'Essay']
    },
    requiredSkills: ['Figma', 'UI/UX Design', 'Prototyping'],
    preferredSkills: ['User Research'],
    viewCount: 1520,
    createdAt: new Date('2024-11-15'),
    tags: ['UX Design', 'UI Design'],
    website: 'https://edu.google.com/scholarships',
    contactEmail: 'scholarships@google.com',
    isPublic: false,
    matchScore: 72,
    // Optional legacy fields for backward compatibility
    level: ScholarshipType.UNDERGRADUATE,
    studyMode: StudyMode.ONLINE,
    moderationStatus: ModerationStatus.PENDING,
    scholarshipAmount: 30000,
    currency: 'USD',
  },
  // 4. Rejected Scholarship (Admin đã từ chối)
  {
    id: 'scholarship-4',
    providerId: 'provider-1',
    providerName: 'MIT Research Lab',
    title: 'Quantum Computing Grant',
    description: 'Funding for PhD candidates.',

    amount: 75000,
    type: ScholarshipType.PHD,
    status: ScholarshipStatus.REJECTED,
    isRemote: false,

    applicationDeadline: formatDateString(new Date('2025-02-01')),
    location: 'Cambridge, MA, USA',
    university: 'Massachusetts Institute of Technology',
    department: 'Physics',
    duration: 36,
    minGpa: 3.8,
    requirements: {
      minGpa: 3.8,
      documents: ['Research Proposal']
    },
    requiredSkills: ['Quantum Physics', 'Python'],
    preferredSkills: [],
    viewCount: 300,
    createdAt: new Date('2024-10-20'),
    tags: ['Quantum', 'Physics'],
    website: 'https://web.mit.edu/fellowships',
    contactEmail: 'fellowships@mit.edu',
    isPublic: false,
    matchScore: 90,
    // Optional legacy fields for backward compatibility
    level: ScholarshipType.PHD,
    studyMode: StudyMode.FULL_TIME,
    moderationStatus: ModerationStatus.REJECTED,
    scholarshipAmount: 75000,
    currency: 'USD',
  },
  // 5. Another Published Scholarship
  {
    id: 'scholarship-5',
    providerId: 'provider-2',
    providerName: 'Stanford University',
    title: 'Bioengineering Innovators Scholarship',
    description: 'For undergraduate students demonstrating innovation in biomedical engineering.',

    amount: 20000,
    type: ScholarshipType.UNDERGRADUATE,
    status: ScholarshipStatus.PUBLISHED,
    isRemote: false,

    applicationDeadline: formatDateString(new Date('2025-04-30')),
    location: 'Stanford, CA, USA',
    university: 'Stanford University',
    department: 'Bioengineering',
    duration: 12,
    minGpa: 3.7,
    requirements: {
      minGpa: 3.7,
      documents: ['CV', 'Transcript', 'Project Proposal']
    },
    requiredSkills: ['MATLAB', 'Biomedical Devices'],
    preferredSkills: ['Research'],
    viewCount: 850,
    createdAt: new Date('2024-11-25'),
    tags: ['Biotech', 'Engineering'],
    website: 'https://www.stanford.edu/bioe',
    contactEmail: 'bioe@stanford.edu',
    isPublic: true,
    matchScore: 88,
    // Optional legacy fields for backward compatibility
    level: ScholarshipType.UNDERGRADUATE,
    studyMode: StudyMode.FULL_TIME,
    moderationStatus: ModerationStatus.APPROVED,
    scholarshipAmount: 20000,
    currency: 'USD',
  },
];

// =============================================================================
// APPLICATIONS (Thêm nhiều đơn)
// =============================================================================
export const APPLICATIONS: Application[] = [
  // Student 1 (John Doe)
  {
    id: 'app-1',
    opportunityId: 'scholarship-1',
    scholarshipId: 'scholarship-1',
    applicantId: 'student-1',
    applicantName: 'John Doe',
    status: ApplicationStatus.ACCEPTED,
    coverLetter: 'I am passionate about AI research and have strong Python skills...',
    cvUrl: 'https://storage.example.com/cvs/john-doe-cv.pdf',
    gpa: 3.8,
    major: 'Computer Science',
    university: 'State University',
    yearOfStudy: 3,
    submittedAt: new Date('2024-12-10'),
    reviewedAt: new Date('2025-01-08'),
    reviewerNotes: 'Strong candidate with excellent GPA and relevant experience',
    additionalDocs: ['doc-cv.pdf', 'doc-transcript.pdf'],
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2025-01-08'),
  },
  {
    id: 'app-2',
    opportunityId: 'scholarship-2',
    scholarshipId: 'scholarship-2', // Nộp cho học bổng đang PENDING
    applicantId: 'student-1',
    applicantName: 'John Doe',
    status: ApplicationStatus.PENDING,
    coverLetter: 'I am very interested in cybersecurity...',
    cvUrl: 'https://storage.example.com/cvs/john-doe-cv.pdf',
    gpa: 3.8,
    major: 'Computer Science',
    university: 'State University',
    yearOfStudy: 3,
    submittedAt: new Date('2024-12-15'),
    additionalDocs: ['doc-cv.pdf', 'doc-essay.pdf'],
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },

  // Student 2 (Jane Smith)
  {
    id: 'app-3',
    opportunityId: 'scholarship-3',
    scholarshipId: 'scholarship-3', // Nộp cho học bổng DRAFT (vô lý, nhưng để test)
    applicantId: 'student-2',
    applicantName: 'Jane Smith',
    status: ApplicationStatus.PENDING,
    coverLetter: 'As a UX Designer, I am passionate about...',
    gpa: 3.9,
    major: 'Design',
    university: 'Design Institute',
    yearOfStudy: 4,
    submittedAt: new Date('2024-12-20'),
    additionalDocs: ['doc-portfolio.url', 'doc-essay.pdf'],
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: 'app-4',
    opportunityId: 'scholarship-1',
    scholarshipId: 'scholarship-1',
    applicantId: 'student-2',
    applicantName: 'Jane Smith',
    status: ApplicationStatus.REJECTED,
    coverLetter: 'I am interested in AI research...',
    gpa: 3.9,
    major: 'Design',
    university: 'Design Institute',
    yearOfStudy: 4,
    submittedAt: new Date('2024-12-11'),
    reviewedAt: new Date('2025-01-05'),
    reviewerNotes: 'Candidate has strong design skills but lacks AI research experience',
    additionalDocs: ['doc-portfolio.url'],
    createdAt: new Date('2024-12-11'),
    updatedAt: new Date('2025-01-05'),
  },

  // Student 3 (Alex Chen)
  {
    id: 'app-5',
    opportunityId: 'scholarship-1',
    scholarshipId: 'scholarship-1',
    applicantId: 'student-3',
    applicantName: 'Alex Chen',
    status: ApplicationStatus.PENDING,
    coverLetter: 'I have strong data science skills and want to apply them to AI...',
    cvUrl: 'https://storage.example.com/cvs/alex-chen-cv.pdf',
    gpa: 3.7,
    major: 'Data Science',
    university: 'Tech University',
    yearOfStudy: 2,
    submittedAt: new Date('2025-01-05'),
    additionalDocs: ['doc-cv-alex.pdf', 'doc-transcript-alex.pdf'],
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: 'app-6',
    opportunityId: 'scholarship-2',
    scholarshipId: 'scholarship-2',
    applicantId: 'student-3',
    applicantName: 'Alex Chen',
    status: ApplicationStatus.PENDING,
    coverLetter: 'I am interested in network security and have experience with...',
    cvUrl: 'https://storage.example.com/cvs/alex-chen-cv.pdf',
    gpa: 3.7,
    major: 'Data Science',
    university: 'Tech University',
    yearOfStudy: 2,
    submittedAt: new Date('2025-01-06'),
    additionalDocs: ['doc-cv-alex.pdf', 'doc-essay-alex.pdf'],
    createdAt: new Date('2025-01-06'),
    updatedAt: new Date('2025-01-06'),
  },

  // Student 4 (Maria Garcia)
  {
    id: 'app-7',
    opportunityId: 'scholarship-5',
    scholarshipId: 'scholarship-5', // Nộp cho học bổng Bioengineering
    applicantId: 'student-4',
    applicantName: 'Maria Garcia',
    status: ApplicationStatus.ACCEPTED,
    coverLetter: 'As a Biomedical Engineering student, I am excited about...',
    cvUrl: 'https://storage.example.com/cvs/maria-garcia-cv.pdf',
    gpa: 3.85,
    major: 'Biomedical Engineering',
    university: 'Medical University',
    yearOfStudy: 3,
    submittedAt: new Date('2025-01-01'),
    reviewedAt: new Date('2025-01-10'),
    reviewerNotes: 'Excellent candidate with strong biomedical background',
    additionalDocs: ['doc-cv-maria.pdf', 'doc-project-maria.pdf'],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'app-8',
    opportunityId: 'scholarship-1',
    scholarshipId: 'scholarship-1',
    applicantId: 'student-4',
    applicantName: 'Maria Garcia',
    status: ApplicationStatus.REJECTED,
    coverLetter: 'I want to transition to AI research...',
    cvUrl: 'https://storage.example.com/cvs/maria-garcia-cv.pdf',
    gpa: 3.85,
    major: 'Biomedical Engineering',
    university: 'Medical University',
    yearOfStudy: 3,
    submittedAt: new Date('2025-01-02'),
    reviewedAt: new Date('2025-01-09'),
    reviewerNotes: 'Strong academic record but lacks AI-specific experience',
    additionalDocs: ['doc-cv-maria.pdf'],
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-09'),
  },
];

// =============================================================================
// APPLICATION DOCUMENTS (Bảng application_documents trong scholarship_db)
// =============================================================================
export const APPLICATION_DOCUMENTS: ApplicationDocument[] = [
  {
    id: 'doc-1',
    applicationId: 'app-1',
    fileName: 'john-doe-cv.pdf',
    fileUrl: 'https://storage.example.com/docs/john-doe-cv.pdf',
    fileType: 'PDF',
    uploadedAt: new Date('2024-12-10'),
  },
  {
    id: 'doc-2',
    applicationId: 'app-1',
    fileName: 'john-doe-transcript.pdf',
    fileUrl: 'https://storage.example.com/docs/john-doe-transcript.pdf',
    fileType: 'PDF',
    uploadedAt: new Date('2024-12-10'),
  },
  {
    id: 'doc-3',
    applicationId: 'app-3',
    fileName: 'jane-smith-portfolio.pdf',
    fileUrl: 'https://storage.example.com/docs/jane-smith-portfolio.pdf',
    fileType: 'PDF',
    uploadedAt: new Date('2024-12-20'),
  },
];

// =============================================================================
// REPORTS (Bổ sung theo yêu cầu)
// =============================================================================
export const REPORTS: Report[] = [
  {
    id: 'report-1',
    targetId: 'scholarship-2', // Báo cáo học bổng 'Stanford Cybersecurity'
    targetType: 'SCHOLARSHIP',
    reporterId: 'student-1',
    reporterName: 'John Doe',
    reporterEmail: 'john.doe@student.edu',
    priority: 'HIGH',
    category: 'Misleading Information',
    description: 'The scholarship amount listed is incorrect. The official website says $40,000, not $45,000.',
    status: ReportStatus.PENDING,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'report-2',
    targetId: 'scholarship-1', // Báo cáo học bổng 'MIT AI'
    targetType: 'SCHOLARSHIP',
    reporterId: 'student-2',
    reporterName: 'Jane Smith',
    reporterEmail: 'jane.smith@student.edu',
    priority: 'MEDIUM',
    category: 'Broken Link',
    description: 'The "website" link (https://web.mit.edu/fellowships) is dead, it leads to a 404 page.',
    status: ReportStatus.PENDING,
    createdAt: new Date('2025-01-11'),
    updatedAt: new Date('2025-01-11'),
  },
  {
    id: 'report-3',
    targetId: 'scholarship-4', // Báo cáo học bổng 'Quantum Computing'
    targetType: 'SCHOLARSHIP',
    reporterId: 'student-3',
    reporterName: 'Alex Chen',
    reporterEmail: 'alex.chen@student.edu',
    priority: 'CRITICAL',
    category: 'Spam',
    description: 'This provider asked me to pay an application fee via wire transfer, which seems like a scam.',
    status: ReportStatus.RESOLVED,
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-16'),
  },
];


// =============================================================================
// CONVERSATIONS (Bảng conversations trong chat_db)
// =============================================================================
export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    user1Id: 'student-1',
    user2Id: 'provider-1',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-01-12'),
    lastMessage: 'Thank you for considering my application!',
    lastMessageAt: new Date('2025-01-12'),
  },
  {
    id: 'conv-2',
    user1Id: 'student-2',
    user2Id: 'provider-2',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2025-01-11'),
    lastMessage: 'When will the results be announced?',
    lastMessageAt: new Date('2025-01-11'),
  },
  {
    id: 'conv-3',
    user1Id: 'student-3',
    user2Id: 'provider-1',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-10'),
    lastMessage: 'I have a question about the application requirements...',
    lastMessageAt: new Date('2025-01-10'),
  },
];

// =============================================================================
// MESSAGES (Bảng messages trong chat_db)
// =============================================================================
export const MESSAGES: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'student-1',
    receiverId: 'provider-1',
    content: 'Hello, I have a question about the AI Research Fellowship...',
    type: 'TEXT',
    readStatus: true,
    sentAt: new Date('2024-12-01T10:00:00'),
    readAt: new Date('2024-12-01T10:30:00'),
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'provider-1',
    receiverId: 'student-1',
    content: 'Sure, what would you like to know?',
    type: 'TEXT',
    readStatus: true,
    sentAt: new Date('2024-12-01T10:35:00'),
    readAt: new Date('2024-12-01T10:40:00'),
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'student-1',
    receiverId: 'provider-1',
    content: 'Thank you for considering my application!',
    type: 'TEXT',
    readStatus: false,
    sentAt: new Date('2025-01-12T14:00:00'),
  },
  {
    id: 'msg-4',
    conversationId: 'conv-2',
    senderId: 'student-2',
    receiverId: 'provider-2',
    content: 'When will the results be announced?',
    type: 'TEXT',
    readStatus: true,
    sentAt: new Date('2025-01-11T09:00:00'),
    readAt: new Date('2025-01-11T09:15:00'),
  },
];

// =============================================================================
// FCM TOKENS (Bảng fcm_tokens trong chat_db)
// =============================================================================
export const FCM_TOKENS: FcmToken[] = [
  {
    id: 'token-1',
    userId: 'student-1',
    token: 'fcm-token-12345-student1-web',
    deviceType: 'WEB',
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: 'token-2',
    userId: 'student-2',
    token: 'fcm-token-67890-student2-android',
    deviceType: 'ANDROID',
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2025-01-11'),
  },
];

// =============================================================================
// NOTIFICATIONS (Thêm cho các đơn mới)
// =============================================================================
export const NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'student-1',
    type: 'APPLICATION',
    title: 'Application Update: Accepted!',
    content: 'Congratulations! Your application for "MIT AI Research Fellowship 2025" has been accepted.',
    message: 'Congratulations! Your application for "MIT AI Research Fellowship 2025" has been accepted.',
    data: JSON.stringify({ scholarshipId: 'scholarship-1', applicationId: 'app-1', status: 'ACCEPTED' }),
    readStatus: false,
    read: false,
    createdAt: new Date('2025-01-08'),
  },
  {
    id: 'notif-2',
    userId: 'student-2',
    type: 'APPLICATION',
    title: 'Application Update: Rejected',
    content: 'We regret to inform you that your application for "MIT AI Research Fellowship 2025" was not successful.',
    message: 'We regret to inform you that your application for "MIT AI Research Fellowship 2025" was not successful.',
    data: JSON.stringify({ scholarshipId: 'scholarship-1', applicationId: 'app-4', status: 'REJECTED' }),
    readStatus: true,
    read: true,
    createdAt: new Date('2025-01-05'),
  },
  {
    id: 'notif-3',
    userId: 'student-4',
    type: 'APPLICATION',
    title: 'Application Update: Accepted!',
    content: 'Congratulations! Your application for "Bioengineering Innovators Scholarship" has been accepted.',
    message: 'Congratulations! Your application for "Bioengineering Innovators Scholarship" has been accepted.',
    data: JSON.stringify({ scholarshipId: 'scholarship-5', applicationId: 'app-7', status: 'ACCEPTED' }),
    readStatus: false,
    read: false,
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'notif-4',
    userId: 'student-1',
    type: 'APPLICATION',
    title: 'Application Received',
    content: 'Your application for "Stanford Cybersecurity Excellence Program" has been received.',
    message: 'Your application for "Stanford Cybersecurity Excellence Program" has been received.',
    data: JSON.stringify({ scholarshipId: 'scholarship-2', applicationId: 'app-2', status: 'PENDING' }),
    readStatus: true,
    read: true,
    createdAt: new Date('2024-12-15'),
  },
  {
    id: 'notif-5',
    userId: 'provider-1',
    type: 'MESSAGE',
    title: 'New Message',
    content: 'You have a new message from John Doe',
    message: 'You have a new message from John Doe',
    data: JSON.stringify({ conversationId: 'conv-1', senderId: 'student-1' }),
    readStatus: false,
    read: false,
    createdAt: new Date('2025-01-12'),
  },
  {
    id: 'notif-6',
    userId: 'admin-1',
    type: 'SYSTEM',
    title: 'System Maintenance',
    content: 'The system will undergo maintenance on January 20, 2025 from 2:00 AM to 4:00 AM.',
    message: 'The system will undergo maintenance on January 20, 2025 from 2:00 AM to 4:00 AM.',
    data: JSON.stringify({ maintenanceStart: '2025-01-20T02:00:00', maintenanceEnd: '2025-01-20T04:00:00' }),
    readStatus: false,
    read: false,
    createdAt: new Date('2025-01-15'),
  },
];

// =============================================================================
// MOCK API IMPLEMENTATION
// =============================================================================

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const shouldUseMockApi = true;

// Helper: Get current mock user from localStorage or default
const getStoredMockUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('mock_current_user');
    if (stored) {
      const userId = stored;
      return USERS.find(u => u.id === userId) || null;
    }
  } catch (e) {
    // Ignore
  }
  return null;
};

// Helper: Set current mock user to localStorage
const setStoredMockUser = (user: AuthUser | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem('mock_current_user', user.id);
    } else {
      localStorage.removeItem('mock_current_user');
    }
  } catch (e) {
    // Ignore
  }
};

// Helper helper
let currentMockUser: AuthUser | null = getStoredMockUser();

export const mockApi = {
  auth: {
    async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: AuthUser; token: string }>> {
      await delay(500);
      const user = USERS.find(u => u.email === credentials.email);
      if (user) {
        currentMockUser = user;
        setStoredMockUser(user);
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
      setStoredMockUser(null);
      return { success: true };
    },
    async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
      await delay(200);
      // Always try to get from localStorage first
      const storedUser = getStoredMockUser();
      if (storedUser) {
        currentMockUser = storedUser;
        return { success: true, data: storedUser };
      }
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
      // Trả về tất cả học bổng cho admin
      if (currentMockUser?.role === UserRole.ADMIN) {
        return { success: true, data };
      }
      // Chỉ trả về học bổng published cho student/guest
      return { success: true, data: data.filter(s => s.status === ScholarshipStatus.PUBLISHED) };
    },

    async getById(id: string): Promise<ApiResponse<Scholarship>> {
      await delay(300);
      const item = SCHOLARSHIPS.find(s => s.id === id);
      if (!item) return { success: false, error: 'Not found' };
      // Admin/Provider có thể xem mọi trạng thái, student chỉ xem được published
      if (currentMockUser?.role === UserRole.USER && item.status !== ScholarshipStatus.PUBLISHED) {
         return { success: false, error: 'Not found' };
      }
      return { success: true, data: item };
    },

    async getByProvider(providerId: string): Promise<ApiResponse<Scholarship[]>> {
      await delay(300);
      return { success: true, data: SCHOLARSHIPS.filter(s => s.providerId === providerId) };
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
      // Giả sử student 1 đã lưu scholarship-2 và 5
      if (userId === 'student-1') {
        return { success: true, data: ['scholarship-2', 'scholarship-5'] };
      }
      return { success: true, data: [] };
    },
    async toggle(userId: string, scholarshipId: string): Promise<ApiResponse<{ saved: boolean }>> {
      await delay(200);
      // Giả lập toggle
      return { success: true, data: { saved: Math.random() > 0.5 } };
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

// =============================================================================
// STANDALONE FUNCTIONS (Bổ sung cho admin panel)
// (Các component của bạn đang import trực tiếp, không qua mockApi)
// =============================================================================

/**
 * Lấy thông tin user bằng ID.
 */
export function getUserById(id: string): AuthUser | undefined {
  return USERS.find(u => u.id === id);
}

/**
 * Lấy tất cả đơn nộp cho một học bổng cụ thể.
 */
export function getApplicationsByScholarship(scholarshipId: string): Application[] {
  return APPLICATIONS.filter(app => app.scholarshipId === scholarshipId);
}

/**
 * Lấy thống kê tổng quan cho trang admin analytics.
 */
export function getAdminStats() {
  const totalUsers = USERS.length;
  const totalStudents = USERS.filter(u => u.role === UserRole.USER).length;
  const totalProviders = USERS.filter(u => u.role === UserRole.EMPLOYER).length;
  const totalScholarships = SCHOLARSHIPS.length;
  const totalApplications = APPLICATIONS.length;
  
  // Lấy giá trị mock từ component analytics của bạn
  const totalRevenue = 48320; 

  return {
    totalUsers,
    totalStudents,
    totalProviders,
    totalScholarships,
    totalApplications,
    totalRevenue
  };
}

// =============================================================================
// ADDITIONAL MOCK DATA FOR ADMIN PAGES
// =============================================================================

/**
 * Mock Transactions data
 */
export const TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    userId: 'student-1',
    amount: 99.99,
    status: 'COMPLETED',
    type: 'SUBSCRIPTION',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'txn-2',
    userId: 'student-2',
    amount: 199.99,
    status: 'COMPLETED',
    type: 'SUBSCRIPTION',
    createdAt: new Date('2025-01-05'),
  },
  {
    id: 'txn-3',
    userId: 'provider-1',
    amount: 299.99,
    status: 'COMPLETED',
    type: 'SUBSCRIPTION',
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'txn-4',
    userId: 'student-3',
    amount: 49.99,
    status: 'PENDING',
    type: 'APPLICATION_FEE',
    createdAt: new Date('2025-01-12'),
  },
];

/**
 * Mock Audit Logs data
 */
export const AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'admin-1',
    adminId: 'admin-1',
    action: 'APPROVE_SCHOLARSHIP',
    details: 'Approved scholarship "MIT AI Research Fellowship 2025" (ID: scholarship-1). Reason: Meets all requirements.',
    ipAddress: '192.168.1.100',
    timestamp: new Date('2024-11-01T10:30:00'),
    createdAt: new Date('2024-11-01T10:30:00'),
    targetId: 'scholarship-1',
    targetType: 'SCHOLARSHIP',
    reason: 'Meets all requirements',
  },
  {
    id: 'log-2',
    userId: 'admin-1',
    adminId: 'admin-1',
    action: 'REJECT_SCHOLARSHIP',
    details: 'Rejected scholarship "Quantum Computing Grant" (ID: scholarship-4). Reason: Incomplete documentation.',
    ipAddress: '192.168.1.100',
    timestamp: new Date('2024-10-20T14:15:00'),
    createdAt: new Date('2024-10-20T14:15:00'),
    targetId: 'scholarship-4',
    targetType: 'SCHOLARSHIP',
    reason: 'Incomplete documentation',
  },
  {
    id: 'log-3',
    userId: 'admin-1',
    adminId: 'admin-1',
    action: 'SUSPEND_USER',
    details: 'Suspended user Maria Garcia (ID: student-4). Reason: Violation of terms of service.',
    ipAddress: '192.168.1.100',
    timestamp: new Date('2025-01-05T09:00:00'),
    createdAt: new Date('2025-01-05T09:00:00'),
    targetId: 'student-4',
    targetType: 'USER',
    reason: 'Violation of terms of service',
  },
  {
    id: 'log-4',
    userId: 'student-1',
    action: 'LOGIN',
    details: 'User john.doe logged in successfully',
    ipAddress: '10.0.0.25',
    timestamp: new Date('2025-01-12T08:00:00'),
    createdAt: new Date('2025-01-12T08:00:00'),
  },
  {
    id: 'log-5',
    userId: 'student-2',
    action: 'REGISTER',
    details: 'New user jane.smith registered',
    ipAddress: '10.0.0.30',
    timestamp: new Date('2024-08-15T12:00:00'),
    createdAt: new Date('2024-08-15T12:00:00'),
  },
];

/**
 * Get user profile by userId
 */
export function getUserProfile(userId: string): UserProfile | undefined {
  return USER_PROFILES.find(p => p.userId === userId);
}

/**
 * Get applications by student (applicant) ID
 */
export function getApplicationsByStudent(studentId: string): Application[] {
  return APPLICATIONS.filter(app => app.applicantId === studentId);
}

// =============================================================================
// LEGACY EXPORTS (Giữ để tương thích)
// =============================================================================
export const mockUsers = USERS;
export const mockUserProfiles = USER_PROFILES;
export const mockScholarships = SCHOLARSHIPS;
export const mockApplications = APPLICATIONS;
export const mockNotifications = NOTIFICATIONS;