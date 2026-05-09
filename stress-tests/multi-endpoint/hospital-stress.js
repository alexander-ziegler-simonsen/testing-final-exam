import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { handleSummary } from '../lib/summary.js';
export { handleSummary };

const BASE = 'http://localhost:5028/api';

// Custom metrics
const errorRate = new Rate('error_rate');
const loginDuration = new Trend('login_duration', true);

// Pass/fail thresholds — the test suite fails if any are breached
export const options = {
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests finish under 500ms
    http_req_failed: ['rate<0.01'],  // less than 1% of requests fail
    error_rate: ['rate<0.01'],
  },

  scenarios: {
    // Scenario 1 — gradual load test (normal expected traffic)
    load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '15s', target: 10 }, // ramp up to 10 users
        { duration: '30s', target: 10 }, // hold at 10 users
        { duration: '10s', target: 0 }, // ramp down
      ],
      gracefulRampDown: '5s',
    },

    // Scenario 2 — stress test (push well beyond normal load)
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      startTime: '60s',               // starts after load_test finishes
      stages: [
        { duration: '10s', target: 50 }, // spike to 50 users
        { duration: '30s', target: 50 }, // hold under stress
        { duration: '10s', target: 100 }, // push to breaking point
        { duration: '10s', target: 0 }, // ramp down
      ],
      gracefulRampDown: '5s',
    },
  },
};

const HEADERS = { 'Content-Type': 'application/json' };

export default function () {
  // --- GET /api/patient ---
  const patients = http.get(`${BASE}/patient`, { tags: { name: 'GET /patient' } });
  check(patients, {
    'patients status 200': (r) => r.status === 200,
    'patients responded fast': (r) => r.timings.duration < 500,
  });
  errorRate.add(patients.status !== 200);

  sleep(0.5);

  // --- GET /api/shift ---
  const shifts = http.get(`${BASE}/shift`, { tags: { name: 'GET /shift' } });
  check(shifts, {
    'shifts status 200': (r) => r.status === 200,
  });
  errorRate.add(shifts.status !== 200);

  sleep(0.5);

  // --- GET /api/department ---
  const departments = http.get(`${BASE}/department`, { tags: { name: 'GET /department' } });
  check(departments, {
    'departments status 200': (r) => r.status === 200,
  });
  errorRate.add(departments.status !== 200);

  sleep(0.5);

  // --- POST /api/auth/login (intentionally wrong credentials — tests error path under load) ---
  const loginStart = Date.now();
  const login = http.post(
    `${BASE}/auth/login`,
    JSON.stringify({ username: 'loadtest', password: 'wrongpassword' }),
    { headers: HEADERS, tags: { name: 'POST /auth/login' }, responseCallback: http.expectedStatuses(400, 401) }
  );
  loginDuration.add(Date.now() - loginStart);
  check(login, {
    'login returns 400 or 401': (r) => r.status === 400 || r.status === 401,
  });

  sleep(1);
}
