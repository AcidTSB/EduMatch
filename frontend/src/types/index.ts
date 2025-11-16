export enum UserRole {
  USER = 'USER',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN',
}

export enum ScholarshipStatus {
  PUBLISHED = 'PUBLISHED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  DRAFT = 'DRAFT',
  CLOSED = 'CLOSED',         // Đã đóng (hết hạn hoặc provider tự đóng)
}

export enum ScholarshipType {
  UNDERGRADUATE = 'UNDERGRADUATE',
  MASTER = 'MASTER',
  PHD = 'PHD',
  POSTDOC = 'POSTDOC',
  RESEARCH = 'RESEARCH',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  VIEWED = 'VIEWED', // Provider đã xem
}

export enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',   // Đã giải quyết
  DISMISSED = 'DISMISSED', // Bỏ qua (báo cáo không hợp lệ)
}

export enum StudyMode {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  ONLINE = 'ONLINE',
  HYBRID = 'HYBRID',
}

export enum ModerationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  password?: string; // (không trả về từ API)
  firstName?: string;
  lastName?: string;
  name?: string; // (computed field cho frontend)
  sex?: 'MALE' | 'FEMALE' | 'OTHER';
  role: UserRole;
  enabled?: boolean;
  emailVerified: boolean;
  organizationId?: string; // ID tổ chức (nếu là EMPLOYER)
  verificationCode?: string;
  verificationExpiry?: Date;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  subscriptionType: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
}

export interface UserRoleMapping {
  userId: string;
  roleId: string;
}

export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  expiryDate: Date;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  gpa?: number;
  skills?: string[];
  verified: boolean;
  interests?: string[];
  languages?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  type: ScholarshipType | string;
  providerId: string;
  providerName?: string;
  amount: number;
  currency?: string;
  deadline?: string;
  applicationDeadline?: string; // Alias for deadline
  requirements?: string | { // có thể là JSON string hoặc object
    minGpa?: number;
    englishProficiency?: string;
    documents?: string[];
  };
  benefits?: string;
  location?: string;
  studyMode?: StudyMode | string;
  duration?: string | number;
  minGpa?: number;
  requiredSkills?: string | string[];
  preferredMajors?: string | string[];
  researchAreas?: string | string[];
  status: ScholarshipStatus | string;
  createdAt: Date;
  updatedAt?: Date;
  publishedAt?: Date;

  // Frontend-specific fields (không có trong DB)
  university?: string;
  department?: string;
  isRemote?: boolean;
  preferredSkills?: string[];
  viewCount?: number;
  tags?: string[];
  website?: string;
  contactEmail?: string;
  isPublic?: boolean;
  matchScore?: number;
  
  // Legacy fields for backward compatibility
  level?: ScholarshipType | string;
  moderationStatus?: ModerationStatus | string;
  scholarshipAmount?: number;
}

export interface Application {
  id: string;
  opportunityId: string;
  scholarshipId?: string; // Alias for opportunityId
  applicantId: string;
  applicantName?: string;
  status: ApplicationStatus;
  coverLetter?: string;
  cvUrl?: string;
  gpa?: number;
  major?: string;
  university?: string;
  yearOfStudy?: number;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewerNotes?: string;
  additionalDocs?: string[]; // Frontend field (không có trong DB)
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  uploadedAt: Date;
}

export interface Bookmark {
  id: string;
  userId: string;
  opportunityId: string;
  scholarshipId?: string; // Alias
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface OpportunitySkill {
  opportunityId: string;
  skillId: string;
}

export interface OpportunityTag {
  opportunityId: string;
  tagId: string;
}

export interface Report {
  id: string;
  targetId: string;
  targetType: 'SCHOLARSHIP' | 'USER';
  reporterId: string;
  reporterName: string;
  reporterEmail?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  description: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  content?: string;
  message?: string; // Alias for content
  data?: string | any; // JSON
  readStatus?: boolean;
  read?: boolean; // Alias for readStatus
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  type: 'SUBSCRIPTION' | 'APPLICATION_FEE';
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string; // User thực hiện hành động (NULL nếu là system)
  adminId?: string; // Alias for userId
  action: string;
  details?: string;
  ipAddress?: string;
  timestamp?: Date; // alias for createdAt
  createdAt?: Date;
  
  // Frontend fields
  targetId?: string;
  targetType?: string;
  reason?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  email: string;
  name: string;
  password?: string;
  role: UserRole;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  fullName: string;
  role: 'STUDENT' | 'PROVIDER';
}

export interface ProfileForm {
  fullName?: string;
  bio?: string;
  education?: string;
}

export interface ScholarshipForm {
  title: string;
  description: string;
  amount: number;
  deadline: string;
  educationLevel: string;
}

export interface ScholarshipFilters {
  keyword?: string;
  minAmount?: number;
  maxAmount?: number;
  educationLevel?: string[];
  deadlineBefore?: string;
}

export interface Conversation {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: string;
  lastMessageAt?: Date;
  
  // Frontend fields
  participants?: UserProfile[];
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type?: string;
  readStatus?: boolean;
  sentAt: Date;
  readAt?: Date;
  
  // Frontend fields
  createdAt?: Date; // Alias for sentAt
  attachments?: { url: string; type: string }[];
}

export interface FcmToken {
  id: string;
  userId: string;
  token: string;
  deviceType?: string;
  createdAt: Date;
  updatedAt: Date;
}