@echo off
REM EduMatch System Startup Script for Windows

echo 🚀 Starting EduMatch System...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

REM Start database services
echo 📊 Starting database services...
docker-compose up -d postgres redis

REM Wait for databases to be ready
echo ⏳ Waiting for databases to initialize...
timeout /t 10 /nobreak >nul

REM Run database migrations
echo 🔄 Running database migrations...
cd backend
call npx prisma migrate deploy
call npx prisma db seed

REM Start AI service
echo 🤖 Starting AI service...
cd ..\ai-service
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
start "AI Service" cmd /k "venv\Scripts\activate.bat && python app.py"

REM Start backend service
echo ⚡ Starting backend service...
cd ..\backend
start "Backend Service" cmd /k "npm run start:dev"

REM Start frontend service
echo 🌐 Starting frontend service...
cd ..\frontend
start "Frontend Service" cmd /k "npm run dev"

cd ..

echo.
echo ✅ EduMatch System is starting up!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:3001
echo 🤖 AI Service: http://localhost:5000
echo 📊 Database: PostgreSQL on localhost:5432
echo 🔄 Cache: Redis on localhost:6379
echo.
echo Press any key to stop all services...
pause >nul

echo 🛑 Shutting down services...
docker-compose down
echo ✅ All services stopped.
pause
