#!/usr/bin/env pwsh
# E2E-ASYNC Test - Auth Service Signup → RabbitMQ → Matching Service
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "E2E-ASYNC Test: User Signup Flow" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test Config
$AUTH_URL = "http://localhost:8081/api/auth"
$MATCHING_DB_CONTAINER = "matching-db-test"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$TEST_USERNAME = "e2e_async_$TIMESTAMP"
$TEST_EMAIL = "e2e_async_${TIMESTAMP}@test.com"

# Step 1: Kiểm tra database trước khi test
Write-Host "[1/4] Checking matching-db before signup..." -ForegroundColor Yellow
$BEFORE_COUNT = docker exec $MATCHING_DB_CONTAINER psql -U matching_user -d matching_db -t -c "SELECT COUNT(*) FROM applicant_features"
$BEFORE_COUNT = $BEFORE_COUNT.Trim()
Write-Host "  Current applicant_features count: $BEFORE_COUNT" -ForegroundColor Gray
Write-Host ""

# Step 2: Đăng ký user mới qua Auth Service
Write-Host "[2/4] Registering new user via Auth Service..." -ForegroundColor Yellow
Write-Host "  Username: $TEST_USERNAME" -ForegroundColor Gray
Write-Host "  Email: $TEST_EMAIL" -ForegroundColor Gray

$SIGNUP_BODY = @{
    username = $TEST_USERNAME
    email = $TEST_EMAIL
    password = "Test123456"
    firstName = "E2E"
    lastName = "AsyncTest"
} | ConvertTo-Json

$SIGNUP_RESPONSE = $null
try {
    $SIGNUP_RESPONSE = Invoke-RestMethod -Uri "$AUTH_URL/signup" -Method Post -Body $SIGNUP_BODY -ContentType "application/json" -ErrorAction Stop
    Write-Host "  ✓ Signup successful!" -ForegroundColor Green
    Write-Host "  Response: $($SIGNUP_RESPONSE | ConvertTo-Json -Compress)" -ForegroundColor Gray
}
catch {
    Write-Host "  ✗ Signup failed!" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Đợi event được xử lý
Write-Host "[3/4] Waiting 15 seconds for async event processing..." -ForegroundColor Yellow
Write-Host "  (Auth Service → RabbitMQ → Consumer → Celery Worker → PostgreSQL)" -ForegroundColor Gray
Start-Sleep -Seconds 15
Write-Host ""

# Step 4: Kiểm tra database sau khi event xử lý
Write-Host "[4/4] Checking matching-db after event processing..." -ForegroundColor Yellow
$AFTER_COUNT = docker exec $MATCHING_DB_CONTAINER psql -U matching_user -d matching_db -t -c "SELECT COUNT(*) FROM applicant_features"
$AFTER_COUNT = $AFTER_COUNT.Trim()
Write-Host "  Current applicant_features count: $AFTER_COUNT" -ForegroundColor Gray

# Kiểm tra có record mới với email test
$NEW_RECORD = docker exec $MATCHING_DB_CONTAINER psql -U matching_user -d matching_db -t -c "SELECT applicant_id, email FROM applicant_features WHERE email = '$TEST_EMAIL'"
$NEW_RECORD = $NEW_RECORD.Trim()

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESULT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($NEW_RECORD) {
    Write-Host "✓ E2E-ASYNC Test PASSED!" -ForegroundColor Green
    Write-Host "  Before count: $BEFORE_COUNT" -ForegroundColor Gray
    Write-Host "  After count: $AFTER_COUNT" -ForegroundColor Gray
    Write-Host "  New record: $NEW_RECORD" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Event flow verified:" -ForegroundColor Green
    Write-Host "  1. Auth Service published user.profile.updated event" -ForegroundColor Gray
    Write-Host "  2. RabbitMQ routed event to matching-consumer" -ForegroundColor Gray
    Write-Host "  3. Consumer dispatched to Celery worker" -ForegroundColor Gray
    Write-Host "  4. Worker saved data to matching-db PostgreSQL" -ForegroundColor Gray
} else {
    Write-Host "✗ E2E-ASYNC Test FAILED!" -ForegroundColor Red
    Write-Host "  Before count: $BEFORE_COUNT" -ForegroundColor Gray
    Write-Host "  After count: $AFTER_COUNT" -ForegroundColor Gray
    Write-Host "  No record found for email: $TEST_EMAIL" -ForegroundColor Red
    Write-Host ""
    Write-Host "Checking RabbitMQ queues..." -ForegroundColor Yellow
    docker exec rabbitmq-test rabbitmqctl list_queues name messages consumers
    
    Write-Host ""
    Write-Host "Checking consumer logs..." -ForegroundColor Yellow
    docker logs matching-consumer-test --tail 20
    
    Write-Host ""
    Write-Host "Checking celery-worker logs..." -ForegroundColor Yellow
    docker logs celery-worker-test --tail 20
    
    exit 1
}
