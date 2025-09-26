@echo off
REM EduMatch Development Setup Script for Windows

echo 🚀 Starting EduMatch Development Environment...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

REM Create .env files if they don't exist
echo 📝 Setting up environment files...

if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env" >nul
    echo ✅ Backend .env created
)

if not exist "frontend\.env.local" (
    copy "frontend\.env.example" "frontend\.env.local" >nul
    echo ✅ Frontend .env.local created
)

if not exist "ai-service\.env" (
    copy "ai-service\.env.example" "ai-service\.env" >nul
    echo ✅ AI Service .env created
)

REM Start PostgreSQL and Redis
echo 🗄️ Starting database services...
docker-compose up -d postgres redis

REM Wait for PostgreSQL to be ready
echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 10 >nul

REM Setup Backend
echo 🔧 Setting up backend...
cd backend
call npm install
call npx prisma generate
call npx prisma migrate dev --name init
call npx prisma db seed
cd ..

REM Setup Frontend
echo 🎨 Setting up frontend...
cd frontend
call npm install
cd ..

REM Setup AI Service
echo 🤖 Setting up AI service...
cd ai-service
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo ✅ Setup completed!
echo.
echo 🚀 To start the development servers:
echo    Backend:     cd backend ^&^& npm run start:dev
echo    Frontend:    cd frontend ^&^& npm run dev
echo    AI Service:  cd ai-service ^&^& python app.py
echo.
echo 🌐 URLs:
echo    Frontend:    http://localhost:3000
echo    Backend API: http://localhost:3001
echo    API Docs:    http://localhost:3001/api/docs
echo    AI Service:  http://localhost:5000
echo.
echo 👤 Default users:
echo    Admin:    admin@edumatch.com / admin123
echo    Student:  student@example.com / student123
echo    Provider: provider@university.edu / provider123

pause
