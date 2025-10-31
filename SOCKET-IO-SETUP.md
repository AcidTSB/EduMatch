# Socket.IO Real-Time Setup Guide

## ✅ Đã Hoàn Thành

### 1. Frontend Refactoring (Socket.IO Integration)
- ✅ Cập nhật `RealTimeProvider.tsx` để sử dụng Socket.IO thay vì polling
- ✅ Sử dụng `useSocket` hook có sẵn với Socket.IO client
- ✅ Cập nhật Messages Page để hiển thị online users từ WebSocket
- ✅ Tích hợp typing indicators, toast notifications, browser notifications
- ✅ Không còn lỗi TypeScript

### 2. Socket Server
- ✅ Tạo `socket-server.js` - Simple Socket.IO server để test
- ✅ Hỗ trợ:
  - User presence tracking (online/offline)
  - Real-time messaging
  - Typing indicators
  - Notifications
  - Chat rooms

## 🚀 Cách Chạy

### Bước 1: Cài đặt dependencies cho Socket Server

```bash
# Tạo folder riêng cho socket server (tùy chọn)
cd "d:\Coding\XDPM OOP - Copy"

# Cài đặt từ socket-package.json
npm install --prefix . express socket.io nodemon
```

### Bước 2: Chạy Socket Server

```bash
# Terminal 1 - Socket Server
node socket-server.js

# Hoặc với nodemon (auto-reload)
npx nodemon socket-server.js
```

Server sẽ chạy tại: `http://localhost:3003`

### Bước 3: Chạy Frontend

```bash
# Terminal 2 - Frontend
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 🧪 Test Real-Time Features

### 1. Test Online Presence

1. Mở 2 trình duyệt khác nhau (hoặc 2 cửa sổ ẩn danh)
2. Đăng nhập với 2 tài khoản khác nhau
3. Vào trang Messages (`/messages`)
4. Kiểm tra:
   - ✅ Cả 2 tài khoản đều thấy "Connected" badge (màu xanh)
   - ✅ Số "Online Users" tăng lên (hiển thị trong stats)
   - ✅ Tab "Contacts" hiển thị người dùng online với chấm xanh

### 2. Test Real-Time Messaging

1. Ở Browser 1: Click vào contact online
2. Gửi tin nhắn
3. Kiểm tra:
   - ✅ Browser 2 nhận được tin nhắn ngay lập tức
   - ✅ Toast notification hiện "New message from..."
   - ✅ Unread count tăng lên
   - ✅ Browser notification (nếu đã cho phép)

### 3. Test Typing Indicator

1. Ở Browser 1: Bắt đầu gõ tin nhắn (không gửi)
2. Kiểm tra Browser 2:
   - ✅ Hiển thị "is typing..." indicator
   - ✅ Indicator biến mất sau 3 giây không gõ

### 4. Test Auto Notifications

- ✅ Mỗi 30 giây, server tự động gửi 1 notification test
- ✅ Toast notification hiện với icon 🎓
- ✅ Notification dropdown badge tăng lên
- ✅ Browser notification (nếu đã cho phép)

## 🔧 Configuration

### Environment Variables

Tạo/cập nhật `.env.local` trong folder `frontend`:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3003
```

### Port Configuration

Muốn đổi port của Socket Server:

```javascript
// socket-server.js
const PORT = process.env.PORT || 3003; // Đổi port ở đây
```

## 📊 Socket Server Console Output

Khi chạy, server sẽ log:

```
🚀 Socket.IO Server running on http://localhost:3003
📡 Waiting for connections...
✅ User connected: John Doe (applicant) - Socket: abc123
📥 John Doe joined room: user1-user2
💬 Message from John Doe in room user1-user2: Hello!
✓ John Doe marked 2 messages as read in room user1-user2
🔔 Sent test notification to John Doe
❌ User disconnected: John Doe - Socket: abc123
```

## 🎯 Features Implemented

### Client-Side (Frontend)
- ✅ Socket.IO client integration
- ✅ Auto-reconnection on disconnect
- ✅ Online presence tracking
- ✅ Real-time message delivery
- ✅ Typing indicators
- ✅ Toast notifications (react-hot-toast)
- ✅ Browser notifications (Web API)
- ✅ Chat room management
- ✅ Message read receipts
- ✅ Unread count badges

### Server-Side (Socket Server)
- ✅ User authentication via socket handshake
- ✅ Online users tracking
- ✅ Broadcast user online/offline events
- ✅ Room-based messaging
- ✅ Message delivery to specific users
- ✅ Typing indicator broadcasting
- ✅ Auto test notifications every 30s
- ✅ CORS configuration for frontend

## 🐛 Troubleshooting

### "Cannot connect to Socket.IO server"

1. Kiểm tra Socket Server đang chạy:
   ```bash
   curl http://localhost:3003
   ```

2. Kiểm tra NEXT_PUBLIC_SOCKET_URL trong .env.local

3. Xem console của browser (F12) để check connection errors

### "No online users showing"

1. Đảm bảo đã đăng nhập
2. Check Socket Server console - phải thấy "User connected"
3. Reload trang Messages
4. Kiểm tra user có role hợp lệ (applicant/provider/admin)

### "Messages not delivering in real-time"

1. Check connection status - phải là "Connected" (màu xanh)
2. Xem Socket Server console - phải thấy "Message from..."
3. Check room ID format trong console
4. Đảm bảo cả 2 users đã join room

## 📚 Giải Thích Kiến Trúc

### Polling (Cũ) vs WebSocket (Mới)

**Polling (Trước):**
```
Client ---(HTTP GET every 3s)---> Server
          <---(Response)---
```
❌ Lãng phí bandwidth
❌ Độ trễ cao (3-5s)
❌ Không thể track online status

**WebSocket (Socket.IO - Hiện tại):**
```
Client <====(Persistent Connection)====> Server
       (Real-time bidirectional communication)
```
✅ Instant delivery (<100ms)
✅ Hiệu quả bandwidth
✅ Online presence tracking
✅ Typing indicators
✅ Scalable

### Socket.IO Events Flow

```
┌─────────────┐                    ┌─────────────┐
│  Browser 1  │                    │  Browser 2  │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │ connect (auth: user1)            │
       ├────────────────┐                 │
       │                │                 │
       │  ┌──────────────▼───────┐        │
       │  │   Socket Server     │        │
       │  │   (localhost:3003)   │        │
       │  └──────────────┬───────┘        │
       │                │                 │
       │◄───user_online (user1)───────────┤
       │                                  │
       │                 connect (user2)  │
       │                 ┌────────────────┤
       │                │                 │
       │                │                 │
       ├────user_online (user2)───────────►│
       │                                  │
       │ send_message                     │
       ├────────────────┐                 │
       │                │                 │
       │      ┌─────────▼────────┐        │
       │      │  Broadcast to    │        │
       │      │  room members    │        │
       │      └─────────┬────────┘        │
       │                │                 │
       │◄───────────────┴──────────────────►│
       │         (message event)          │
```

## 🎨 UI Indicators

### Connection Status
- 🟢 **Connected**: Màu xanh, icon Wifi
- 🔴 **Disconnected**: Màu đỏ, icon WifiOff

### Online Status (Contacts)
- 🟢 Chấm xanh bên cạnh avatar = Online
- ⚪ Không có chấm = Offline

### Notifications
- 🔔 Badge số đỏ trên notification icon
- 🎉 Toast màu xanh cho accepted/approved
- ❌ Toast màu đỏ cho rejected
- 💬 Toast màu xanh nhạt cho messages
- 🎓 Toast màu xanh cho scholarships

## 🔄 Next Steps (Tùy chọn)

### Production Deployment

1. **Deploy Socket Server:**
   - Railway, Render, Heroku
   - Set PORT environment variable
   - Enable WebSocket support

2. **Update Frontend:**
   ```env
   NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.com
   ```

3. **Database Integration:**
   - Lưu messages vào database
   - Persist online status
   - Message history

### Advanced Features

- [ ] File attachments (images, PDFs)
- [ ] Voice messages
- [ ] Video calls
- [ ] Message search
- [ ] Message reactions (emoji)
- [ ] Group chats
- [ ] Message encryption

## ✅ Summary

**Trước (Polling):**
- ❌ Không có online users
- ❌ Delay 3-5 giây
- ❌ Lãng phí resources

**Sau (Socket.IO):**
- ✅ Real-time online presence
- ✅ Instant message delivery (<100ms)
- ✅ Typing indicators
- ✅ Efficient bandwidth usage
- ✅ Scalable architecture

**Để test ngay:**
```bash
# Terminal 1
node socket-server.js

# Terminal 2
cd frontend && npm run dev

# Mở 2 browser, đăng nhập 2 tài khoản khác nhau, vào /messages
```

🎉 **Hoàn thành! Giờ bạn có real-time messaging system đầy đủ!**
