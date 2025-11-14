// src/types/index.ts

// === ENUMS MỚI CHO HỌC BỔNG ===
export enum ScholarshipLevel {
  UNDERGRADUATE = 'UNDERGRADUATE',
  MASTER = 'MASTER', // Dùng MASTER (khớp với API)
  PHD = 'PHD',
  POSTDOC = 'POSTDOC',
  RESEARCH = 'RESEARCH',
}

export enum StudyMode {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  ONLINE = 'ONLINE',
}

export enum ModerationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// === CÁC ENUM CŨ (Giữ lại cho User, Application) ===
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

// === INTERFACES ===

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

// === INTERFACE SCHOLARSHIP ĐÃ SỬA ===
export interface Scholarship {
  id: string; // Giữ nguyên là string để khớp mock-data.ts
  organizationId: string; // Đổi từ providerId
  creatorUserId?: string; // Thêm (giả sử)
  
  title: string;
  description: string;
  
  level: ScholarshipLevel; // Đổi từ type
  moderationStatus: ModerationStatus; // Đổi từ status
  studyMode: StudyMode; // Thêm mới
  
  scholarshipAmount: number; // Đổi từ amount
  minGpa: number;
  
  applicationDeadline: string; // Đổi từ Date sang string
  startDate: string; // Đổi từ Date sang string
  endDate?: string; // Đổi từ Date sang string
  
  tags: string[];
  requiredSkills: string[];
  
  website?: string;
  contactEmail?: string;
  
  isPublic: boolean; // Đổi từ isVisible
  viewsCnt: number; // Đổi từ viewCount
  matchScore?: number;      // Điểm phù hợp (0-100)
  location?: string;        // Địa điểm (City, Country)
  university?: string;      // Tên trường/Tổ chức (nếu khác provider)
}

// === INTERFACE APPLICATION ĐÃ SỬA ===
export interface Application {
  id: string;
  applicantId: string;
  scholarshipId: string; // SỬA: string (để khớp Scholarship.id)
  
  status: ApplicationStatus;
  coverLetter?: string;
  cv?: string;
  additionalDocs: string[]; // SỬA: Trường này là bắt buộc
  customAnswers?: any;
  submittedAt?: Date;
  reviewedAt?: Date;
  respondedAt?: Date;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Các trường quan hệ
  scholarship?: Scholarship;
  applicant?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    profile?: Partial<Profile>;
  };
}

// === CÁC TYPES CÒN LẠI (TỪ FILE CŨ CỦA BẠN) ===

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

// Thêm các type bị thiếu
export interface AuthUser extends User {
  token?: string;
  name?: string;
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
  name?: string;
}

export interface UserProfile extends Profile {
  user?: User;
  email?: string;
  role?: UserRole;
}
// Kết thúc thêm

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

// Thêm các type bị thiếu
export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  targetType: 'SCHOLARSHIP' | 'USER' | 'APPLICATION';
  targetId: string;
  targetTitle: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'DISMISSED';
  description: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  scholarshipId?: string;
  type: 'PAYMENT' | 'REFUND' | 'SUBSCRIPTION';
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT';
  entityType: 'SCHOLARSHIP' | 'USER' | 'APPLICATION' | 'REPORT';
  entityId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}
// Kết thúc thêm