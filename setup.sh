#!/bin/bash

# EduMatch Development Setup Script

echo "🚀 Starting EduMatch Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create .env files if they don't exist
echo "📝 Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Backend .env created"
fi

if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✅ Frontend .env.local created"
fi

if [ ! -f "ai-service/.env" ]; then
    cp ai-service/.env.example ai-service/.env
    echo "✅ AI Service .env created"
fi

# Start PostgreSQL and Redis
echo "🗄️ Starting database services..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Setup Backend
echo "🔧 Setting up backend..."
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
cd ..

# Setup Frontend
echo "🎨 Setting up frontend..."
cd frontend
npm install
cd ..

# Setup AI Service
echo "🤖 Setting up AI service..."
cd ai-service
python -m venv venv

# Activate virtual environment based on OS
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

pip install -r requirements.txt
cd ..

echo "✅ Setup completed!"
echo ""
echo "🚀 To start the development servers:"
echo "   Backend:     cd backend && npm run start:dev"
echo "   Frontend:    cd frontend && npm run dev"  
echo "   AI Service:  cd ai-service && python app.py"
echo ""
echo "🌐 URLs:"
echo "   Frontend:    http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   API Docs:    http://localhost:3001/api/docs"
echo "   AI Service:  http://localhost:5000"
echo ""
echo "👤 Default users:"
echo "   Admin:    admin@edumatch.com / admin123"
echo "   Student:  student@example.com / student123"
echo "   Provider: provider@university.edu / provider123"
