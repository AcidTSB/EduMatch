# API Gateway Configuration

## Architecture Overview

```
Browser (Frontend)
    ↓
Nginx Gateway (Port 8080)
    ↓ Routes based on path
    ├── /api/auth → Auth Service (Port 8081)
    ├── /api/users → Auth Service (Port 8081)
    ├── /api/scholarships → Scholarship Service (Port 8082)
    ├── /api/applications → Scholarship Service (Port 8082)
    ├── /api/opportunities → Scholarship Service (Port 8082)
    ├── /api/matching → Matching Service (Port 8000)
    └── /api/notifications → Notification Service (Port 8083)
```

## Configuration Files

### 1. Frontend Environment (`.env.local`)
```env
NEXT_PUBLIC_API_GATEWAY=http://localhost:8080
```

### 2. Frontend API Client (`src/lib/api.ts`)
```typescript
const GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
const API_BASE_URL = `${GATEWAY_URL}/api`;
```

### 3. Nginx Gateway (`nginx-gateway/nginx.conf`)
- **Port**: 80 (mapped to 8080 on host)
- **Routes**: All `/api/*` paths are proxied to backend services
- **CORS**: Enabled for all routes
- **Rate Limiting**: Applied to protect services

### 4. Docker Compose (`docker-compose.test.yml`)
```yaml
api-gateway:
  image: nginx:alpine
  ports:
    - "8080:80"  # Host:Container
  volumes:
    - ./nginx-gateway/nginx.conf:/etc/nginx/nginx.conf:ro
```

## Request Flow Example

### Login Request
```
1. Browser: POST http://localhost:8080/api/auth/login
   ↓
2. Nginx Gateway: Receives request at port 8080
   ↓
3. Nginx: Matches route "/api/auth" → proxy to auth_service
   ↓
4. Auth Service: Receives request at port 8081
   ↓
5. Auth Service: Returns { token, user }
   ↓
6. Nginx: Returns response to browser
   ↓
7. Browser: Stores token and user data
```

### Get Scholarships Request
```
1. Browser: GET http://localhost:8080/api/scholarships
   Headers: Authorization: Bearer <token>
   ↓
2. Nginx Gateway: Receives request
   ↓
3. Nginx: Matches "/api/scholarships" → proxy to scholarship_service
   ↓
4. Scholarship Service: Receives at port 8082
   ↓
5. Returns list of scholarships
```

## Benefits of Using Gateway

1. **Single Entry Point**: One URL for all services
2. **Load Balancing**: Can distribute requests across multiple instances
3. **Rate Limiting**: Protect services from abuse
4. **CORS Handling**: Centralized CORS configuration
5. **SSL/TLS Termination**: Can add HTTPS at gateway level
6. **Monitoring**: Single point for logging and metrics
7. **Service Discovery**: Frontend doesn't need to know individual service URLs

## Local Development

### Running with Docker Compose
```bash
# Start all services including gateway
docker-compose -f docker-compose.test.yml up -d

# Check gateway health
curl http://localhost:8080/gateway/health

# Check service routing
curl http://localhost:8080/api/auth/health
curl http://localhost:8080/api/scholarships/health
```

### Running Frontend Locally (pointing to Docker gateway)
```bash
cd frontend

# .env.local already configured
# NEXT_PUBLIC_API_GATEWAY=http://localhost:8080

npm run dev
# Frontend at http://localhost:3000
# API calls go through http://localhost:8080
```

## Gateway Endpoints

### Health Checks
- `GET /gateway/health` - Gateway health status
- `GET /gateway/status` - All services status

### Auth Service Routes
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/users/{id}`
- `PUT /api/users/profile`

### Scholarship Service Routes
- `GET /api/scholarships`
- `GET /api/scholarships/{id}`
- `POST /api/scholarships`
- `GET /api/applications`
- `POST /api/applications`

### Matching Service Routes
- `GET /api/matching/recommendations`
- `POST /api/matching/calculate`

## Troubleshooting

### Check if gateway is running
```bash
docker ps | grep api-gateway
curl http://localhost:8080/gateway/health
```

### Check service connectivity from gateway
```bash
docker exec -it api-gateway-test sh
wget -O- http://auth-service-test:8081/actuator/health
wget -O- http://scholarship-service-test:8082/actuator/health
```

### View gateway logs
```bash
docker logs api-gateway-test -f
```

### Common Issues

1. **CORS errors**: Check nginx.conf CORS headers
2. **502 Bad Gateway**: Backend service is down
3. **404 Not Found**: Route not configured in nginx.conf
4. **Timeout**: Increase proxy timeout in nginx.conf
