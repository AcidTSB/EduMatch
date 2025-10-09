# Spring Boot JWT Authentication Example-2025

A complete JWT authentication and authorization implementation using Spring Boot 3, Spring Security 6, and JPA.

## Features

- 🔐 Complete JWT-based authentication system
- 👤 User registration and login
- 👮 Role-based authorization
- 🛡️ Protected API endpoints
- 📝 User profile management
- 🔄 Token generation and validation
- ⚡ Exception handling for authentication failures

## Technology Stack

- Java 21+
- Spring Boot 3.x
- Spring Security 6.x
- Spring Data JPA
- JWT (JSON Web Token)
- Maven
- MySQL (configurable)

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

## Setup Instructions

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- Your favorite IDE (IntelliJ IDEA, Eclipse, VS Code)

### Configuration

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jwt-authentication-example.git
   cd jwt-authentication-example
   ```

2. Configure application.properties:
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:mysql://localhost:3306/jwt_auth_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   
   # JWT Configuration
   app.jwt.secret=your_jwt_secret_key_should_be_very_long_and_secure
   app.jwt.expiration=86400000
   app.jwt.header=Authorization
   app.jwt.prefix=Bearer 
   ```

3. Create the database:
   ```sql
   CREATE DATABASE jwt_auth_db;
   ```

4. Initialize roles in the database:
   ```sql
   INSERT INTO roles(name, description) VALUES('ROLE_USER', 'Standard user role');
   INSERT INTO roles(name, description) VALUES('ROLE_ADMIN', 'Administrator role');
   ```

### Build and Run

```bash
mvn clean install
mvn spring-boot:run
```

The application will be available at `http://localhost:8080`

## API Endpoints

### Authentication

| Method | URL | Description | Required Fields |
|--------|-----|-------------|----------------|
| POST | `/api/auth/signup` | Register a new user | username, password, firstName, lastName, email |
| POST | `/api/auth/signin` | Authenticate user & get JWT | username, password |

### User Management

| Method | URL | Description | Access |
|--------|-----|-------------|--------|
| GET | `/api/user/me` | Get current user details | Authenticated users |
| GET | `/api/users/{username}` | Get user profile | All users |
| DELETE | `/api/users/{username}` | Delete a user | ADMIN only |

## Example Usage

### Register a new user
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test@123",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com"
}'
```

### Login and get token
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test@123"
}'
```

### Access protected endpoint
```bash
curl -X GET http://localhost:8080/api/user/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Implementation Details

### JWT Token Structure

The JWT token contains:

- Subject: Username of the authenticated user
- Roles: User authorities (ROLE_USER, ROLE_ADMIN)
- Issued At: Token creation timestamp
- Expiration: Token expiration timestamp

### Authentication Flow

1. Client sends credentials to `/api/auth/signin`
2. Server validates credentials and returns a JWT token
3. Client includes the JWT token in the Authorization header for subsequent requests
4. JwtAuthenticationFilter intercepts requests, validates tokens, and sets up SecurityContext
5. Protected resources are accessed based on user roles and permissions

## Project Highlights

- **Stateless Authentication**: No session management required
- **Role-Based Security**: Method-level security with @PreAuthorize
- **Custom Exception Handling**: Proper error responses for authentication failures
- **Password Encryption**: BCrypt password encoding
- **Token Validation**: Comprehensive JWT validation


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request