# Mock Data Integration Guide

Tất cả mock data và API đã được tập trung vào file `src/lib/mock-data.ts` để backend developer dễ dàng thay thế.

## Cấu trúc Mock Data

### 1. Mock Databases
- **mockUsers**: Danh sách users cho authentication
- **mockUserProfiles**: Thông tin chi tiết profile của users
- **mockScholarships**: Danh sách học bổng
- **mockApplications**: Đơn xin học bổng
- **mockNotifications**: Thông báo cho users

### 2. Reference Data
- **commonSkills**: Danh sách skills phổ biến
- **studyFields**: Các lĩnh vực học tập
- **mockCountries**: Danh sách quốc gia
- **mockLevels**: Cấp độ học (Undergraduate, Graduate, PhD, Postdoc)
- **mockStudyModes**: Hình thức học (Full-time, Part-time, Remote)

### 3. Mock API Implementation
File này cung cấp các API endpoints hoàn chỉnh:

#### Authentication APIs
- `auth.login()`: Đăng nhập
- `auth.register()`: Đăng ký
- `auth.logout()`: Đăng xuất
- `auth.refreshToken()`: Refresh JWT token

#### Scholarship APIs  
- `scholarships.getAll()`: Lấy tất cả học bổng
- `scholarships.getById()`: Lấy học bổng theo ID
- `scholarships.getByProvider()`: Lấy học bổng theo provider

#### Application APIs
- `applications.getByUser()`: Lấy đơn xin theo user
- `applications.getByScholarship()`: Lấy đơn xin theo học bổng
- `applications.submit()`: Nộp đơn xin

#### Profile APIs
- `profiles.getById()`: Lấy profile theo ID
- `profiles.update()`: Cập nhật profile

#### Notification APIs
- `notifications.getByUser()`: Lấy thông báo theo user
- `notifications.markAsRead()`: Đánh dấu đã đọc

## Cách thay thế bằng Real API

### Bước 1: Tắt Mock API
```typescript
// Trong src/lib/mock-data.ts
export const shouldUseMockApi = false; // Đổi thành false
```

### Bước 2: Tạo Real API Implementation
```typescript
// Tạo file src/lib/api.ts
export const api = {
  auth: {
    login: async (credentials) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return response.json();
    },
    // ... các API khác
  }
};
```

### Bước 3: Update Auth Context
```typescript
// Trong src/lib/auth.ts
import { api } from '@/lib/api'; // Thay vì mock-data

// Thay đổi logic để sử dụng real API
const apiService = shouldUseMockApi ? mockApi : api;
```

## Demo Accounts

### Student Account
- **Email**: `student@demo.com`
- **Password**: `password`
- **Role**: `applicant`

### Provider Account  
- **Email**: `provider@demo.com`
- **Password**: `password` 
- **Role**: `provider`

### Admin Account
- **Email**: `admin@demo.com`
- **Password**: `password`
- **Role**: `admin`

## Notes cho Backend Developer

1. **TypeScript Types**: Tất cả interfaces đã được định nghĩa trong `src/types/index.ts`
2. **Response Format**: Tất cả API responses sử dụng format `ApiResponse<T>` với `success`, `data`, `error`
3. **Error Handling**: Mock APIs đã simulate các error cases phổ biến
4. **Pagination**: Có support cho pagination response format
5. **Authentication**: JWT token format đã được mock sẵn

## Testing

Để test với mock data:
```bash
npm run dev
```

Tất cả trang đều đã sử dụng mock data và hoạt động hoàn chỉnh.