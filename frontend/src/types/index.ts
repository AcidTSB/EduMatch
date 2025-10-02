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
  // Additional properties for compatibility
  deadline?: string | Date;
  level?: string;
  providerName?: string;
  stipend?: number;
  field?: string[];
  studyMode?: string;
  country?: string;
  matchScore?: number;
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
  // Additional fields for frontend
  scholarship?: Scholarship;
  applicant?: {
    id: string;
    name: string;
    email: string;
    university?: string;
    major?: string;
    gpa?: number;
    avatar?: string;
    profile?: {
      university?: string;
      major?: string;
      gpa?: number;
      graduationYear?: string;
      skills?: string[];
      bio?: string;
    };
  };
}

export enum UserRole {
  STUDENT = 'applicant',
  PROVIDER = 'provider',
  UNIVERSITY = 'university',
  PROFESSOR = 'professor',
  ADMIN = 'admin',
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

// Additional types for API compatibility
export interface AuthUser extends User {
  token?: string;
  name?: string; // Add name property for compatibility
}

export interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  name?: string; // For compatibility
}

export interface UserProfile extends Profile {
  user?: User;
  email?: string; // Add email property for compatibility
  role?: UserRole; // Add role property for compatibility
}

export interface ScholarshipFilters {
  search?: string;
  type?: ScholarshipType;
  university?: string;
  location?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface ProfileForm {
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  university?: string;
  major?: string;
  gpa?: number;
  graduationYear?: number;
  skills: string[];
  interests: string[];
}

export interface ScholarshipForm {
  title: string;
  description: string;
  type: ScholarshipType;
  university: string;
  location: string;
  amount?: number;
  duration?: number;
  requirements: any;
  eligibility: any;
  applicationDeadline: Date;
  startDate?: Date;
  endDate?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
