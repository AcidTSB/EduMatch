# API Gateway Test Script
# Run this after starting all services with docker-compose up

Write-Host "=== EduMatch API Gateway Test Suite ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost"
$token = $null

# Helper function to make requests
function Invoke-ApiTest {
    param(
        [string]$Name,
        [string]$Method = "GET",
        [string]$Endpoint,
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "  $Method $Endpoint" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = "$baseUrl$Endpoint"
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "  ✓ Success" -ForegroundColor Green
        return $response
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "  ✗ Failed: $statusCode" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "    $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
        return $null
    }
    finally {
        Write-Host ""
    }
}

# Test 1: Gateway Health
Write-Host "[1/10] Gateway Health Check" -ForegroundColor Cyan
$health = Invoke-ApiTest -Name "Gateway Health" -Endpoint "/health"

# Test 2: Frontend
Write-Host "[2/10] Frontend Access" -ForegroundColor Cyan
try {
    $frontendResponse = Invoke-WebRequest -Uri "$baseUrl/" -Method GET
    Write-Host "Testing: Frontend" -ForegroundColor Yellow
    Write-Host "  GET /" -ForegroundColor Gray
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "  ✓ Success (Status: 200)" -ForegroundColor Green
    }
    Write-Host ""
}
catch {
    Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 3: User Registration
Write-Host "[3/10] User Service - Register" -ForegroundColor Cyan
$registerBody = @{
    email = "test@example.com"
    password = "password123"
    name = "Test User"
    role = "STUDENT"
} | ConvertTo-Json

$registerResponse = Invoke-ApiTest `
    -Name "Register User" `
    -Method "POST" `
    -Endpoint "/api/auth/register" `
    -Body $registerBody

# Test 4: User Login
Write-Host "[4/10] User Service - Login" -ForegroundColor Cyan
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-ApiTest `
    -Name "Login User" `
    -Method "POST" `
    -Endpoint "/api/auth/login" `
    -Body $loginBody

if ($loginResponse -and $loginResponse.token) {
    $token = $loginResponse.token
    Write-Host "JWT Token received: $($token.Substring(0, 20))..." -ForegroundColor Green
    Write-Host ""
}

# Test 5: Get User Profile (requires auth)
if ($token) {
    Write-Host "[5/10] User Service - Get Profile" -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $profileResponse = Invoke-ApiTest `
        -Name "Get User Profile" `
        -Method "GET" `
        -Endpoint "/api/users/me" `
        -Headers $headers
}
else {
    Write-Host "[5/10] Skipping (no token)" -ForegroundColor Gray
    Write-Host ""
}

# Test 6: Matching Service - Score
if ($token) {
    Write-Host "[6/10] Matching Service - Score" -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $matchBody = @{
        applicant_id = 1
        opportunity_id = 1
    } | ConvertTo-Json
    
    $matchResponse = Invoke-ApiTest `
        -Name "Calculate Match Score" `
        -Method "POST" `
        -Endpoint "/api/v1/match/score" `
        -Headers $headers `
        -Body $matchBody
}
else {
    Write-Host "[6/10] Skipping (no token)" -ForegroundColor Gray
    Write-Host ""
}

# Test 7: Matching Service - Recommendations
if ($token) {
    Write-Host "[7/10] Matching Service - Recommendations" -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $recoResponse = Invoke-ApiTest `
        -Name "Get Recommendations" `
        -Method "GET" `
        -Endpoint "/api/v1/recommendations/applicant/1?top_n=5" `
        -Headers $headers
}
else {
    Write-Host "[7/10] Skipping (no token)" -ForegroundColor Gray
    Write-Host ""
}

# Test 8: Scholarship Service
if ($token) {
    Write-Host "[8/10] Scholarship Service - List" -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $scholarshipResponse = Invoke-ApiTest `
        -Name "List Scholarships" `
        -Method "GET" `
        -Endpoint "/api/scholarships" `
        -Headers $headers
}
else {
    Write-Host "[8/10] Skipping (no token)" -ForegroundColor Gray
    Write-Host ""
}

# Test 9: Chat Service
if ($token) {
    Write-Host "[9/10] Chat Service - Conversations" -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $chatResponse = Invoke-ApiTest `
        -Name "Get Conversations" `
        -Method "GET" `
        -Endpoint "/api/conversations" `
        -Headers $headers
}
else {
    Write-Host "[9/10] Skipping (no token)" -ForegroundColor Gray
    Write-Host ""
}

# Test 10: Rate Limiting
Write-Host "[10/10] Rate Limiting Test" -ForegroundColor Cyan
Write-Host "Testing: Auth Rate Limit (5 req/min)" -ForegroundColor Yellow
Write-Host "  Sending 6 rapid requests..." -ForegroundColor Gray

$rateLimitHit = $false
for ($i = 1; $i -le 6; $i++) {
    try {
        $response = Invoke-RestMethod `
            -Uri "$baseUrl/api/auth/login" `
            -Method POST `
            -Body $loginBody `
            -ContentType "application/json" `
            -ErrorAction Stop
        Write-Host "  Request $i : 200 OK" -ForegroundColor Gray
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 429) {
            Write-Host "  Request $i : 429 Too Many Requests" -ForegroundColor Yellow
            $rateLimitHit = $true
        }
        else {
            Write-Host "  Request $i : $statusCode" -ForegroundColor Gray
        }
    }
    Start-Sleep -Milliseconds 200
}

if ($rateLimitHit) {
    Write-Host "  ✓ Rate limiting working correctly" -ForegroundColor Green
}
else {
    Write-Host "  ⚠ Rate limiting not triggered (may need more requests)" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "=== Test Summary ===" -ForegroundColor Cyan
Write-Host "Gateway URL: $baseUrl" -ForegroundColor Gray
Write-Host "Frontend: http://localhost/" -ForegroundColor Gray
Write-Host "RabbitMQ UI: http://localhost:15672 (guest/guest)" -ForegroundColor Gray
Write-Host ""
Write-Host "View logs:" -ForegroundColor Gray
Write-Host "  docker logs api-gateway -f" -ForegroundColor Gray
Write-Host "  docker logs matching-service -f" -ForegroundColor Gray
Write-Host "  docker logs user-service -f" -ForegroundColor Gray
Write-Host ""
Write-Host "Stop services:" -ForegroundColor Gray
Write-Host "  docker-compose down" -ForegroundColor Gray
Write-Host ""

if ($token) {
    Write-Host "Your JWT Token:" -ForegroundColor Cyan
    Write-Host $token -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Use it in future requests:" -ForegroundColor Gray
    Write-Host 'curl -H "Authorization: Bearer $token" http://localhost/api/users/me' -ForegroundColor Gray
}
