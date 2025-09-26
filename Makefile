# ======================================
# EduMatch Development Commands
# ======================================

# Quick Start (after setup)
dev:
	@echo "🚀 Starting EduMatch development servers..."
	@$(MAKE) -j3 dev-backend dev-frontend dev-ai

# Individual services
dev-backend:
	@echo "🔧 Starting Backend..."
	cd backend && npm run start:dev

dev-frontend:
	@echo "🎨 Starting Frontend..."
	cd frontend && npm run dev

dev-ai:
	@echo "🤖 Starting AI Service..."
	cd ai-service && python app.py

# Database operations
db-reset:
	@echo "🗄️ Resetting database..."
	cd backend && npx prisma migrate reset --force
	cd backend && npx prisma db seed

db-migrate:
	@echo "🔄 Running database migrations..."
	cd backend && npx prisma migrate dev

db-seed:
	@echo "🌱 Seeding database..."
	cd backend && npx prisma db seed

db-studio:
	@echo "🎯 Opening Prisma Studio..."
	cd backend && npx prisma studio

# Docker operations
docker-up:
	@echo "🐳 Starting Docker services..."
	docker-compose up -d

docker-down:
	@echo "🛑 Stopping Docker services..."
	docker-compose down

docker-logs:
	@echo "📜 Viewing Docker logs..."
	docker-compose logs -f

# Build operations
build:
	@echo "🏗️ Building all services..."
	@$(MAKE) -j3 build-backend build-frontend build-ai

build-backend:
	@echo "🔧 Building Backend..."
	cd backend && npm run build

build-frontend:
	@echo "🎨 Building Frontend..."
	cd frontend && npm run build

build-ai:
	@echo "🤖 Building AI Service..."
	cd ai-service && pip install -r requirements.txt

# Testing
test:
	@echo "🧪 Running all tests..."
	@$(MAKE) -j2 test-backend test-frontend

test-backend:
	@echo "🔧 Testing Backend..."
	cd backend && npm run test

test-frontend:
	@echo "🎨 Testing Frontend..."
	cd frontend && npm run test

# Code quality
lint:
	@echo "🔍 Linting code..."
	@$(MAKE) -j2 lint-backend lint-frontend

lint-backend:
	cd backend && npm run lint

lint-frontend:
	cd frontend && npm run lint

# Cleanup
clean:
	@echo "🧹 Cleaning up..."
	cd backend && rm -rf node_modules dist
	cd frontend && rm -rf node_modules .next
	cd ai-service && rm -rf venv __pycache__
	docker-compose down -v

# Installation
install:
	@echo "📦 Installing dependencies..."
	cd backend && npm install
	cd frontend && npm install
	cd ai-service && pip install -r requirements.txt

# Production deployment
prod-build:
	@echo "🏭 Building for production..."
	docker-compose -f docker-compose.prod.yml build

prod-up:
	@echo "🚀 Starting production services..."
	docker-compose -f docker-compose.prod.yml up -d

prod-down:
	@echo "🛑 Stopping production services..."
	docker-compose -f docker-compose.prod.yml down

# Help
help:
	@echo "EduMatch Development Commands:"
	@echo "  dev          - Start all development servers"
	@echo "  dev-backend  - Start backend only"
	@echo "  dev-frontend - Start frontend only"
	@echo "  dev-ai       - Start AI service only"
	@echo "  db-reset     - Reset and seed database"
	@echo "  db-migrate   - Run database migrations"
	@echo "  db-seed      - Seed database with sample data"
	@echo "  db-studio    - Open Prisma Studio"
	@echo "  docker-up    - Start Docker services"
	@echo "  docker-down  - Stop Docker services"
	@echo "  build        - Build all services"
	@echo "  test         - Run all tests"
	@echo "  lint         - Lint all code"
	@echo "  clean        - Clean all dependencies and builds"
	@echo "  install      - Install all dependencies"

.PHONY: dev dev-backend dev-frontend dev-ai db-reset db-migrate db-seed db-studio docker-up docker-down build test lint clean install help
