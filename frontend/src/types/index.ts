// =============================================================================
// ENUMS (Các hằng số)
// =============================================================================

/**
 * Vai trò của người dùng trong hệ thống.
 */
export enum UserRole {
  STUDENT = 'STUDENT',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN',
}

/**
 * Trạng thái của một học bổng.
 * (Thay thế cho ModerationStatus)
 */
export enum ScholarshipStatus {
  PUBLISHED = 'PUBLISHED',     // Đã đăng
  PENDING = 'PENDING',       // Đang chờ duyệt
  REJECTED = 'REJECTED',     // Bị từ chối
  DRAFT = 'DRAFT',           // Bản nháp
  CLOSED = 'CLOSED',         // Đã đóng (hết hạn hoặc provider tự đóng)
}

/**
 * Cấp độ/Loại học bổng.
 * (Thay thế cho ScholarshipLevel)
 */
export enum ScholarshipType {
  UNDERGRADUATE = 'UNDERGRADUATE', // Cử nhân
  GRADUATE = 'GRADUATE',         // Cao học (Thạc sĩ, Tiến sĩ)
  RESEARCH = 'RESEARCH',         // Nghiên cứu
  OTHER = 'OTHER',               // Khác
}

/**
 * Trạng thái của một đơn nộp (application).
 */
export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  VIEWED = 'VIEWED', // Provider đã xem
}

/**
 * Trạng thái của một báo cáo (report).
 */
export enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',   // Đã giải quyết
  DISMISSED = 'DISMISSED', // Bỏ qua (báo cáo không hợp lệ)
}

/**
 * Hình thức học (ví dụ: toàn thời gian, bán thời gian).
 * (Giữ lại từ file mock-data gốc của bạn)
 */
export enum StudyMode {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  ONLINE = 'ONLINE',
  HYBRID = 'HYBRID',
}

// =============================================================================
// INTERFACES (Các cấu trúc dữ liệu)
// =============================================================================

/**
 * Thông tin xác thực cơ bản của người dùng.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  subscriptionType: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Thông tin chi tiết (profile) của người dùng.
 */
export interface UserProfile {
  id: string;
  userId: string; // Khóa ngoại liên kết với AuthUser
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
  // Thêm các trường khác nếu cần (ví dụ: education, experience)
}

/**
 * Cấu trúc dữ liệu chính của Học bổng.
 * (Đã được chuẩn hóa để khớp với mock-data và các component)
 */
export interface Scholarship {
  id: string;
  providerId: string;       // ID của provider
  providerName: string;     // Tên của provider
  title: string;
  description: string;
  amount: number;           // Số tiền học bổng
  type: ScholarshipType;    // Loại học bổng (Undergrad, Grad...)
  status: ScholarshipStatus;// Trạng thái (Published, Pending...)

  applicationDeadline: string; // 'YYYY-MM-DD'
  location: string;
  university: string;
  
  department?: string;
  duration?: number; // (Tính bằng tháng)
  isRemote?: boolean;
  minGpa?: number;
  
  // Yêu cầu chi tiết
  requirements?: {
    minGpa?: number;
    englishProficiency?: string;
    documents?: string[];
  };

  requiredSkills: string[];
  preferredSkills?: string[];

  viewCount: number; // Đổi tên từ viewsCnt
  createdAt: Date;

  // Các trường tùy chọn/cũ (vẫn giữ để linh hoạt)
  tags?: string[];
  website?: string;
  contactEmail?: string;
  isPublic?: boolean;
  matchScore?: number;
  startDate?: string; // 'YYYY-MM-DD'
  endDate?: string; // 'YYYY-MM-DD'

  // Các trường cũ đã được thay thế (để ở đây cho dễ đối chiếu)
  // organizationId?: string; // (Đã đổi thành providerId)
  // level?: any; // (Đã đổi thành type)
  // moderationStatus?: any; // (Đã đổi thành status)
  // viewsCnt?: number; // (Đã đổi thành viewCount)
  // scholarshipAmount?: number; // (Đã đổi thành amount)
}

/**
 * Cấu trúc đơn nộp (application) của sinh viên.
 */
export interface Application {
  id: string;
  applicantId: string; // ID của student
  scholarshipId: string;
  status: ApplicationStatus;
  additionalDocs: string[]; // Danh sách tên file hoặc URL
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Cấu trúc một báo cáo (report) của người dùng.
 */
export interface Report {
  id: string;
  targetId: string; // ID của scholarship hoặc user bị báo cáo
  targetType: 'SCHOLARSHIP' | 'USER';
  reporterId: string; // ID của người báo cáo
  reporterName: string; // Tên của người báo cáo (để hiển thị)
  category: string; // Ví dụ: 'Spam', 'Misleading Information', 'Broken Link'
  description: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Cấu trúc một thông báo (notification).
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: Date;
}

// =============================================================================
// CÁC TYPE PHỤ (Dùng cho API, Auth,...)
// =============================================================================

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
  adminId: string;
  action: string; // Ví dụ: 'APPROVE_SCHOLARSHIP', 'REJECT_SCHOLARSHIP', 'SUSPEND_USER'
  targetId: string;
  targetType: string;
  reason?: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password?: string; // (Có thể login bằng Google,...)
}

export interface RegisterCredentials {
  email: string;
  name: string;
  password?: string;
  role: UserRole;
}

/**
 * Type chung cho mọi phản hồi từ API (kể cả mock API).
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}