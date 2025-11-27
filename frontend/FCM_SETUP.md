# Hướng dẫn thiết lập Firebase Cloud Messaging (FCM)

## Tổng quan

Hệ thống đã được cấu hình để sử dụng Firebase Cloud Messaging (FCM) để nhận push notifications. 

## Các bước thiết lập

### 1. Lấy VAPID Key từ Firebase Console

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project: **edumatch-82c53**
3. Vào **Project Settings** (biểu tượng bánh răng ở góc trên bên trái)
4. Chọn tab **Cloud Messaging**
5. Scroll xuống phần **Web Push certificates**
6. Nếu chưa có key pair, click **Generate key pair** để tạo mới
7. Copy **Key pair** (đây chính là VAPID key)

### 2. Cấu hình VAPID Key

#### Cách 1: Sử dụng Environment Variable (Khuyến nghị)

1. Tạo file `.env.local` trong thư mục `frontend/`:

```bash
cd frontend
cp .env.local.example .env.local
```

2. Mở file `.env.local` và thay thế `YOUR_VAPID_KEY_HERE` bằng VAPID key bạn đã copy:

```
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-actual-vapid-key-here
```

3. Khởi động lại dev server:

```bash
npm run dev
```

#### Cách 2: Sửa trực tiếp trong code (Không khuyến nghị)

Mở file `frontend/src/lib/firebase.ts` và thay thế dòng:

```typescript
const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "YOUR_VAPID_KEY_HERE";
```

Thành:

```typescript
const vapidKey = "your-actual-vapid-key-here";
```

### 3. Kiểm tra Service Worker

Service Worker đã được cấu hình tự động. File `public/firebase-messaging-sw.js` đã được setup.

Nếu cần kiểm tra:
- Mở DevTools (F12)
- Vào tab **Application** > **Service Workers**
- Kiểm tra xem service worker đã được đăng ký chưa

### 4. Kiểm tra hoạt động

1. Đăng nhập vào ứng dụng
2. Cho phép notification permission khi được hỏi
3. Mở DevTools Console (F12)
4. Bạn sẽ thấy các log:
   - `[ServiceWorker] ✅ Registered successfully`
   - `[useFCM] 🚀 Initializing FCM for user: ...`
   - `[Firebase] ✅ FCM Token obtained: ...`
   - `[useFCM] ✅ FCM token registered successfully with backend`

### 5. Test push notification

Sau khi FCM token đã được đăng ký, bạn có thể test bằng cách:

1. Gửi notification từ backend (thông qua API hoặc Firebase Console)
2. Hoặc test qua Firebase Console:
   - Vào **Cloud Messaging** > **Send test message**
   - Nhập FCM token (có thể lấy từ database hoặc console log)
   - Gửi thông báo test

## Cấu trúc files

- `frontend/src/lib/firebase.ts` - Khởi tạo Firebase và lấy FCM token
- `frontend/src/hooks/useFCM.ts` - Hook để đăng ký FCM token khi user đăng nhập
- `frontend/src/providers/RealTimeProvider.tsx` - Sử dụng useFCM hook
- `frontend/src/components/ServiceWorkerRegistration.tsx` - Đăng ký service worker
- `frontend/public/firebase-messaging-sw.js` - Service worker xử lý background messages

## Troubleshooting

### Vấn đề: Không nhận được FCM token

**Nguyên nhân có thể:**
1. VAPID key chưa được cấu hình đúng
2. Service worker chưa được đăng ký
3. Notification permission bị từ chối

**Giải pháp:**
1. Kiểm tra VAPID key trong `.env.local`
2. Kiểm tra service worker trong DevTools > Application > Service Workers
3. Reset notification permission:
   - Chrome: Settings > Privacy and security > Site settings > Notifications
   - Tìm và xóa permission cho localhost:3000

### Vấn đề: Token đã được lấy nhưng không đăng ký được với backend

**Nguyên nhân có thể:**
1. User chưa đăng nhập
2. API endpoint `/api/fcm/register` không hoạt động
3. Token không hợp lệ

**Giải pháp:**
1. Kiểm tra user đã đăng nhập chưa
2. Kiểm tra network tab trong DevTools để xem request có lỗi không
3. Kiểm tra backend logs

### Vấn đề: Nhận được token nhưng không nhận được notifications

**Nguyên nhân có thể:**
1. Token chưa được lưu vào database
2. Backend chưa gửi notification đúng cách
3. Notification permission bị từ chối

**Giải pháp:**
1. Kiểm tra database có record trong bảng `fcm_tokens` chưa
2. Kiểm tra backend logs khi gửi notification
3. Kiểm tra notification permission trong browser settings

## Lưu ý

- VAPID key là public key, an toàn để expose trong client-side code
- FCM token sẽ tự động được đăng ký lại khi user đăng nhập
- Token có thể thay đổi, nên backend sẽ tự động cập nhật khi có token mới
- Service worker chỉ hoạt động trên HTTPS hoặc localhost (cho development)

