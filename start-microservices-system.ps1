# EduMatch Microservices - FULL SYSTEM STARTUP
# Khởi động toàn bộ hệ thống Microservices (MANDATORY)

Write-Host "STARTING EDUMATCH MICROSERVICES SYSTEM" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Base path
$BasePath = "d:\Coding\XDPM OOP"

# Function to start a service in a new window
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [int]$Port,
        [string]$Description
    )
    
    Write-Host "[$ServiceName] Starting on port $Port - $Description" -ForegroundColor Cyan
    
    $cmd = "cd '$ServicePath'; npm run start:dev"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd -WindowStyle Normal
    
    Start-Sleep 3
}

Write-Host ""
Write-Host "STEP 1: Starting Database..." -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

# Start PostgreSQL Database
Write-Host "[DATABASE] Starting PostgreSQL..." -ForegroundColor Cyan
$dbStatus = docker ps --filter "name=edumatch-postgres" --format "{{.Names}}"
if ($dbStatus -eq "edumatch-postgres") {
    Write-Host "[DATABASE] PostgreSQL already running" -ForegroundColor Green
} else {
    docker start edumatch-postgres 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[DATABASE] PostgreSQL started successfully" -ForegroundColor Green
    } else {
        Write-Host "[DATABASE] Creating new PostgreSQL container..." -ForegroundColor Yellow
        docker run --name edumatch-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=edumatch -p 5432:5432 -d postgres:15
    }
}

# Function to check and install dependencies
function Install-Dependencies {
    param([string]$ServicePath, [string]$ServiceName)
    
    if (-not (Test-Path "$ServicePath\node_modules")) {
        Write-Host "[$ServiceName] Installing dependencies..." -ForegroundColor Yellow
        $currentDir = Get-Location
        Set-Location $ServicePath
        npm install --silent
        Set-Location $currentDir
        Write-Host "[$ServiceName] Dependencies installed" -ForegroundColor Green
    }
}

Start-Sleep 5

Write-Host ""
Write-Host "STEP 2: Installing Dependencies..." -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

Install-Dependencies -ServicePath "$BasePath\api-gateway" -ServiceName "API-GATEWAY"
Install-Dependencies -ServicePath "$BasePath\microservices\api-gateway" -ServiceName "MICROSERVICES-API-GATEWAY"
Install-Dependencies -ServicePath "$BasePath\microservices\auth-service" -ServiceName "AUTH-SERVICE"
Install-Dependencies -ServicePath "$BasePath\microservices\user-service" -ServiceName "USER-SERVICE"
Install-Dependencies -ServicePath "$BasePath\microservices\scholarship-service" -ServiceName "SCHOLARSHIP-SERVICE"
Install-Dependencies -ServicePath "$BasePath\frontend" -ServiceName "FRONTEND"

Write-Host ""
Write-Host "STEP 3: Starting Microservices..." -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

# Start API Gateway
Start-Service -ServiceName "API-GATEWAY" -ServicePath "$BasePath\microservices\api-gateway" -Port 3000 -Description "Central routing hub"

# Start Auth Service  
Start-Service -ServiceName "AUTH-SERVICE" -ServicePath "$BasePath\microservices\auth-service" -Port 3002 -Description "Authentication & authorization"

Start-Sleep 5

Write-Host ""
Write-Host "STEP 4: Starting Frontend..." -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

# Start Frontend
Write-Host "[FRONTEND] Starting Next.js frontend..." -ForegroundColor Cyan
$frontendCmd = "cd '$BasePath\frontend'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd -WindowStyle Normal

Start-Sleep 3

Write-Host ""
Write-Host "SUCCESS: EDUMATCH MICROSERVICES SYSTEM STARTED!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

Write-Host "APPLICATION URLs:" -ForegroundColor White
Write-Host "  - Frontend Application: http://localhost:3001" -ForegroundColor Gray
Write-Host "  - API Gateway:          http://localhost:3000" -ForegroundColor Gray
Write-Host "  - Auth Service:         http://localhost:3002" -ForegroundColor Gray
Write-Host ""

Write-Host "API Documentation:" -ForegroundColor White  
Write-Host "  - Gateway API Docs: http://localhost:3000/api/docs" -ForegroundColor Gray
Write-Host "  - Auth API Docs:    http://localhost:3002/api/docs" -ForegroundColor Gray
Write-Host "  - Gateway Health:   http://localhost:3000/api/health" -ForegroundColor Gray
Write-Host "  - Auth Health:      http://localhost:3002/api/health" -ForegroundColor Gray
Write-Host ""

Write-Host "REQUEST FLOW:" -ForegroundColor White
Write-Host "  Frontend (3001) -> API Gateway (3000) -> Auth Service (3002) -> Database" -ForegroundColor Gray
Write-Host ""

Write-Host "SYSTEM ARCHITECTURE: 100% MICROSERVICES" -ForegroundColor Green
Write-Host "  - No monolith backend used" -ForegroundColor Gray
Write-Host "  - All requests go through API Gateway" -ForegroundColor Gray
Write-Host "  - Distributed services architecture" -ForegroundColor Gray
Write-Host ""

Write-Host "WAIT: Wait 60 seconds for all services to fully start..." -ForegroundColor Yellow
Write-Host "Press any key to exit this script (services will continue running)..."

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")