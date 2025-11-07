#!/usr/bin/env pwsh
# Test Clean Script - Down -v → Up → Wait → Test
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CLEAN TEST (Fresh Database)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Down -v (xóa volumes)
Write-Host "[1/4] Stopping and removing containers/volumes..." -ForegroundColor Yellow
docker-compose -f docker-compose.test.yml down -v
Write-Host ""

# Step 2: Up -d
Write-Host "[2/4] Starting services..." -ForegroundColor Yellow
docker-compose -f docker-compose.test.yml up -d
Write-Host ""

# Step 3: Wait 90s
Write-Host "[3/4] Waiting 90 seconds for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 90
Write-Host ""

# Step 4: Run tests
Write-Host "[4/4] Running tests..." -ForegroundColor Yellow
.\run-tests.ps1
