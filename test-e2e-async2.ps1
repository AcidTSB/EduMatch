# E2E-ASYNC Test - Auth Service Signup → RabbitMQ → Matching Service
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "E2E-ASYNC Test: User Signup Flow" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$AUTH_URL = "http://localhost:8081/api/auth"
$MATCHING_DB_CONTAINER = "matching-db-test"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$TEST_USERNAME = "e2e_async_$TIMESTAMP"
$TEST_EMAIL = "e2e_async_${TIMESTAMP}@test.com"

# Step 1: Check DB before
Write-Host "[1/4] Checking matching-db before signup..." -ForegroundColor Yellow
$BEFORE_COUNT = docker exec $MATCHING_DB_CONTAINER psql -U matching_user -d matching_db -t -c "SELECT COUNT(*) FROM applicant_features"
$BEFORE_COUNT = $BEFORE_COUNT.Trim()
Write-Host "  Current count: $BEFORE_COUNT" -ForegroundColor Gray
Write-Host ""

# Step 2: Signup user
Write-Host "[2/4] Registering user: $TEST_USERNAME" -ForegroundColor Yellow
$SIGNUP_BODY = @{
    username = $TEST_USERNAME
    email = $TEST_EMAIL
    password = "Test123456"
    firstName = "E2E"
    lastName = "AsyncTest"
} | ConvertTo-Json

$SIGNUP_RESPONSE = Invoke-RestMethod -Uri "$AUTH_URL/signup" -Method Post -Body $SIGNUP_BODY -ContentType "application/json"
Write-Host "  ✓ Signup successful!" -ForegroundColor Green
Write-Host ""

# Step 3: Wait for event processing
Write-Host "[3/4] Waiting 15 seconds for event processing..." -ForegroundColor Yellow
Start-Sleep -Seconds 15
Write-Host ""

# Step 4: Check DB after
Write-Host "[4/4] Checking matching-db after event processing..." -ForegroundColor Yellow
$AFTER_COUNT = docker exec $MATCHING_DB_CONTAINER psql -U matching_user -d matching_db -t -c "SELECT COUNT(*) FROM applicant_features"
$AFTER_COUNT = $AFTER_COUNT.Trim()
$NEW_RECORD = docker exec $MATCHING_DB_CONTAINER psql -U matching_user -d matching_db -t -c "SELECT applicant_id, email FROM applicant_features WHERE email = '$TEST_EMAIL'"
$NEW_RECORD = $NEW_RECORD.Trim()

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESULT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($NEW_RECORD) {
    Write-Host "PASSED - E2E-ASYNC Test" -ForegroundColor Green
    Write-Host "  Before: $BEFORE_COUNT, After: $AFTER_COUNT" -ForegroundColor Gray
    Write-Host "  New record: $NEW_RECORD" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Event flow: Auth -> RabbitMQ -> Consumer -> Celery -> PostgreSQL" -ForegroundColor Green
}
else {
    Write-Host "Failed - No record found" -ForegroundColor Red
    Write-Host "Email: $TEST_EMAIL" -ForegroundColor Yellow
    docker logs matching-consumer-test --tail 20
    docker logs celery-worker-test --tail 20
}
