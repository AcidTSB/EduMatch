# Mock Data System - Hướng dẫn sử dụng

## 📋 Tổng quan

File `src/lib/mock-data.ts` chứa **TẤT CẢ** mock data và mock API cho toàn bộ hệ thống EduMatch.

### ✅ ĐÃ HOÀN THÀNH
- ✅ Unified mock data system - 1 file duy nhất
- ✅ Mock authentication API
- ✅ Đồng bộ data giữa Admin, Provider, Student
- ✅ Fix all TypeScript errors
- ✅ Migrated 6 admin pages sang hệ thống mới

## 🔐 Test Accounts

### Admin Account
- **Email:** `admin@edumatch.com`
- **Password:** `bất kỳ` (vì đây là mock)
- **Role:** Admin
- **Redirect:** `/admin` dashboard

### Provider Accounts
1. **MIT Research Lab**
   - Email: `mit@scholarships.edu`
   - Role: Provider
   - Redirect: `/provider/dashboard`

2. **Stanford AI Lab**
   - Email: `stanford@scholarships.edu`
   - Role: Provider

3. **Harvard Medical School**
   - Email: `harvard@scholarships.edu`
   - Role: Provider

4. **Oxford Research**
   - Email: `oxford@scholarships.edu`
   - Role: Provider

### Student Accounts
1. **John Doe** (CS Major)
   - Email: `john.doe@student.edu`
   - Role: Student
   - Redirect: `/applicant/dashboard`

2. **Jane Smith** (Biology)
   - Email: `jane.smith@student.edu`
   - Role: Student

3. **Mike Johnson** (Physics)
   - Email: `mike.johnson@student.edu`
   - Role: Student

4. **Sarah Williams** (Engineering)
   - Email: `sarah.williams@student.edu`
   - Role: Student

5. **David Brown** (Economics)
   - Email: `david.brown@student.edu`
   - Role: Student

## 📊 Mock Data Statistics

- **Users:** 10 total (1 admin, 4 providers, 5 students)
- **Scholarships:** 7 total
- **Applications:** 10 total
- **Notifications:** 15 total
- **Reports:** 3 moderation reports
- **Transactions:** 8 payment transactions
- **Audit Logs:** 10 admin action logs

## 🔧 Cách sử dụng

### Import Mock Data

```typescript
import { 
  USERS,
  SCHOLARSHIPS,
  APPLICATIONS,
  NOTIFICATIONS,
  REPORTS,
  TRANSACTIONS,
  AUDIT_LOGS,
  USER_PROFILES
} from '@/lib/mock-data';
```

### Import Helper Functions

```typescript
import {
  getUserById,
  getUserProfile,
  getScholarshipsByProvider,
  getApplicationsByStudent,
  getApplicationsByScholarship,
  getApplicationDetails,
  getAdminStats,
  getProviderStats,
  getStudentStats
} from '@/lib/mock-data';
```

### Import Mock API

```typescript
import { mockApi, shouldUseMockApi } from '@/lib/mock-data';

// Login
const response = await mockApi.auth.login({ email, password });
if (response.success && response.data) {
  const { user, token } = response.data;
  // Store token, redirect...
}

// Register
const response = await mockApi.auth.register({
  email,
  password,
  firstName,
  lastName,
  role
});

// Logout
await mockApi.auth.logout();

// Refresh Token
const response = await mockApi.auth.refreshToken();

// Get Profile
const response = await mockApi.profile.getProfile(userId);
```

## 🔗 Data Relationships

### Users ↔ Scholarships
```typescript
// Provider creates scholarships
const mitScholarships = getScholarshipsByProvider('provider-1');
// Returns: [scholarship-1, scholarship-2, scholarship-3]
```

### Students ↔ Applications
```typescript
// Student submits applications
const johnApplications = getApplicationsByStudent('student-1');
// Returns: [app-1, app-2, app-3]
```

### Scholarships ↔ Applications
```typescript
// Get all applications for a scholarship
const apps = getApplicationsByScholarship('scholarship-1');
// Returns: [app-1, app-4, app-7]
```

### Full Application Details
```typescript
const details = getApplicationDetails('app-1');
// Returns: {
//   ...application,
//   scholarship: {...},
//   student: {...},
//   studentProfile: {...},
//   provider: {...}
// }
```

## 📈 Dashboard Statistics

### Admin Dashboard
```typescript
const stats = getAdminStats();
// {
//   totalUsers: 10,
//   totalStudents: 5,
//   totalProviders: 4,
//   totalScholarships: 7,
//   activeScholarships: 5,
//   totalApplications: 10,
//   pendingApplications: 3,
//   ...
// }
```

### Provider Dashboard
```typescript
const stats = getProviderStats('provider-1');
// {
//   totalScholarships: 3,
//   activeScholarships: 2,
//   totalApplications: 6,
//   pendingApplications: 2,
//   ...
// }
```

### Student Dashboard
```typescript
const stats = getStudentStats('student-1');
// {
//   totalApplications: 3,
//   pendingApplications: 1,
//   acceptedApplications: 1,
//   ...
// }
```

## 🎯 Migrated Pages

### Admin Pages (✅ Completed)
1. ✅ `/admin/analytics` - System overview
2. ✅ `/admin/reports` - Report moderation
3. ✅ `/admin/transactions` - Payment tracking
4. ✅ `/admin/logs` - Audit logs
5. ✅ `/admin/scholarships/[id]` - Scholarship detail
6. ✅ `/admin/users/[id]` - User profile detail

### Pending Migration
- `/admin/users` - Users list page
- `/admin/scholarships` - Scholarships list page
- `/admin/applications` - Applications list page
- `/admin/dashboard` - Main dashboard

## 🐛 Debugging

Mock API login có console.log để debug:
- 🔐 Hiển thị credentials khi login
- 👤 Hiển thị user tìm được
- ✅ Hiển thị token khi thành công
- ❌ Hiển thị lỗi khi thất bại

Mở DevTools Console để xem logs.

## 📝 Notes

- Password bất kỳ đều được chấp nhận (mock mode)
- Token format: `mock_token_{userId}_{timestamp}`
- Token stored in localStorage + cookies
- Auto redirect based on user role after login
- All data relationships properly maintained
- Type-safe với TypeScript

## 🚀 Next Steps

1. Migrate remaining admin pages
2. Implement Provider dashboard pages
3. Implement Student dashboard pages
4. Add real API integration (khi backend ready)
5. Replace mock-data imports with API calls
