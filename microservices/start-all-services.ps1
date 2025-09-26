# EduMatch Microservices Startup Script
# This script starts all EduMatch microservices in order

Write-Host "Starting EduMatch Microservices..." -ForegroundColor Green

# Function to start a service in a new window
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [int]$Port
    )
    
    Write-Host "Starting $ServiceName on port $Port..." -ForegroundColor Yellow
    
    $cmd = "cd '$ServicePath'; npm run start:dev"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd -WindowStyle Normal
    
    Start-Sleep 3  # Wait 3 seconds before starting next service
}

# Base path
$BasePath = "d:\Coding\XDPM OOP\microservices"

# Start services in order
Write-Host "[AUTH] Starting Auth Service..." -ForegroundColor Cyan
Start-Service -ServiceName "Auth Service" -ServicePath "$BasePath\auth-service" -Port 3002

Write-Host "[USER] Starting User Service..." -ForegroundColor Cyan  
Start-Service -ServiceName "User Service" -ServicePath "$BasePath\user-service" -Port 3003

Write-Host "[SCHOLARSHIP] Starting Scholarship Service..." -ForegroundColor Cyan
Start-Service -ServiceName "Scholarship Service" -ServicePath "$BasePath\scholarship-service" -Port 3004

Write-Host "[APPLICATION] Starting Application Service..." -ForegroundColor Cyan
Start-Service -ServiceName "Application Service" -ServicePath "$BasePath\application-service" -Port 3005

Write-Host "[MATCHING] Starting Matching Service..." -ForegroundColor Cyan
Start-Service -ServiceName "Matching Service" -ServicePath "$BasePath\matching-service" -Port 3006

Write-Host "[NOTIFICATION] Starting Notification Service..." -ForegroundColor Cyan
Start-Service -ServiceName "Notification Service" -ServicePath "$BasePath\notification-service" -Port 3007

Write-Host "[GATEWAY] Starting API Gateway..." -ForegroundColor Cyan
Start-Service -ServiceName "API Gateway" -ServicePath "$BasePath\api-gateway" -Port 3000

Write-Host ""
Write-Host "SUCCESS: All microservices are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor White
Write-Host "  - API Gateway:         http://localhost:3000" -ForegroundColor Gray
Write-Host "  - Auth Service:        http://localhost:3002" -ForegroundColor Gray
Write-Host "  - User Service:        http://localhost:3003" -ForegroundColor Gray
Write-Host "  - Scholarship Service: http://localhost:3004" -ForegroundColor Gray
Write-Host "  - Application Service: http://localhost:3005" -ForegroundColor Gray
Write-Host "  - Matching Service:    http://localhost:3006" -ForegroundColor Gray
Write-Host "  - Notification Service: http://localhost:3007" -ForegroundColor Gray
Write-Host ""
Write-Host "API Documentation:" -ForegroundColor White
Write-Host "  - API Gateway Docs: http://localhost:3000/api/docs" -ForegroundColor Gray
Write-Host "  - Health Check:     http://localhost:3000/api/health" -ForegroundColor Gray
Write-Host ""
Write-Host "WAIT: Please wait 30-60 seconds for all services to start up completely." -ForegroundColor Yellow
Write-Host "Press any key to exit..."

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")