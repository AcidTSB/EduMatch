import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseDuration = new Trend('response_duration');

// Environment variables
const TARGET_URL = __ENV.TARGET_URL || 'http://localhost:8081';
const ENDPOINT = __ENV.ENDPOINT || '/api/health';
const SERVICE_NAME = __ENV.SERVICE_NAME || 'unknown-service';

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '2m', target: 50 },   // Stay at 50 users
    { duration: '30s', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% < 500ms, 99% < 1s
    http_req_failed: ['rate<0.01'], // Error rate < 1%
    errors: ['rate<0.01'],
  },
};

export function setup() {
  console.log(`Testing ${SERVICE_NAME} at ${TARGET_URL}${ENDPOINT}`);
  return { url: `${TARGET_URL}${ENDPOINT}` };
}

export default function (data) {
  const params = {
    headers: { 'Content-Type': 'application/json' },
    tags: { service: SERVICE_NAME },
  };

  const startTime = Date.now();
  const res = http.get(data.url, params);
  responseDuration.add(Date.now() - startTime);

  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!success);

  sleep(0.5); // 500ms think time
}

export function teardown(data) {
  console.log(`Load test for ${SERVICE_NAME} completed`);
}
