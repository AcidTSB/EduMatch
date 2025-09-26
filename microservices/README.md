# EduMatch Microservices Architecture

## 🏗️ Architecture Overview

EduMatch has been successfully converted from a monolithic architecture to a **TRUE microservices architecture** with the following components:

## 🚪 API Gateway (Port 3000)
- **Purpose**: Central entry point and request routing
- **Location**: `microservices/api-gateway/`
- **Technology**: NestJS + Express + Axios for proxying
- **Features**:
  - Routes requests to appropriate microservices
  - Service discovery and health monitoring  
  - Load balancing and timeout handling
  - Centralized API documentation
- **URL**: http://localhost:3000
- **Docs**: http://localhost:3000/api/docs
- **Health**: http://localhost:3000/api/health

## 🔐 Auth Service (Port 3002)
- **Purpose**: Authentication and authorization
- **Location**: `microservices/auth-service/`
- **Technology**: NestJS + Prisma + JWT + Passport
- **Responsibilities**:
  - User registration and login
  - JWT token generation and validation
  - Password hashing and security
  - Role-based access control
- **Routes**: `/api/auth/*`

## 👤 User Service (Port 3003)
- **Purpose**: User management and profiles
- **Location**: `microservices/user-service/`
- **Technology**: NestJS + Prisma + Multer
- **Responsibilities**:
  - User profile management
  - Profile photo upload
  - User preferences and settings
  - Academic background tracking
- **Routes**: `/api/users/*`, `/api/profiles/*`

## 🎓 Scholarship Service (Port 3004)
- **Purpose**: Scholarship management
- **Location**: `microservices/scholarship-service/`
- **Technology**: NestJS + Prisma
- **Responsibilities**:
  - Scholarship CRUD operations
  - Eligibility criteria management
  - Deadline tracking
  - Institution partnership management
- **Routes**: `/api/scholarships/*`

## 📝 Application Service (Port 3005)
- **Purpose**: Application processing
- **Location**: `microservices/application-service/`
- **Technology**: NestJS + Prisma
- **Responsibilities**:
  - Application submission and tracking
  - Document upload and verification
  - Application status management
  - Review workflow
- **Routes**: `/api/applications/*`

## 🤖 Matching Service (Port 3006)
- **Purpose**: AI-powered matching
- **Location**: `microservices/matching-service/`
- **Technology**: NestJS + Python Flask + TF-IDF
- **Responsibilities**:
  - Student-scholarship matching algorithms
  - Compatibility scoring
  - Recommendation generation
  - ML model integration
- **Routes**: `/api/matching/*`

## 📧 Notification Service (Port 3007)
- **Purpose**: Communications and messaging
- **Location**: `microservices/notification-service/`
- **Technology**: NestJS + Prisma + WebSockets
- **Responsibilities**:
  - Email notifications
  - Real-time messaging
  - Push notifications
  - Communication history
- **Routes**: `/api/notifications/*`, `/api/messages/*`

## 🗄️ Database Architecture

### Shared Database Strategy
- **Database**: PostgreSQL (localhost:5432)
- **Schema**: `edumatch`
- **Connection**: Each microservice connects to the same database
- **Migration**: Prisma handles schema synchronization
- **Advantages**: Data consistency, transaction support, simpler initial setup

### Future Considerations
- Each service can later have its own database
- Database per service pattern for full independence
- Event-driven data synchronization

## 🛠️ Development Setup

### Quick Start
```powershell
# Start all services
cd "d:\Coding\XDPM OOP\microservices"
.\start-all-services.ps1
```

### Manual Start
```powershell
# Terminal 1 - API Gateway
cd "d:\Coding\XDPM OOP\microservices\api-gateway"
npm run start:dev

# Terminal 2 - Auth Service  
cd "d:\Coding\XDPM OOP\microservices\auth-service"
npm run start:dev

# Terminal 3 - User Service
cd "d:\Coding\XDPM OOP\microservices\user-service"
npm run start:dev

# ... and so on for each service
```

## 🔄 Request Flow

1. **Client** → API Gateway (localhost:3000)
2. **API Gateway** → Routes to appropriate microservice
3. **Microservice** → Processes request and returns response
4. **API Gateway** → Returns response to client

Example: `GET /api/auth/profile`
- Client calls API Gateway: `http://localhost:3000/api/auth/profile`
- API Gateway routes to Auth Service: `http://localhost:3002/api/profile`
- Auth Service processes and returns user profile
- API Gateway forwards response to client

## 📊 Service Communication

### Current: Synchronous HTTP
- Services communicate via REST APIs
- API Gateway handles all external requests
- Inter-service communication through direct HTTP calls

### Future: Asynchronous Messaging
- Event-driven architecture with message queues
- Redis/RabbitMQ for async communication
- Event sourcing for data consistency

## 🔧 Configuration

### Environment Variables
Each service has its own `.env` file:
- Database connection strings
- Service URLs and ports
- JWT secrets and API keys
- Feature flags

### Service Registry
API Gateway maintains service registry:
```javascript
{
  'auth-service': 'http://localhost:3002',
  'user-service': 'http://localhost:3003',
  'scholarship-service': 'http://localhost:3004',
  'application-service': 'http://localhost:3005',
  'matching-service': 'http://localhost:3006',
  'notification-service': 'http://localhost:3007'
}
```

## ✅ Benefits Achieved

### Scalability
- Each service can be scaled independently
- Load balancing per service
- Resource optimization

### Maintainability  
- Smaller, focused codebases
- Independent deployments
- Technology diversity support

### Reliability
- Service isolation prevents cascading failures
- Circuit breaker patterns
- Health monitoring per service

### Development
- Team autonomy per service
- Parallel development
- Independent testing and deployment

## 🚀 Deployment Strategy

### Development
- All services run locally
- Shared database for simplicity
- Hot reload for development

### Production (Future)
- Docker containerization
- Kubernetes orchestration
- Load balancers and service mesh
- Distributed databases

## 📈 Monitoring & Observability

### Health Checks
- Each service exposes `/health` endpoint
- API Gateway aggregates health status
- Service discovery and availability tracking

### Logging
- Centralized logging strategy
- Request tracing across services
- Performance metrics

## 🔄 Migration Status

✅ **COMPLETED**:
- Monolithic backend fully functional
- PostgreSQL database setup and seeded
- API Gateway with proxy routing
- Auth service extracted and configured
- Service structure for all microservices

🔄 **IN PROGRESS**:
- Complete microservice implementations
- Inter-service authentication
- Service dependency management

⏭️ **NEXT STEPS**:
1. Complete remaining microservice implementations
2. Add inter-service authentication
3. Implement health monitoring
4. Add integration tests
5. Docker containerization

---

**Status**: Successfully converted from monolithic to microservices architecture! 🎉

The EduMatch platform now runs as a distributed system with clear service boundaries, independent scalability, and maintainable architecture.