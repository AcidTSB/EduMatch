import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const authDuration = new Trend('auth_duration');
const scholarshipDuration = new Trend('scholarship_duration');
const applicationDuration = new Trend('application_duration');
const requestCount = new Counter('request_count');

// Environment variables
const TARGET_URL = __ENV.TARGET_URL || 'http://localhost:8081';
const DURATION = __ENV.DURATION || '5m';
const VUS = parseInt(__ENV.VUS) || 50;
const SCENARIO = __ENV.SCENARIO || 'load-test';

// Test scenarios configuration
const scenarios = {
  'smoke-test': {
    executor: 'constant-vus',
    vus: 1,
    duration: '1m',
  },
  'load-test': {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: VUS },
      { duration: DURATION, target: VUS },
      { duration: '2m', target: 0 },
    ],
  },
  'stress-test': {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: VUS },
      { duration: '5m', target: VUS * 2 },
      { duration: '5m', target: VUS * 3 },
      { duration: '2m', target: 0 },
    ],
  },
  'spike-test': {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: VUS },
      { duration: '30s', target: VUS * 5 },
      { duration: '1m', target: VUS },
      { duration: '30s', target: 0 },
    ],
  },
  'soak-test': {
    executor: 'constant-vus',
    vus: VUS,
    duration: '1h',
  },
};

// Export options
export const options = {
  scenarios: {
    [SCENARIO]: scenarios[SCENARIO],
  },
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<3000'], // 95% < 2s, 99% < 3s
    http_req_failed: ['rate<0.01'], // Error rate < 1%
    errors: ['rate<0.01'],
  },
};

// Test data
let authToken = null;
const testUser = {
  email: `loadtest_${Date.now()}@example.com`,
  password: 'LoadTest123!',
  fullName: 'Load Test User',
  role: 'STUDENT',
};

// ============================================================
// Setup function - runs once per VU
// ============================================================
export function setup() {
  console.log(`Starting ${SCENARIO} with ${VUS} VUs for ${DURATION}`);
  return { targetUrl: TARGET_URL };
}

// ============================================================
// Main test function
// ============================================================
export default function (data) {
  const baseUrl = data.targetUrl;

  // Scenario 1: Register new user
  registerUser(baseUrl);

  // Scenario 2: Login
  loginUser(baseUrl);

  // Scenario 3: Browse scholarships
  browseScholarships(baseUrl);

  // Scenario 4: Search scholarships
  searchScholarships(baseUrl);

  // Scenario 5: Get scholarship details
  if (authToken) {
    getScholarshipDetails(baseUrl);
  }

  // Scenario 6: Submit application
  if (authToken) {
    submitApplication(baseUrl);
  }

  // Scenario 7: Check notifications
  if (authToken) {
    checkNotifications(baseUrl);
  }

  // Think time between iterations
  sleep(Math.random() * 3 + 1); // 1-4 seconds
}

// ============================================================
// Test Scenarios
// ============================================================

function registerUser(baseUrl) {
  const url = `${baseUrl}/api/auth/register`;
  const payload = JSON.stringify({
    email: `user_${Date.now()}_${Math.random()}@test.com`,
    password: 'Test123!',
    fullName: 'Test User',
    role: 'STUDENT',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'Register' },
  };

  const startTime = Date.now();
  const res = http.post(url, payload, params);
  authDuration.add(Date.now() - startTime);
  requestCount.add(1);

  const success = check(res, {
    'register status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'register response has token or user': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.token || body.user || body.id;
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!success);

  if (success && res.json('token')) {
    authToken = res.json('token');
  }
}

function loginUser(baseUrl) {
  const url = `${baseUrl}/api/auth/login`;
  const payload = JSON.stringify({
    email: testUser.email,
    password: testUser.password,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'Login' },
  };

  const startTime = Date.now();
  const res = http.post(url, payload, params);
  authDuration.add(Date.now() - startTime);
  requestCount.add(1);

  const success = check(res, {
    'login status is 200': (r) => r.status === 200 || r.status === 201,
    'login response has token': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.token || body.accessToken;
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!success);

  if (success) {
    try {
      const body = res.json();
      authToken = body.token || body.accessToken;
    } catch (e) {
      console.error('Failed to parse login response:', e);
    }
  }
}

function browseScholarships(baseUrl) {
  // Change URL to scholarship service port
  const scholarshipUrl = baseUrl.replace(':8081', ':8082');
  const url = `${scholarshipUrl}/api/scholarships?page=0&size=20`;

  const params = {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    tags: { name: 'BrowseScholarships' },
  };

  const startTime = Date.now();
  const res = http.get(url, params);
  scholarshipDuration.add(Date.now() - startTime);
  requestCount.add(1);

  const success = check(res, {
    'browse status is 200': (r) => r.status === 200,
    'browse response has content': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.content || Array.isArray(body);
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!success);
}

function searchScholarships(baseUrl) {
  const scholarshipUrl = baseUrl.replace(':8081', ':8082');
  const keywords = ['engineering', 'computer science', 'AI', 'scholarship', 'research'];
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  const url = `${scholarshipUrl}/api/scholarships/search?keyword=${keyword}`;

  const params = {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    tags: { name: 'SearchScholarships' },
  };

  const startTime = Date.now();
  const res = http.get(url, params);
  scholarshipDuration.add(Date.now() - startTime);
  requestCount.add(1);

  const success = check(res, {
    'search status is 200': (r) => r.status === 200,
    'search response is array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body) || body.content;
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!success);
}

function getScholarshipDetails(baseUrl) {
  const scholarshipUrl = baseUrl.replace(':8081', ':8082');
  const scholarshipId = Math.floor(Math.random() * 100) + 1;
  const url = `${scholarshipUrl}/api/scholarships/${scholarshipId}`;

  const params = {
    headers: { Authorization: `Bearer ${authToken}` },
    tags: { name: 'GetScholarshipDetails' },
  };

  const startTime = Date.now();
  const res = http.get(url, params);
  scholarshipDuration.add(Date.now() - startTime);
  requestCount.add(1);

  const success = check(res, {
    'details status is 200 or 404': (r) => r.status === 200 || r.status === 404,
  });

  errorRate.add(!success);
}

function submitApplication(baseUrl) {
  const scholarshipUrl = baseUrl.replace(':8081', ':8082');
  const scholarshipId = Math.floor(Math.random() * 100) + 1;
  const url = `${scholarshipUrl}/api/applications`;

  const payload = JSON.stringify({
    opportunityId: scholarshipId,
    coverLetter: 'This is a load test application',
    resumeUrl: 'https://example.com/resume.pdf',
  });

  const params = {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    tags: { name: 'SubmitApplication' },
  };

  const startTime = Date.now();
  const res = http.post(url, payload, params);
  applicationDuration.add(Date.now() - startTime);
  requestCount.add(1);

  const success = check(res, {
    'application status is 200/201/400/409': (r) =>
      r.status === 200 || r.status === 201 || r.status === 400 || r.status === 409,
  });

  errorRate.add(!success);
}

function checkNotifications(baseUrl) {
  const chatUrl = baseUrl.replace(':8081', ':8084');
  const url = `${chatUrl}/api/notifications`;

  const params = {
    headers: { Authorization: `Bearer ${authToken}` },
    tags: { name: 'CheckNotifications' },
  };

  const startTime = Date.now();
  const res = http.get(url, params);
  requestCount.add(1);

  const success = check(res, {
    'notifications status is 200': (r) => r.status === 200,
  });

  errorRate.add(!success);
}

// ============================================================
// Teardown function
// ============================================================
export function teardown(data) {
  console.log('Load test completed');
}
