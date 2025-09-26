export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  subscriptionType: SubscriptionType;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: Date;
  nationality?: string;
  currentLocation?: string;
  bio?: string;
  university?: string;
  major?: string;
  gpa?: number;
  graduationYear?: number;
  currentLevel?: string;
  organizationName?: string;
  position?: string;
  website?: string;
  verified: boolean;
  skills: string[];
  interests: string[];
  languages: string[];
  education?: any;
  experience?: any;
  publications?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Scholarship {
  id: string;
  providerId: string;
  title: string;
  description: string;
  type: ScholarshipType;
  status: ScholarshipStatus;
  university: string;
  department?: string;
  location: string;
  isRemote: boolean;
  amount?: number;
  currency: string;
  duration?: number;
  isPaidMonthly: boolean;
  requirements: any;
  eligibility: any;
  requiredSkills: string[];
  preferredSkills: string[];
  minGpa?: number;
  applicationDeadline: Date;
  startDate?: Date;
  endDate?: Date;
  tags: string[];
  website?: string;
  contactEmail?: string;
  isVisible: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  applicantId: string;
  scholarshipId: string;
  status: ApplicationStatus;
  coverLetter?: string;
  cv?: string;
  additionalDocs: string[];
  customAnswers?: any;
  submittedAt?: Date;
  reviewedAt?: Date;
  respondedAt?: Date;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  PROVIDER = 'PROVIDER',
  UNIVERSITY = 'UNIVERSITY',
  PROFESSOR = 'PROFESSOR',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum SubscriptionType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WAITLISTED = 'WAITLISTED',
}

export enum ScholarshipType {
  UNDERGRADUATE = 'UNDERGRADUATE',
  GRADUATE = 'GRADUATE',
  PHD = 'PHD',
  POSTDOC = 'POSTDOC',
  RESEARCH = 'RESEARCH',
}

export enum ScholarshipStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MatchingScore {
  id: string;
  userId: string;
  scholarshipId: string;
  score: number;
  factors: {
    text_similarity?: number;
    skills_match?: number;
    education_match?: number;
    gpa_match?: number;
    [key: string]: number | undefined;
  };
  createdAt: Date;
  updatedAt: Date;
}
