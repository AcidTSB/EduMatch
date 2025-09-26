#!/bin/bash
# EduMatch System Startup Script

echo "🚀 Starting EduMatch System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Start database services
echo "📊 Starting database services..."
docker-compose up -d postgres redis

# Wait for databases to be ready
echo "⏳ Waiting for databases to initialize..."
sleep 10

# Run database migrations
echo "🔄 Running database migrations..."
cd backend
npx prisma migrate deploy
npx prisma db seed

# Start AI service
echo "🤖 Starting AI service..."
cd ../ai-service
python -m venv venv
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    . venv/Scripts/activate
else
    . venv/bin/activate
fi
pip install -r requirements.txt
python app.py &
AI_PID=$!
cd ..

# Start backend service
echo "⚡ Starting backend service..."
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Start frontend service
echo "🌐 Starting frontend service..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ EduMatch System is starting up!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo "🤖 AI Service: http://localhost:5000"
echo "📊 Database: PostgreSQL on localhost:5432"
echo "🔄 Cache: Redis on localhost:6379"
echo ""
echo "Press Ctrl+C to stop all services..."

# Trap Ctrl+C and cleanup
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $AI_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null
    docker-compose down
    echo "✅ All services stopped."
    exit 0
}

trap cleanup INT

# Keep script running
wait
