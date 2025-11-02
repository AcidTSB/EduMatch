# EduMatch API Gateway Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         INTERNET / CLIENTS                        │
│                     (Browser, Mobile, API Clients)                │
└───────────────────────────────┬──────────────────────────────────┘
                                │
                                │ HTTP/HTTPS (Port 80)
                                │
                ┌───────────────▼────────────────┐
                │      NGINX API GATEWAY         │
                │  ┌──────────────────────────┐  │
                │  │  Rate Limiting           │  │
                │  │  - Auth: 5 req/min       │  │
                │  │  - ML: 20 req/min        │  │
                │  │  - API: 100 req/min      │  │
                │  └──────────────────────────┘  │
                │  ┌──────────────────────────┐  │
                │  │  Security                │  │
                │  │  - CORS Headers          │  │
                │  │  - XSS Protection        │  │
                │  │  - Frame Options         │  │
                │  └──────────────────────────┘  │
                │  ┌──────────────────────────┐  │
                │  │  Load Balancing          │  │
                │  │  - Health Checks         │  │
                │  │  - Failover              │  │
                │  └──────────────────────────┘  │
                └────┬────┬────┬────┬──────┬────┘
                     │    │    │    │      │
        ┌────────────┘    │    │    │      └────────────┐
        │                 │    │    │                   │
        │                 │    │    │                   │
        ▼                 ▼    ▼    ▼                   ▼
  ┌─────────┐      ┌─────────────────────┐       ┌──────────┐
  │ Frontend│      │   Backend Services  │       │  Infra   │
  │         │      │                     │       │          │
  │  React  │      │  ┌──────────────┐  │       │ RabbitMQ │
  │   :3000 │      │  │User Service  │  │       │  :5672   │
  │         │      │  │Java :8080    │  │       │ :15672   │
  └─────────┘      │  └──────┬───────┘  │       │          │
                   │         │ JDBC     │       └────┬─────┘
                   │  ┌──────▼───────┐  │            │
                   │  │PostgreSQL    │  │            │
                   │  │java_db :5433 │  │            │
                   │  └──────────────┘  │            │
                   │                    │            │
                   │  ┌──────────────┐  │            │
                   │  │Scholarship   │  │            │
                   │  │Service       │  │            │
                   │  │Java :8080    │◄─┼────────────┘
                   │  └──────┬───────┘  │    Events
                   │         │ JDBC     │
                   │  ┌──────▼───────┐  │
                   │  │Same DB       │  │
                   │  │java_db       │  │
                   │  └──────────────┘  │
                   │                    │
                   │  ┌──────────────┐  │
                   │  │Chat Service  │  │
                   │  │Java :8080    │  │
                   │  │WebSocket     │  │
                   │  └──────┬───────┘  │
                   │         │ JDBC     │
                   │  ┌──────▼───────┐  │
                   │  │Same DB       │  │
                   │  │java_db       │  │
                   │  └──────────────┘  │
                   │                    │
                   │  ┌──────────────┐  │       ┌──────────┐
                   │  │Matching      │  │       │ Celery   │
                   │  │Service       │◄─┼───────┤ Workers  │
                   │  │Python :8000  │  │       │          │
                   │  └──────┬───────┘  │       └────┬─────┘
                   │         │ SQLAlch  │            │
                   │  ┌──────▼───────┐  │       ┌────▼─────┐
                   │  │PostgreSQL    │  │       │ RabbitMQ │
                   │  │matching_db   │  │       │ Consumer │
                   │  │:5432         │  │       └──────────┘
                   │  └──────────────┘  │
                   └─────────────────────┘
```

## Request Flow

### 1. Frontend Access
```
Client → Gateway:80 → Frontend:3000 → React App
```

### 2. Authentication Flow
```
Client → POST /api/auth/login
      → Gateway (rate limit: 5/min)
      → User Service:8080
      → PostgreSQL (java_db)
      ← JWT Token
```

### 3. Matching Flow (ML)
```
Client → POST /api/v1/match/score
      → Gateway (rate limit: 20/min, timeout: 60s)
      → Matching Service:8000
      → ML Algorithm (TF-IDF + Cosine Similarity)
      → PostgreSQL (matching_db)
      ← Match Score (2-5 seconds)
```

### 4. Real-time Chat Flow
```
Client → WebSocket ws://gateway/api/ws/chat
      → Gateway (timeout: 7 days)
      → Chat Service:8080
      → WebSocket Handler
      ↔ Bidirectional messaging
```

### 5. Event-Driven Flow
```
Scholarship Service → RabbitMQ (scholarship.created)
                    → Matching Consumer
                    → Celery Worker
                    → Matching Service (update features)
                    → PostgreSQL (matching_db)
```

## Technology Stack

### Gateway Layer
| Component | Technology | Port | Purpose |
|-----------|-----------|------|---------|
| API Gateway | Nginx Alpine | 80 | Reverse proxy, routing, rate limiting |

### Frontend Layer
| Component | Technology | Port | Purpose |
|-----------|-----------|------|---------|
| Web App | React.js | 3000 | User interface |

### Backend Layer
| Component | Technology | Port | Database | Purpose |
|-----------|-----------|------|----------|---------|
| User Service | Java Spring Boot | 8080 | java_db:5433 | Authentication, user management |
| Scholarship Service | Java Spring Boot | 8080 | java_db:5433 | Scholarship CRUD, applications |
| Chat Service | Java Spring Boot | 8080 | java_db:5433 | Real-time messaging, notifications |
| Matching Service | Python FastAPI | 8000 | matching_db:5432 | ML-based matching, recommendations |

### Infrastructure Layer
| Component | Technology | Port | Purpose |
|-----------|-----------|------|---------|
| PostgreSQL (Java) | PostgreSQL 14 | 5433 | User, scholarship, chat data |
| PostgreSQL (Matching) | PostgreSQL 14 | 5432 | Matching features, scores |
| RabbitMQ | RabbitMQ 3.9 | 5672, 15672 | Event-driven communication |
| Celery Workers | Celery + Python | - | Async task processing |
| RabbitMQ Consumer | Python + Pika | - | Event consumption |

## Routing Table

### Gateway Routes (Port 80)

| Path Pattern | Backend | Timeout | Rate Limit | Authentication |
|--------------|---------|---------|------------|----------------|
| `/` | Frontend:3000 | - | None | Public |
| `/health` | Gateway | - | None | Public |
| `/gateway/status` | Gateway | - | None | Public |
| `/api/auth/*` | User:8080 | 30s | 5/min | Public |
| `/api/users/*` | User:8080 | 30s | 100/min | Required |
| `/api/profiles/*` | User:8080 | 30s | 100/min | Required |
| `/api/v1/match/*` | Matching:8000 | 60s | 20/min | Required |
| `/api/v1/recommendations/*` | Matching:8000 | 90s | 20/min | Required |
| `/api/scholarships/*` | Scholarship:8080 | 30s | 100/min | Required |
| `/api/opportunities/*` | Scholarship:8080 | 30s | 100/min | Required |
| `/api/applications/*` | Scholarship:8080 | 30s | 100/min | Required |
| `/api/messages/*` | Chat:8080 | 30s | 100/min | Required |
| `/api/conversations/*` | Chat:8080 | 30s | 100/min | Required |
| `/api/notifications/*` | Chat:8080 | 30s | 100/min | Required |
| `/api/ws/*` | Chat:8080 | 7 days | None | Required |

## Data Flow

### Synchronous (Request/Response)
```
Client Request
    ↓
Gateway (Nginx)
    ↓ HTTP Proxy
Backend Service (Java/Python)
    ↓ JDBC/SQLAlchemy
Database (PostgreSQL)
    ↑ Query Results
Backend Service
    ↑ JSON Response
Gateway
    ↑ HTTP Response
Client
```

### Asynchronous (Event-Driven)
```
User Profile Updated (User Service)
    ↓
RabbitMQ (user.profile.updated)
    ↓
Matching Consumer
    ↓
Celery Task (process_user_profile_updated)
    ↓
Matching Service (update features)
    ↓
Database (matching_db)
```

## Security Layers

### Layer 1: Network (Nginx)
- Rate limiting per endpoint
- CORS policy enforcement
- Request size limits (10MB)
- Security headers (XSS, Frame, Content-Type)

### Layer 2: Application (Backend)
- JWT authentication
- Role-based authorization
- Input validation
- SQL injection prevention (Prisma, SQLAlchemy)

### Layer 3: Database
- Separate databases per service
- Connection pooling
- Prepared statements
- Access control

## Scalability

### Horizontal Scaling
Each service can be scaled independently:
```yaml
user-service:
  deploy:
    replicas: 3  # 3 instances
```

Gateway automatically load balances:
```nginx
upstream user_service {
    server user-service-1:8080;
    server user-service-2:8080;
    server user-service-3:8080;
}
```

### Vertical Scaling
Resource limits per service:
```yaml
user-service:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
```

## Monitoring Points

### Gateway Metrics
- Request count per endpoint
- Response times
- Error rates (4xx, 5xx)
- Rate limit hits

### Service Metrics
- Health check status
- Database connection pool
- Queue length (RabbitMQ)
- Celery task processing time

### Infrastructure Metrics
- CPU/Memory usage
- Database connections
- Network I/O
- Disk usage

## Deployment

### Development
```bash
docker-compose up --build
```

### Production
1. Build images:
```bash
docker-compose build
```

2. Push to registry:
```bash
docker tag edumatch-gateway:latest registry.example.com/edumatch-gateway:v1.0
docker push registry.example.com/edumatch-gateway:v1.0
```

3. Deploy to cluster:
```bash
kubectl apply -f k8s/
```

## Disaster Recovery

### Database Backups
```bash
# Backup
docker exec java-db pg_dump -U java_admin java_edumatch_db > backup.sql

# Restore
docker exec -i java-db psql -U java_admin java_edumatch_db < backup.sql
```

### Service Failover
- Gateway automatically routes to healthy instances
- `max_fails=3, fail_timeout=30s`
- Health checks every 30 seconds

### RabbitMQ Durability
- Queues are durable
- Messages persisted to disk
- Automatic re-delivery on failure

## Performance Tuning

### Gateway
```nginx
worker_processes auto;        # CPU cores
worker_connections 1024;      # Concurrent connections
keepalive_timeout 65;         # Connection reuse
```

### Backend
```properties
# Java (application.properties)
server.tomcat.max-threads=200
spring.datasource.hikari.maximum-pool-size=10

# Python (uvicorn)
uvicorn app.main:app --workers 4
```

### Database
```sql
-- Connection pooling
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
```

## Maintenance

### Zero-Downtime Deployment
1. Deploy new version alongside old
2. Gateway routes 10% traffic to new version
3. Monitor error rates
4. Gradually increase traffic
5. Remove old version

### Health Checks
```bash
# Gateway
curl http://localhost/health

# Services
curl http://localhost:8081/health  # User
curl http://localhost:8000/health  # Matching
curl http://localhost:8082/health  # Scholarship
curl http://localhost:8083/health  # Chat
```

### Log Rotation
```nginx
# Nginx
access_log /var/log/nginx/access.log;
error_log /var/log/nginx/error.log;

# Rotate daily, keep 7 days
```

## Cost Optimization

### Resource Allocation
| Service | CPU | Memory | Storage | Replicas | Monthly Cost |
|---------|-----|--------|---------|----------|--------------|
| Gateway | 0.5 | 512MB | - | 2 | $20 |
| User | 1.0 | 1GB | - | 2 | $60 |
| Matching | 2.0 | 2GB | - | 2 | $120 |
| Scholarship | 1.0 | 1GB | - | 2 | $60 |
| Chat | 1.0 | 1GB | - | 2 | $60 |
| Frontend | 0.5 | 512MB | - | 2 | $20 |
| PostgreSQL | 1.0 | 2GB | 20GB | 2 | $80 |
| RabbitMQ | 0.5 | 1GB | 5GB | 1 | $30 |
| **Total** | | | | | **$450/mo** |

## Future Enhancements

1. **Service Mesh** (Istio/Linkerd)
   - Advanced traffic management
   - mTLS between services
   - Distributed tracing

2. **API Versioning**
   - `/api/v2/match/*`
   - Gradual migration

3. **Caching Layer** (Redis)
   - Cache frequent queries
   - Session storage
   - Rate limit counters

4. **CDN Integration**
   - Static asset caching
   - Geographic distribution
   - DDoS protection

5. **Observability**
   - Distributed tracing (Jaeger)
   - Metrics (Prometheus)
   - Dashboards (Grafana)
   - Alerting (AlertManager)
