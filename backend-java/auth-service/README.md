# Auth Service - EduMatch Platform

Authentication & Authorization service cho EduMatch platform - Quan ly nguoi dung, JWT tokens va phan quyen.

## Features

- 🔐 JWT-based authentication (Login/Register)
- 👤 User management (Create, Read, Delete, Lock/Unlock)
- 👮 Role-based authorization (USER, ADMIN, EMPLOYER)
- � Refresh token support
- 📝 Audit logging (Track user actions)
- �🛡️ Protected API endpoints
- 🏢 Organization support for employers
- � Internal API for microservices
- 🐳 Docker support

## Technology Stack

- Java 17
- Spring Boot 3.3.2
- Spring Security 6
- Spring Data JPA
- JWT (io.jsonwebtoken 0.12.5)
- MySQL 8.0
- Maven 3.9+
- Lombok
- RabbitMQ (Optional - for event publishing)

## Project Structure

```
.
├── src/main/java/com/example/jwt_my_exsample
│   ├── controller
│   │   ├── AuthController.java         # Handles authentication requests
│   │   └── UserController.java         # User profile and management
│   ├── dto
│   │   ├──response        
│   │   │  ├──ApiResponse.java         
│   │   │  └──JwtAuthenticationResponse.java 
│   │   ├──request    
│   │   │  ├──SignUpRequest.java  
│   │   │  └──LoginRequest.java
│   │   ├──UserProfile.java
│   │   └──UserSummary.java
│   ├── model
│   │   ├── Role.java                   # Role entity
│   │   └── User.java                   # User entity with UserDetails implementation
│   ├── repository
│   │   ├── RoleRepository.java
│   │   └── UserRepository.java
│   ├── security
│   │   ├── JwtAuthenticationEntryPoint.java # Handles auth errors
│   │   ├── JwtAuthenticationFilter.java     # JWT filter for requests
│   │   ├── JwtTokenProvider.java            # JWT token generation and validation
│   │   └── SecurityConfig.java              # Security configuration
│   ├── service
│   │   └── CustomUserDetailsService.java    # UserDetailsService implementation
```

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.9+
- MySQL 8.0+

### Run Locally
```bash
# 1. Create database
mysql -u root -p
CREATE DATABASE jwt;

# 2. Configure application.properties
# Update database credentials if needed

# 3. Run service
cd backend-java/auth-service
mvn spring-boot:run
```

Service will start on: `http://localhost:8081`

### Run with Docker
```bash
cd backend-java/auth-service
docker build -t auth-service .
docker run -p 8081:8080 \
  -e DB_HOST=mysql \
  -e DB_PORT=3306 \
  auth-service
```

## API Endpoints

### Authentication (`/api/auth`)
| Method | URL | Description | Access |
|--------|-----|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/signin` | Login and get JWT | Public |
| POST | `/api/auth/refresh` | Refresh access token | Public |

### User (`/api/user`)
| Method | URL | Description | Access |
|--------|-----|-------------|--------|
| GET | `/api/user/me` | Get current user info | ROLE_USER |
| GET | `/api/internal/user/{username}` | Get user details (internal API) | Authenticated |

### Admin (`/api/admin`)
| Method | URL | Description | Access |
|--------|-----|-------------|--------|
| POST | `/api/admin/create-employer` | Create employer account | ROLE_ADMIN |
| POST | `/api/admin/create-user` | Create user account | ROLE_ADMIN |
| GET | `/api/admin/users` | List all users (paginated) | ROLE_ADMIN |
| GET | `/api/admin/users/{id}` | Get user by ID | ROLE_ADMIN |
| DELETE | `/api/admin/users/{id}` | Delete user | ROLE_ADMIN |
| PATCH | `/api/admin/users/{id}/toggle-status` | Lock/unlock user | ROLE_ADMIN |
| GET | `/api/admin/scholarships` | List scholarships (mock) | ROLE_ADMIN |
| PATCH | `/api/admin/scholarships/{id}/approve` | Approve scholarship | ROLE_ADMIN |
| PATCH | `/api/admin/scholarships/{id}/reject` | Reject scholarship | ROLE_ADMIN |
| GET | `/api/admin/audit/logs` | View audit logs | ROLE_ADMIN |
| GET | `/api/admin/audit/users/{id}` | View user's audit logs | ROLE_ADMIN |

## Example Usage

### 1. Register a new user
```bash
curl -X POST http://localhost:8081/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
}'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

### 2. Login and get JWT token
```bash
curl -X POST http://localhost:8081/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
}'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "tokenType": "Bearer"
}
```

### 3. Get current user info
```bash
curl -X GET http://localhost:8081/api/user/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "name": "John Doe"
}
```

### 4. Admin: List all users
```bash
curl -X GET "http://localhost:8081/api/admin/users?page=0&size=10" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### 5. Refresh token
```bash
curl -X POST http://localhost:8081/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}'
```

## Configuration

### application.properties
```properties
# Application
spring.application.name=jwt_my_example
server.port=8081

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/jwt
spring.datasource.username=root
spring.datasource.password=@Saitamass2
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
app.jwt.secret=EduMatch_Super_Secret_Key_!@#_DoNotShare_!@#
app.jwt.expiration=86400000  # 24 hours
app.jwtRefreshExpirationMs=604800000  # 7 days
app.jwt.header=Authorization
app.jwt.prefix=Bearer

# RabbitMQ (Optional)
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest

# Logging
logging.level.org.springframework.security=DEBUG
```

### Database Schema
```sql
-- Create database
CREATE DATABASE jwt;

-- Roles will be auto-created by Hibernate
-- Default roles: ROLE_USER, ROLE_ADMIN, ROLE_EMPLOYER
```