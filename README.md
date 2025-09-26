# EduMatch - Nền tảng thông minh kết nối sinh viên với cơ hội nghiên cứu và học bổng

EduMatch là một hệ thống thông minh giúp kết nối sinh viên với các cơ hội học bổng và nghiên cứu sau đại học. Sử dụng AI để đưa ra gợi ý phù hợp và tối ưu hóa trải nghiệm tìm kiếm học bổng.

## 🚀 Tính năng chính

### Cho Sinh viên
- ✅ Đăng ký/Đăng nhập với Firebase Authentication
- ✅ Tạo và cập nhật profile chi tiết
- ✅ Tìm kiếm học bổng với AI recommendations
- ✅ Nộp đơn ứng tuyển trực tuyến
- ✅ Theo dõi trạng thái đơn xin học bổng
- ✅ Gói premium với tính năng nâng cao
- ✅ Thông báo realtime

### Cho Nhà cung cấp học bổng
- ✅ Đăng học bổng và quản lý thông tin
- ✅ Xem danh sách ứng viên và matching score
- ✅ Giao tiếp với ứng viên qua hệ thống tin nhắn
- ✅ Dashboard quản lý ứng tuyển

### Cho Admin
- ✅ Quản lý tài khoản người dùng
- ✅ Kiểm duyệt nội dung
- ✅ Báo cáo và thống kê
- ✅ Quản lý thanh toán

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Service    │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (Python)      │
│                 │    │                 │    │                 │
│ - React 18      │    │ - TypeScript    │    │ - Flask         │
│ - TailwindCSS   │    │ - Prisma ORM    │    │ - Scikit-learn  │
│ - Socket.io     │    │ - PostgreSQL    │    │ - ML Models     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Cấu trúc dự án

```
edumatch/
├── backend/                 # NestJS API Backend
│   ├── src/
│   │   ├── modules/        # Các module chính
│   │   │   ├── auth/       # Authentication
│   │   │   ├── users/      # Quản lý người dùng
│   │   │   ├── profiles/   # Hồ sơ người dùng
│   │   │   ├── scholarships/ # Học bổng
│   │   │   ├── applications/ # Đơn ứng tuyển
│   │   │   ├── matching/   # AI Matching
│   │   │   └── notifications/ # Thông báo
│   │   ├── database/       # Prisma & Database
│   │   └── common/         # Shared utilities
│   ├── prisma/            # Database schema
│   └── package.json
│
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router (Next.js 13+)
│   │   ├── components/    # React Components
│   │   ├── lib/          # Utilities
│   │   ├── hooks/        # Custom hooks
│   │   └── types/        # TypeScript types
│   └── package.json
│
├── ai-service/            # Python AI Microservice
│   ├── app.py            # Flask application
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile
│
└── docker-compose.yml     # Container orchestration
```

## 🛠️ Công nghệ sử dụng

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Firebase Admin** - Firebase integration

### Frontend
- **Next.js 14** - React framework với App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - CSS framework
- **Radix UI** - Accessible components
- **React Query** - Data fetching
- **Zustand** - State management
- **Socket.io Client** - Real-time updates

### AI Service
- **Python 3.11** - Programming language
- **Flask** - Web framework
- **Scikit-learn** - Machine learning
- **NumPy & Pandas** - Data processing
- **TF-IDF** - Text analysis

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container deployment
- **PostgreSQL** - Primary database
- **Redis** - Caching layer

## 🚦 Cài đặt và chạy dự án

### 1. Yêu cầu hệ thống
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+

### 2. Clone repository
```bash
git clone <repository-url>
cd edumatch
```

### 3. Cài đặt dependencies

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Cập nhật thông tin database trong .env
npx prisma migrate dev
npx prisma generate
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Cập nhật API URLs trong .env.local
```

#### AI Service
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
```

### 4. Chạy services

#### Option 1: Sử dụng Docker Compose (Recommended)
```bash
# Từ thư mục root
docker-compose up --build
```

#### Option 2: Chạy manual
```bash
# Terminal 1 - Database
docker run --name postgres -e POSTGRES_DB=edumatch_db -e POSTGRES_USER=edumatch_user -e POSTGRES_PASSWORD=edumatch_password -p 5432:5432 -d postgres:15

# Terminal 2 - Backend
cd backend
npm run start:dev

# Terminal 3 - AI Service
cd ai-service
python app.py

# Terminal 4 - Frontend
cd frontend
npm run dev
```

### 5. Truy cập ứng dụng
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs
- AI Service: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/v1/auth/register     # Đăng ký
POST /api/v1/auth/login        # Đăng nhập
POST /api/v1/auth/refresh      # Refresh token
GET  /api/v1/auth/me          # Thông tin user hiện tại
```

### Users & Profiles
```
GET    /api/v1/users           # Danh sách users
GET    /api/v1/profiles/me     # Profile hiện tại
PUT    /api/v1/profiles/me     # Cập nhật profile
```

### Scholarships
```
GET    /api/v1/scholarships    # Danh sách học bổng
POST   /api/v1/scholarships    # Tạo học bổng mới
GET    /api/v1/scholarships/:id # Chi tiết học bổng
PUT    /api/v1/scholarships/:id # Cập nhật học bổng
```

### Applications
```
GET    /api/v1/applications    # Danh sách đơn ứng tuyển
POST   /api/v1/applications    # Nộp đơn mới
PUT    /api/v1/applications/:id # Cập nhật đơn
```

### AI Matching
```
POST   /api/v1/matching/calculate    # Tính điểm phù hợp
POST   /api/v1/matching/batch       # Tính batch
POST   /api/v1/recommendations/scholarships # Gợi ý học bổng
```

## 🗄️ Database Schema

### Các bảng chính:
- **users** - Thông tin người dùng
- **profiles** - Hồ sơ chi tiết
- **scholarships** - Thông tin học bổng
- **applications** - Đơn ứng tuyển
- **matching_scores** - Điểm số phù hợp
- **notifications** - Thông báo
- **messages** - Tin nhắn

## 🔧 Cấu hình Environment

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/edumatch_db
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
AI_SERVICE_URL=http://localhost:5000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### AI Service (.env)
```env
FLASK_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/edumatch_db
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📈 Monitoring & Logging

- Backend logs: Console & File logging với Winston
- Frontend errors: Sentry integration (optional)
- Database monitoring: Prisma metrics
- AI Service: Flask logging

## 🚀 Deployment

### Production Checklist
- [ ] Cập nhật environment variables
- [ ] Setup PostgreSQL production database
- [ ] Configure Redis for caching
- [ ] Setup file storage (AWS S3, etc.)
- [ ] Configure email service
- [ ] Setup monitoring & logging
- [ ] SSL certificates
- [ ] Backup strategy

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🆘 Support

- Documentation: [Wiki](link-to-wiki)
- Issues: [GitHub Issues](link-to-issues)
- Email: support@edumatch.com

## 📊 Roadmap

### Phase 1 (Current)
- [x] Basic authentication
- [x] User profiles
- [x] Scholarship posting
- [x] Basic matching algorithm

### Phase 2 (Next)
- [ ] Advanced AI recommendations
- [ ] Real-time chat
- [ ] Payment integration
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] Advanced analytics
- [ ] ML model improvements
- [ ] International expansion
- [ ] API for third-party integrations

---

**Made with ❤️ by EduMatch Team**
