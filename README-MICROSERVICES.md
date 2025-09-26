# 🚀 EduMatch - MICROSERVICES ARCHITECTURE ONLY

## ⚡ **MANDATORY: Microservices Architecture**

EduMatch hiện tại **BẮT BUỘC** sử dụng kiến trúc Microservices. Monolithic backend đã được deprecated và không được khuyến nghị sử dụng.

---

## 🏗️ **System Architecture**

```
Frontend (Next.js)    →    API Gateway    →    Microservices
     :3001                    :3000              :3002, :3003...
                                                      ↓
                                                 PostgreSQL
                                                   :5432
```

### **Services Map:**
- **Frontend**: Next.js Application (Port 3001)
- **API Gateway**: Central routing hub (Port 3000)
- **Auth Service**: Authentication & Authorization (Port 3002)
- **User Service**: User management (Port 3003) - *Coming soon*
- **Scholarship Service**: Scholarship management (Port 3004) - *Coming soon*
- **Database**: PostgreSQL in Docker (Port 5432)

---

## 🚀 **Quick Start (ONE COMMAND)**

```powershell
# Start entire system
.\start-microservices-system.ps1
```

This script will:
1. ✅ Start PostgreSQL database
2. ✅ Start API Gateway (Port 3000)  
3. ✅ Start Auth Service (Port 3002)
4. ✅ Start Frontend (Port 3001)
5. ✅ Configure all routing automatically

---

## 📱 **Access Points**

### **Main Application**
```bash
Frontend Application: http://localhost:3001
```

### **API Endpoints**
```bash
# Via API Gateway (RECOMMENDED)
Authentication: http://localhost:3000/api/auth/*
Users:         http://localhost:3000/api/users/*
Scholarships:  http://localhost:3000/api/scholarships/*

# Direct service access (for debugging)
Auth Service:  http://localhost:3002/api/*
```

### **Documentation**
```bash
API Gateway Docs: http://localhost:3000/api/docs
Auth Service Docs: http://localhost:3002/api/docs
System Health:    http://localhost:3000/api/health
```

---

## 🔄 **Request Flow**

### **Authentication Flow:**
```
1. Frontend (3001) → API Gateway (3000)
2. API Gateway routes /auth/* → Auth Service (3002)
3. Auth Service ↔ PostgreSQL Database
4. Response: Auth Service → API Gateway → Frontend
```

### **Example API Calls:**
```javascript
// Frontend calls API Gateway
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})

// API Gateway routes to Auth Service (automatic)
// Auth Service processes and returns JWT token
```

---

## 🛠️ **Manual Start (if needed)**

### **1. Database**
```powershell
# Start PostgreSQL
docker start edumatch-postgres

# Or create new container
docker run --name edumatch-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=edumatch -p 5432:5432 -d postgres:15
```

### **2. Microservices**
```powershell
# Terminal 1 - API Gateway
cd "microservices\api-gateway"
npm run start:dev

# Terminal 2 - Auth Service
cd "microservices\auth-service"  
npm run start:dev
```

### **3. Frontend**
```powershell
# Terminal 3 - Frontend
cd "frontend"
npm run dev
```

---

## 🔧 **Environment Configuration**

### **Frontend Environment (AUTO-CONFIGURED)**
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### **Service Ports (FIXED)**
- API Gateway: `3000`
- Frontend: `3001`  
- Auth Service: `3002`
- User Service: `3003`
- Scholarship Service: `3004`
- Application Service: `3005`
- Matching Service: `3006`
- Notification Service: `3007`

---

## 📊 **System Status**

### **Currently Available:**
- ✅ **API Gateway** - Full routing, health monitoring
- ✅ **Auth Service** - JWT authentication, user management
- ✅ **Frontend** - Complete Next.js application
- ✅ **Database** - PostgreSQL with full schema

### **Coming Soon:**
- 🔄 **User Service** - Profile management
- 🔄 **Scholarship Service** - Scholarship CRUD
- 🔄 **Application Service** - Application processing
- 🔄 **Matching Service** - AI-powered matching
- 🔄 **Notification Service** - Real-time notifications

---

## 🎯 **Key Benefits**

### **🚀 Scalability**
- Independent service scaling
- Load balancing via API Gateway
- Resource optimization per service

### **🔧 Maintainability**
- Smaller, focused codebases
- Independent deployments
- Team autonomy per service

### **🛡️ Reliability**  
- Fault isolation between services
- Health monitoring and circuit breakers
- Graceful degradation

### **🔄 Development**
- Parallel development across teams
- Technology diversity per service
- Independent testing and deployment

---

## 🆘 **Troubleshooting**

### **Port Conflicts:**
```powershell
# Check running services
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002

# Kill conflicting processes
taskkill /PID <pid> /F
```

### **Database Connection Issues:**
```powershell
# Check PostgreSQL container
docker ps | findstr postgres
docker logs edumatch-postgres

# Restart database
docker restart edumatch-postgres
```

### **Service Health Check:**
```bash
curl http://localhost:3000/api/health
curl http://localhost:3002/api/health
```

---

## 🏆 **ARCHITECTURE STATUS: MANDATORY MICROSERVICES**

**✅ EduMatch is now 100% Microservices-based**

- No monolithic backend used
- All communication via API Gateway
- Distributed, scalable architecture
- Enterprise-ready deployment

**🎉 Ready for production scaling and team development!**