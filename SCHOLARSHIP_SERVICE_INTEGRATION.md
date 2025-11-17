# Tích hợp Scholarship-Service vào Frontend EduMatch

## Tổng quan
Đã tích hợp toàn bộ hệ thống scholarship-service vào frontend với các API calls tương ứng, đồng bộ DTO giữa FE và BE, và bổ sung các trường cần thiết.

## Các thay đổi chính

### 1. Backend (Scholarship-Service)

#### 1.1. Model Application (`Application.java`)
Đã bổ sung các trường mới từ frontend:
- `applicantUserName` (VARCHAR 255)
- `applicantEmail` (VARCHAR 255)
- `phone` (VARCHAR 50)
- `gpa` (DECIMAL 3,2)
- `coverLetter` (TEXT)
- `motivation` (TEXT)
- `additionalInfo` (TEXT)
- `portfolioUrl` (VARCHAR 500)
- `linkedinUrl` (VARCHAR 500)
- `githubUrl` (VARCHAR 500)

#### 1.2. DTO Updates
- **CreateApplicationRequest**: Thêm tất cả các trường bổ sung từ FE
- **ApplicationDto**: Thêm mapping cho các trường mới trong `fromEntity()`

#### 1.3. Service Updates
- **ApplicationService.createApplication()**: Lưu các trường bổ sung từ request
  - Tự động lấy `applicantUserName` từ `user.getUsername()` nếu không có trong request
  - Lưu tất cả các trường khác từ request

### 2. Frontend

#### 2.1. Service mới: `scholarship.service.ts`
File service mới chứa tất cả API calls cho scholarship-service:
- `getScholarships(filters)` - Tìm kiếm và lọc scholarships
- `getScholarshipById(id)` - Lấy chi tiết scholarship
- `createApplication(request)` - Tạo application
- `getMyApplications()` - Lấy danh sách applications của user
- `toggleBookmark(opportunityId)` - Bookmark/unbookmark
- `getMyBookmarks()` - Lấy danh sách bookmarks

#### 2.2. Hooks Updates (`hooks/api.ts`)
- **useApplications**: 
  - `submitApplication()` - Sử dụng scholarship service API
  - `checkApplicationStatus()` - Kiểm tra qua getMyApplications()
- **useSavedScholarships**:
  - `fetchSavedScholarships()` - Sử dụng getMyBookmarks()
  - `saveScholarship()` - Sử dụng toggleBookmark()

#### 2.3. Component Updates
- **ApplyButton.tsx**: 
  - Xử lý upload CV file (placeholder URL cho đến khi có file upload service)
  - Gửi đầy đủ các trường: coverLetter, motivation, additionalInfo, portfolioUrl, linkedinUrl, githubUrl
  - Chuyển đổi `scholarshipId` thành `opportunityId` cho BE

### 3. Gateway Configuration

#### 3.1. Nginx Gateway (`nginx.conf`)
Đã thêm route cho bookmarks:
```nginx
location /api/bookmarks {
    # CORS và proxy configuration
    proxy_pass http://scholarship_service;
}
```

### 4. Database Migration

#### 4.1. Migration SQL (`database_migration.sql`)
Đã thêm migration script cho bảng `applications`:
```sql
ALTER TABLE applications
ADD COLUMN applicant_user_name VARCHAR(255),
ADD COLUMN applicant_email VARCHAR(255),
ADD COLUMN phone VARCHAR(50),
ADD COLUMN gpa DECIMAL(3,2),
ADD COLUMN cover_letter TEXT,
ADD COLUMN motivation TEXT,
ADD COLUMN additional_info TEXT,
ADD COLUMN portfolio_url VARCHAR(500),
ADD COLUMN linkedin_url VARCHAR(500),
ADD COLUMN github_url VARCHAR(500);
```

## API Endpoints Mapping

### Scholarships
| Frontend Call | Backend Endpoint | Method |
|--------------|------------------|--------|
| `getScholarships(filters)` | `/api/scholarships` | GET |
| `getScholarshipById(id)` | `/api/scholarships/{id}` | GET |

### Applications
| Frontend Call | Backend Endpoint | Method |
|--------------|------------------|--------|
| `createApplication(request)` | `/api/applications` | POST |
| `getMyApplications()` | `/api/applications/my` | GET |

### Bookmarks
| Frontend Call | Backend Endpoint | Method |
|--------------|------------------|--------|
| `toggleBookmark(opportunityId)` | `/api/bookmarks/{opportunityId}` | POST |
| `getMyBookmarks()` | `/api/bookmarks/my` | GET |

## DTO Mapping

### CreateApplicationRequest (FE → BE)
```typescript
{
  opportunityId: number,        // Required
  documents?: Array<{           // Optional
    documentName: string,
    documentUrl: string
  }>,
  // Additional fields from FE form
  applicantUserName?: string,
  applicantEmail?: string,
  phone?: string,
  gpa?: number,
  coverLetter?: string,
  motivation?: string,
  additionalInfo?: string,
  portfolioUrl?: string,
  linkedinUrl?: string,
  githubUrl?: string
}
```

### ApplicationDto (BE → FE)
```typescript
{
  id: number,
  applicantUserId: number,
  opportunityId: number,
  status: string,
  submittedAt: LocalDateTime,
  documents: Array<ApplicationDocumentDto>,
  // Additional fields
  applicantUserName?: string,
  applicantEmail?: string,
  phone?: string,
  gpa?: number,
  coverLetter?: string,
  motivation?: string,
  additionalInfo?: string,
  portfolioUrl?: string,
  linkedinUrl?: string,
  githubUrl?: string
}
```

## Authentication & User Details

### UserDetailDto từ Auth-Service
Backend sử dụng `UserDetailDto` từ Auth-Service với các trường:
- `id` (Long) - User ID
- `username` (String) - Username
- `organizationId` (Long) - Organization ID (cho EMPLOYER role)

### Frontend Usage
Frontend không cần gửi `userId` trong request vì:
- Backend tự động lấy từ JWT token qua `@AuthenticationPrincipal UserDetails`
- `ApplicationService` gọi `getUserDetailsFromAuthService()` để lấy thông tin đầy đủ

## File Upload (CV)

### Hiện tại
- Frontend tạo placeholder URL: `placeholder://cv/{filename}`
- Backend lưu `documentUrl` vào `ApplicationDocument`

### TODO
- Cần implement file upload service (S3/MinIO)
- Tạo endpoint upload file trước khi tạo application
- Cập nhật `ApplyButton` để upload file thực tế

## Các điểm cần lưu ý

1. **API Base URL**: 
   - Scholarship service sử dụng gateway: `http://localhost/api` (port 80)
   - Có thể cấu hình qua `NEXT_PUBLIC_API_BASE_URL`

2. **ID Mapping**:
   - Frontend dùng `scholarshipId` nhưng backend dùng `opportunityId`
   - Đã xử lý chuyển đổi trong `submitApplication()`

3. **Pagination**:
   - Backend sử dụng Spring Data `Pageable` với `page` và `size`
   - Frontend có thể truyền `page` và `size` trong filters

4. **Error Handling**:
   - Tất cả API calls đều có try-catch
   - Hiển thị error message qua toast notifications

## Testing Checklist

- [ ] Test createApplication với đầy đủ các trường
- [ ] Test createApplication với chỉ opportunityId (minimal)
- [ ] Test getMyApplications
- [ ] Test toggleBookmark
- [ ] Test getMyBookmarks
- [ ] Test getScholarships với các filters
- [ ] Test getScholarshipById
- [ ] Verify database migration chạy thành công
- [ ] Verify gateway routing hoạt động đúng

## Next Steps

1. Implement file upload service cho CV
2. Thêm validation cho các trường optional
3. Thêm unit tests cho ApplicationService
4. Thêm integration tests cho API endpoints
5. Cập nhật API documentation


