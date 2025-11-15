# DEBUG FRONTEND REGISTRATION - HƯỚNG DẪN CHO USER

## ✅ BACKEND ĐÃ TEST OK!
Backend API `/auth/signup` đã test thành công với status **201 Created**.

Request test:
```json
POST http://localhost:8081/api/auth/signup
{
  "username": "test123@gmail.com",
  "firstName": "Test",
  "lastName": "User",
  "email": "test123@gmail.com",
  "password": "Test123456",
  "sex": "MALE"
}
```

Response: `{"success":true,"message":"User registered successfully"}`

---

## 🔍 BƯỚC DEBUG FRONTEND

### BƯỚC 1: MỞ BROWSER DEVTOOLS
1. Mở Chrome/Edge browser
2. Truy cập: `http://localhost:3000/auth/register`
3. Nhấn `F12` để mở DevTools
4. Chọn tab **Console**
5. Chọn tab **Network**

### BƯỚC 2: CLEAR DATA CŨ
Trong Console tab, chạy lệnh:
```javascript
localStorage.clear();
sessionStorage.clear();
```

### BƯỚC 3: HARD REFRESH
- Nhấn `Ctrl + Shift + R` (Windows)
- Hoặc `Ctrl + F5`

### BƯỚC 4: THỬ ĐĂNG KÝ
Điền form với thông tin:
- **First Name**: Test
- **Last Name**: User  
- **Email**: minhln8a6@gmail.com
- **Password**: Test123456
- **Confirm Password**: Test123456
- **Sex**: Male (hoặc Female/Other)
- ✅ **Tick vào Terms & Conditions**

### BƯỚC 5: NHẤN ĐĂNG KÝ & QUAN SÁT

#### A. Trong Console Tab:
Tìm các log sau:
```
🔐 [AuthService] Register attempt...
✅ [AuthService] Registration successful, token received
👤 [AuthService] Fetching user info...
✅ [AuthService] User info retrieved: {...}
```

**NẾU THẤY LỖI Ở ĐÂY** → Copy toàn bộ error message (màu đỏ)

#### B. Trong Network Tab:
Tìm 2 requests:
1. **POST signup** 
   - Click vào → Tab **Headers** → Xem "Request Payload"
   - Tab **Response** → Xem status code (201 = OK)
   
2. **GET user/me**
   - Tab **Response** → Xem user data

**NẾU REQUEST FAILED** (màu đỏ):
- Click vào request đó
- Copy Response text
- Copy Status code

---

## 🐛 CÁC LỖI THƯỜNG GẶP

### Lỗi 1: "Network Error" hoặc "ERR_CONNECTION_REFUSED"
**Nguyên nhân**: Backend không chạy

**Fix**:
```powershell
docker-compose -f docker-compose.test.yml ps
# Nếu auth-service-test không chạy:
docker-compose -f docker-compose.test.yml up -d auth-service
```

### Lỗi 2: CORS Error
**Nguyên nhân**: CORS chưa cấu hình đúng

**Fix**: Check backend logs:
```powershell
docker logs auth-service-test --tail 50
```

### Lỗi 3: "Email already exists"
**Nguyên nhân**: Email đã được đăng ký

**Fix**: Dùng email khác hoặc xóa user trong database:
```sql
DELETE FROM users WHERE email = 'minhln8a6@gmail.com';
```

### Lỗi 4: Validation Error từ Frontend
**Nguyên nhân**: Password không đủ phức tạp hoặc chưa tick Terms

**Yêu cầu**:
- Password ≥ 8 ký tự
- Password phải có: chữ hoa, chữ thường, số
- Phải tick vào Terms & Conditions

### Lỗi 5: "undefined" hoặc "Cannot read property..."
**Nguyên nhân**: Frontend code lỗi hoặc response format không đúng

**Fix**: Check xem backend có trả đúng format không:
```json
{
  "accessToken": "eyJhbGc...",
  "tokenType": "Bearer",
  "refreshToken": "..."
}
```

---

## 📸 SAU KHI DEBUG, GỬI CHO TAO:

### 1. Screenshot Console Tab
- Bao gồm toàn bộ log (xanh + đỏ)

### 2. Screenshot Network Tab  
- Request "signup" → Headers → Request Payload
- Request "signup" → Response
- Request "user/me" → Response (nếu có)

### 3. Text của Error Message
- Copy chính xác error text (màu đỏ trong Console)

---

## 🚀 NẾU VẪN KHÔNG ĐƯỢC

### Option 1: Test bằng curl trực tiếp
```powershell
curl -X POST http://localhost:8081/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"newuser@gmail.com\",\"firstName\":\"New\",\"lastName\":\"User\",\"email\":\"newuser@gmail.com\",\"password\":\"Test123456\",\"sex\":\"MALE\"}'
```

Nếu curl OK → Vấn đề ở frontend browser
Nếu curl FAILED → Vấn đề ở backend/network

### Option 2: Test bằng Postman/Insomnia
Import request này vào Postman:
- URL: `http://localhost:8081/api/auth/signup`
- Method: POST
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "username": "postman@gmail.com",
  "firstName": "Post",
  "lastName": "Man",
  "email": "postman@gmail.com",
  "password": "Test123456",
  "sex": "MALE"
}
```

### Option 3: Check Database trực tiếp
```powershell
docker exec -it auth-db-test mysql -u auth_user -pauth_password auth_db
```

Trong MySQL:
```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

Xem có user mới được tạo không?

---

## 📝 REPORT FORMAT
Khi báo cáo lỗi, gửi theo format:

```
=== CONSOLE ERRORS ===
[Paste console errors here]

=== NETWORK REQUEST ===
URL: POST http://localhost:8081/api/auth/signup
Status: [200/400/500/...]
Request Payload: [paste JSON]
Response: [paste response]

=== FRONTEND LOGS ===
[Paste any logs with 🔐 📝 ✅ ❌ emojis]

=== ADDITIONAL INFO ===
- Browser: Chrome/Edge/Firefox
- Email used: [email]
- Did you see "Đang tạo tài khoản..." toast? Yes/No
- Did frontend freeze/hang? Yes/No
```

---

**TL;DR**: 
1. Mở F12 
2. Clear localStorage
3. Hard refresh (Ctrl+Shift+R)
4. Điền form + tick Terms
5. Click Đăng ký
6. **SCREENSHOT Console + Network tabs**
7. **GỬI CHO TAO!**
