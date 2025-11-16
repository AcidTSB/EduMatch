# EduMatch - Database Documentation

## 📚 Tổng quan hệ thống Database

EduMatch sử dụng kiến trúc Microservices với các database độc lập cho từng service:

### 🗂️ Danh sách Databases

| Service | Database | Type | Port | User | Password |
|---------|----------|------|------|------|----------|
| **Auth Service** | `auth_db` | MySQL 8.0 | 3307 | `auth_user` | `auth_pass` |
| **Scholarship Service** | `scholarship_db` | MySQL 8.0 | 3308 | `scholarship_user` | `scholarship_pass` |
| **Chat Service** | `chat_db` | MySQL 8.0 | 3306 | `root` | `@Saitamass2` |
| **Matching Service** | `matching_db` | PostgreSQL 14 | 5432 | `matching_user` | `matching_pass` |
| **Notification Service** | *Chưa cấu hình* | - | - | - | - |

---

## 1. 🔐 Auth Service Database (`auth_db`)

### Thông tin kết nối
- **Database**: `auth_db`
- **Type**: MySQL 8.0
- **Host**: `localhost` (local) / `auth-db-test` (Docker)
- **Port**: `3307` (local) / `3306` (Docker internal)
- **User**: `auth_user`
- **Password**: `auth_pass`
- **JDBC URL**: `jdbc:mysql://localhost:3307/auth_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`

### Tables (Schema)

#### `users`
Lưu trữ thông tin người dùng và xác thực.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | User ID |
| `username` | VARCHAR(255) | UNIQUE, NOT NULL | Username (thường là email) |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email |
| `password` | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| `first_name` | VARCHAR(255) | NULL | Tên |
| `last_name` | VARCHAR(255) | NULL | Họ |
| `sex` | VARCHAR(10) | NULL | Giới tính (MALE/FEMALE/OTHER) |
| `enabled` | BIT(1) | NULL | Trạng thái kích hoạt |
| `organization_id` | BIGINT | NULL | ID tổ chức (nếu là EMPLOYER) |
| `verification_code` | VARCHAR(255) | NULL | Mã xác thực email |
| `verification_expiry` | DATETIME(6) | NULL | Thời hạn mã xác thực |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `email`, `username`

#### `roles`
Định nghĩa các vai trò trong hệ thống.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Role ID |
| `name` | VARCHAR(255) | UNIQUE, NOT NULL | Tên role (USER, EMPLOYER, ADMIN) |

**Data mẫu**:
```sql
INSERT INTO roles (name) VALUES ('USER'), ('EMPLOYER'), ('ADMIN');
```

#### `user_roles`
Bảng trung gian liên kết User và Role (Many-to-Many).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | BIGINT | FOREIGN KEY → users(id) | User ID |
| `role_id` | BIGINT | FOREIGN KEY → roles(id) | Role ID |

**Indexes**:
- PRIMARY KEY: `(user_id, role_id)`

#### `refresh_tokens`
Lưu trữ Refresh Token cho JWT.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Token ID |
| `token` | VARCHAR(255) | UNIQUE, NOT NULL | Refresh token string |
| `user_id` | BIGINT | FOREIGN KEY → users(id) | User sở hữu token |
| `expiry_date` | TIMESTAMP | NOT NULL | Ngày hết hạn |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

#### `audit_logs`
Ghi log các hoạt động quan trọng.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Log ID |
| `user_id` | BIGINT | NULL | User thực hiện hành động |
| `action` | VARCHAR(255) | NOT NULL | Loại hành động (LOGIN, LOGOUT, REGISTER,...) |
| `details` | TEXT | NULL | Chi tiết hành động |
| `ip_address` | VARCHAR(50) | NULL | IP address |
| `timestamp` | TIMESTAMP | DEFAULT NOW() | Thời gian |

---

## 2. 🎓 Scholarship Service Database (`scholarship_db`)

### Thông tin kết nối
- **Database**: `scholarship_db`
- **Type**: MySQL 8.0
- **Host**: `localhost` (local) / `scholarship-db-test` (Docker)
- **Port**: `3308` (local) / `3306` (Docker internal)
- **User**: `scholarship_user` (Docker) / `root` (local)
- **Password**: `scholarship_pass` (Docker) / `@Saitamass2` (local)
- **JDBC URL**: `jdbc:mysql://localhost:3308/scholarship_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`

### Tables (Schema)

#### `opportunities`
Lưu trữ thông tin học bổng và cơ hội nghiên cứu.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Opportunity ID |
| `title` | VARCHAR(500) | NOT NULL | Tiêu đề học bổng |
| `description` | TEXT | NULL | Mô tả chi tiết |
| `type` | VARCHAR(50) | NOT NULL | Loại (SCHOLARSHIP, LAB_POSITION) |
| `provider_id` | BIGINT | NOT NULL | ID nhà cung cấp (từ Auth Service) |
| `provider_name` | VARCHAR(255) | NULL | Tên nhà cung cấp |
| `amount` | DECIMAL(15,2) | NULL | Giá trị học bổng |
| `currency` | VARCHAR(10) | NULL | Đơn vị tiền tệ (VND, USD) |
| `deadline` | DATE | NULL | Hạn nộp đơn |
| `requirements` | TEXT | NULL | Yêu cầu |
| `benefits` | TEXT | NULL | Quyền lợi |
| `location` | VARCHAR(255) | NULL | Địa điểm |
| `study_mode` | VARCHAR(50) | NULL | Hình thức (ONLINE, OFFLINE, HYBRID) |
| `duration` | VARCHAR(100) | NULL | Thời lượng |
| `min_gpa` | DECIMAL(3,2) | NULL | GPA tối thiểu |
| `required_skills` | TEXT | NULL | Kỹ năng yêu cầu (JSON array) |
| `preferred_majors` | TEXT | NULL | Ngành học ưu tiên (JSON array) |
| `research_areas` | TEXT | NULL | Lĩnh vực nghiên cứu (JSON array) |
| `status` | VARCHAR(50) | NOT NULL | Trạng thái (PUBLISHED, PENDING, REJECTED) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Ngày cập nhật |
| `published_at` | TIMESTAMP | NULL | Ngày công bố |

**Indexes**:
- PRIMARY KEY: `id`
- INDEX: `provider_id`, `status`, `deadline`

#### `applications`
Đơn xin học bổng của sinh viên.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Application ID |
| `opportunity_id` | BIGINT | FOREIGN KEY → opportunities(id) | Học bổng apply |
| `applicant_id` | BIGINT | NOT NULL | User ID sinh viên |
| `applicant_name` | VARCHAR(255) | NULL | Tên sinh viên |
| `status` | VARCHAR(50) | NOT NULL | Trạng thái (PENDING, APPROVED, REJECTED) |
| `cover_letter` | TEXT | NULL | Thư xin học bổng |
| `cv_url` | VARCHAR(500) | NULL | Link CV |
| `gpa` | DECIMAL(3,2) | NULL | GPA |
| `major` | VARCHAR(255) | NULL | Ngành học |
| `university` | VARCHAR(255) | NULL | Trường |
| `year_of_study` | INT | NULL | Năm học |
| `submitted_at` | TIMESTAMP | DEFAULT NOW() | Ngày nộp |
| `reviewed_at` | TIMESTAMP | NULL | Ngày duyệt |
| `reviewer_notes` | TEXT | NULL | Ghi chú của người duyệt |

**Indexes**:
- PRIMARY KEY: `id`
- INDEX: `opportunity_id`, `applicant_id`, `status`

#### `application_documents`
Tài liệu đính kèm đơn xin.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Document ID |
| `application_id` | BIGINT | FOREIGN KEY → applications(id) | Application liên kết |
| `file_name` | VARCHAR(255) | NOT NULL | Tên file |
| `file_url` | VARCHAR(500) | NOT NULL | URL file |
| `file_type` | VARCHAR(50) | NULL | Loại file (PDF, DOC, IMAGE) |
| `uploaded_at` | TIMESTAMP | DEFAULT NOW() | Ngày upload |

#### `bookmarks`
Lưu học bổng yêu thích của sinh viên.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Bookmark ID |
| `user_id` | BIGINT | NOT NULL | User ID |
| `opportunity_id` | BIGINT | FOREIGN KEY → opportunities(id) | Học bổng yêu thích |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày lưu |

**Indexes**:
- UNIQUE: `(user_id, opportunity_id)`

#### `skills`
Danh sách kỹ năng.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Skill ID |
| `name` | VARCHAR(255) | UNIQUE, NOT NULL | Tên kỹ năng |

#### `tags`
Danh sách tag/nhãn.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Tag ID |
| `name` | VARCHAR(255) | UNIQUE, NOT NULL | Tên tag |

#### `opportunity_skills` (Many-to-Many)
Liên kết Opportunity với Skills.

| Column | Type | Constraints |
|--------|------|-------------|
| `opportunity_id` | BIGINT | FOREIGN KEY → opportunities(id) |
| `skill_id` | BIGINT | FOREIGN KEY → skills(id) |

#### `opportunity_tags` (Many-to-Many)
Liên kết Opportunity với Tags.

| Column | Type | Constraints |
|--------|------|-------------|
| `opportunity_id` | BIGINT | FOREIGN KEY → opportunities(id) |
| `tag_id` | BIGINT | FOREIGN KEY → tags(id) |

---

## 3. 💬 Chat Service Database (`chat_db`)

### Thông tin kết nối
- **Database**: `chat_db`
- **Type**: MySQL 8.0
- **Host**: `localhost`
- **Port**: `3306`
- **User**: `root`
- **Password**: `@Saitamass2`
- **JDBC URL**: `jdbc:mysql://localhost:3306/chat_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`

### Tables (Schema)

#### `conversations`
Cuộc trò chuyện giữa các user.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Conversation ID |
| `user1_id` | BIGINT | NOT NULL | User 1 ID |
| `user2_id` | BIGINT | NOT NULL | User 2 ID |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Ngày cập nhật cuối |
| `last_message` | TEXT | NULL | Tin nhắn cuối |
| `last_message_at` | TIMESTAMP | NULL | Thời gian tin nhắn cuối |

**Indexes**:
- UNIQUE: `(user1_id, user2_id)`
- INDEX: `updated_at`

#### `messages`
Tin nhắn trong conversation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Message ID |
| `conversation_id` | BIGINT | FOREIGN KEY → conversations(id) | Conversation |
| `sender_id` | BIGINT | NOT NULL | User gửi |
| `receiver_id` | BIGINT | NOT NULL | User nhận |
| `content` | TEXT | NOT NULL | Nội dung |
| `type` | VARCHAR(50) | DEFAULT 'TEXT' | Loại (TEXT, IMAGE, FILE) |
| `read_status` | BOOLEAN | DEFAULT FALSE | Đã đọc chưa |
| `sent_at` | TIMESTAMP | DEFAULT NOW() | Thời gian gửi |
| `read_at` | TIMESTAMP | NULL | Thời gian đọc |

**Indexes**:
- INDEX: `conversation_id`, `sender_id`, `receiver_id`, `sent_at`

#### `notifications`
Thông báo cho user.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Notification ID |
| `user_id` | BIGINT | NOT NULL, INDEX | User nhận thông báo |
| `type` | VARCHAR(50) | NOT NULL | Loại (MESSAGE, APPLICATION, SYSTEM) |
| `title` | VARCHAR(255) | NOT NULL | Tiêu đề |
| `content` | TEXT | NULL | Nội dung |
| `data` | TEXT | NULL | Dữ liệu JSON |
| `read_status` | BOOLEAN | DEFAULT FALSE, INDEX | Đã đọc chưa |
| `created_at` | TIMESTAMP | DEFAULT NOW(), INDEX | Thời gian tạo |

**Indexes**:
- INDEX: `user_id`, `read_status`, `created_at`

#### `fcm_tokens`
Firebase Cloud Messaging tokens cho push notification.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Token ID |
| `user_id` | BIGINT | NOT NULL | User ID |
| `token` | VARCHAR(500) | NOT NULL | FCM token |
| `device_type` | VARCHAR(50) | NULL | Loại thiết bị (ANDROID, IOS, WEB) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() ON UPDATE | Ngày cập nhật |

**Indexes**:
- UNIQUE: `token`
- INDEX: `user_id`

---

## 4. 🤖 Matching Service Database (`matching_db`)

### Thông tin kết nối
- **Database**: `matching_db`
- **Type**: PostgreSQL 14
- **Host**: `localhost` (local) / `matching-db-test` (Docker)
- **Port**: `5432`
- **User**: `matching_user`
- **Password**: `matching_pass`
- **Connection String**: `postgresql://matching_user:matching_pass@localhost:5432/matching_db`

### Tables (Schema)

#### `applicant_features`
Features của sinh viên cho Machine Learning matching.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Feature ID |
| `applicant_id` | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | User ID sinh viên |
| `gpa` | FLOAT | NULL | GPA |
| `major` | VARCHAR(255) | NULL | Ngành học |
| `university` | VARCHAR(255) | NULL | Trường |
| `year_of_study` | INTEGER | NULL | Năm học |
| `skills` | TEXT[] | NULL | Array kỹ năng |
| `research_interests` | TEXT[] | NULL | Array lĩnh vực nghiên cứu |
| `skills_vector` | JSONB | NULL | TF-IDF vector của skills |
| `research_vector` | JSONB | NULL | TF-IDF vector của research |
| `combined_text` | TEXT | NULL | Text kết hợp cho vectorization |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| `last_processed_at` | TIMESTAMP | NULL | Lần xử lý cuối |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `applicant_id`

#### `opportunity_features`
Features của học bổng cho Machine Learning matching.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Feature ID |
| `opportunity_id` | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | Opportunity ID |
| `opportunity_type` | VARCHAR(50) | NOT NULL | Loại (scholarship/lab) |
| `title` | VARCHAR(500) | NULL | Tiêu đề |
| `description` | TEXT | NULL | Mô tả |
| `min_gpa` | FLOAT | NULL | GPA tối thiểu |
| `required_skills` | TEXT[] | NULL | Array kỹ năng yêu cầu |
| `preferred_majors` | TEXT[] | NULL | Array ngành ưu tiên |
| `research_areas` | TEXT[] | NULL | Array lĩnh vực nghiên cứu |
| `skills_vector` | JSONB | NULL | TF-IDF vector |
| `research_vector` | JSONB | NULL | TF-IDF vector |
| `combined_text` | TEXT | NULL | Text kết hợp |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| `last_processed_at` | TIMESTAMP | NULL | Lần xử lý cuối |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `opportunity_id`

#### `matching_scores`
Cache điểm matching (optional, để tối ưu performance).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Score ID |
| `applicant_id` | VARCHAR(255) | NOT NULL, INDEX | User ID sinh viên |
| `opportunity_id` | VARCHAR(255) | NOT NULL, INDEX | Opportunity ID |
| `overall_score` | FLOAT | NOT NULL | Điểm tổng |
| `gpa_score` | FLOAT | NULL | Điểm GPA |
| `skills_score` | FLOAT | NULL | Điểm kỹ năng |
| `research_score` | FLOAT | NULL | Điểm nghiên cứu |
| `calculated_at` | TIMESTAMP | DEFAULT NOW() | Thời gian tính |
| `expires_at` | TIMESTAMP | NULL | Thời gian hết hạn cache |

**Indexes**:
- INDEX: `applicant_id`, `opportunity_id`

---

## 5. 🔔 Notification Service Database

⚠️ **Chưa cấu hình database** - Service hiện tại chưa có database riêng, có thể sử dụng chung với Chat Service hoặc tạo database mới.

---

## 📊 Entity Relationship Diagram (ERD)

### Auth Service ERD
```
users ──┬──< user_roles >──┤ roles
        │
        └──< refresh_tokens
        │
        └──< audit_logs
```

### Scholarship Service ERD
```
opportunities ──┬──< applications ──< application_documents
                │
                ├──< bookmarks
                │
                ├──< opportunity_skills >──┤ skills
                │
                └──< opportunity_tags >──┤ tags
```

### Chat Service ERD
```
conversations ──< messages

users (auth_db) ──┬──< notifications
                  │
                  └──< fcm_tokens
```

### Matching Service ERD
```
applicant_features ──┐
                     ├──< matching_scores
opportunity_features ┘
```

---

## 🔧 Database Migration & Setup

### 1. Tạo Databases bằng Docker Compose

```bash
# Khởi động tất cả databases
docker-compose -f docker-compose.test.yml up -d auth-db scholarship-db matching-db

# Kiểm tra health
docker ps
```

### 2. Kết nối Database bằng MySQL/PostgreSQL Client

**MySQL (Auth, Scholarship, Chat):**
```bash
# Auth DB
mysql -h 127.0.0.1 -P 3307 -u auth_user -pauth_pass auth_db

# Scholarship DB
mysql -h 127.0.0.1 -P 3308 -u scholarship_user -pscholarship_pass scholarship_db

# Chat DB
mysql -h 127.0.0.1 -P 3306 -u root -p@Saitamass2 chat_db
```

**PostgreSQL (Matching):**
```bash
psql -h localhost -p 5432 -U matching_user -d matching_db
# Password: matching_pass
```

### 3. Schema Auto-generation

Tất cả services sử dụng JPA/Hibernate (Java) hoặc SQLAlchemy (Python) với `ddl-auto=update` nên schema sẽ tự động tạo khi service khởi động.

**application.properties:**
```properties
# Auto-create/update schema
spring.jpa.hibernate.ddl-auto=update
```

### 4. Initial Data

Auth Service có `InitialDataLoader.java` tự động tạo admin user và roles khi khởi động lần đầu:

```java
// Admin user: admin/admin123
// Roles: USER, EMPLOYER, ADMIN
```

---

## 🔒 Security Best Practices

1. **Password Encryption**: Tất cả passwords trong `users` table đều được BCrypt hash
2. **JWT Secrets**: Sử dụng cùng secret key `EduMatch_Super_Secret_Key_!@#_DoNotShare_!@#` cho tất cả services
3. **Database Credentials**: 
   - ⚠️ **Production**: Đổi tất cả passwords mặc định
   - ✅ **Development**: Sử dụng environment variables
4. **Connection Pooling**: Mỗi service có HikariCP pool riêng

---

## 📈 Performance Optimization

1. **Indexes**: Tất cả foreign keys và columns thường query đều có index
2. **Connection Pooling**: HikariCP với max 10-20 connections
3. **Query Optimization**: 
   - Sử dụng JPA Specifications cho dynamic queries
   - Lazy loading cho relationships
4. **Caching**: 
   - Redis cache cho matching scores
   - Application-level cache cho user sessions

---

## 🔄 Backup & Recovery

### Backup MySQL
```bash
# Backup single database
docker exec auth-db-test mysqldump -u auth_user -pauth_pass auth_db > auth_db_backup.sql

# Backup all databases
docker exec auth-db-test mysqldump -u root -prootpass --all-databases > all_mysql_backup.sql
```

### Backup PostgreSQL
```bash
docker exec matching-db-test pg_dump -U matching_user matching_db > matching_db_backup.sql
```

### Restore
```bash
# MySQL
docker exec -i auth-db-test mysql -u auth_user -pauth_pass auth_db < auth_db_backup.sql

# PostgreSQL
docker exec -i matching-db-test psql -U matching_user matching_db < matching_db_backup.sql
```

---

## 📝 Notes

- **Timezone**: Tất cả timestamps sử dụng UTC
- **Character Set**: UTF-8 (MySQL) / UTF-8 (PostgreSQL)
- **Foreign Keys**: Có constraint ON DELETE CASCADE cho các quan hệ phụ thuộc
- **Auto-increment**: MySQL sử dụng AUTO_INCREMENT, PostgreSQL sử dụng SERIAL/UUID

---

**Tài liệu được tạo**: November 16, 2025  
**Version**: 1.0  
**Maintainer**: EduMatch Dev Team
