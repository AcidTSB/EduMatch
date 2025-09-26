# EduMatch Quick Start - Working Services Only
# This script starts only the services that are properly configured

Write-Host "Starting EduMatch Core Services..." -ForegroundColor Green

# Base path
$BasePath = "d:\Coding\XDPM OOP\microservices"

# Start working services
Write-Host "[AUTH] Starting Auth Service..." -ForegroundColor Cyan
$authCmd = "cd '$BasePath\auth-service'; npm run start:dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $authCmd -WindowStyle Normal

Start-Sleep 5

Write-Host "[GATEWAY] Starting API Gateway..." -ForegroundColor Cyan
$gatewayCmd = "cd '$BasePath\api-gateway'; npm run start:dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $gatewayCmd -WindowStyle Normal

Write-Host ""
Write-Host "SUCCESS: Core services are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Working Services:" -ForegroundColor White
Write-Host "  - API Gateway:  http://localhost:3000" -ForegroundColor Gray
Write-Host "  - Auth Service: http://localhost:3002" -ForegroundColor Gray
Write-Host ""
Write-Host "API Documentation:" -ForegroundColor White
Write-Host "  - Gateway Docs: http://localhost:3000/api/docs" -ForegroundColor Gray
Write-Host "  - Health Check: http://localhost:3000/api/health" -ForegroundColor Gray
Write-Host ""
Write-Host "WAIT: Please wait 30 seconds for services to start completely." -ForegroundColor Yellow
Write-Host "Press any key to exit..."

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")