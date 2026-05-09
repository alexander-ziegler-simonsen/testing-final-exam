import http from 'k6/http';
import { check } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { handleSummary } from '../lib/summary.js';
export { handleSummary };

// No-sleep version — threads loop immediately after each response.
// Mirrors JMeter default behavior (no Timer element configured).

const BASE = 'http://localhost:5028/api';

const errorRate = new Rate('error_rate');
const loginDuration = new Trend('login_duration', true);

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    error_rate: ['rate<0.01'],
  },
  scenarios: {
    linear: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 100 },
        { duration: '30s', target: 100 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '5s',
    },
  },
};

const HEADERS = { 'Content-Type': 'application/json' };

export default function () {
  const patients = http.get(`${BASE}/patient`, { tags: { name: 'GET /patient' } });
  check(patients, { 'patients 200': (r) => r.status === 200 });
  errorRate.add(patients.status !== 200);

  const shifts = http.get(`${BASE}/shift`, { tags: { name: 'GET /shift' } });
  check(shifts, { 'shifts 200': (r) => r.status === 200 });
  errorRate.add(shifts.status !== 200);

  const departments = http.get(`${BASE}/department`, { tags: { name: 'GET /department' } });
  check(departments, { 'departments 200': (r) => r.status === 200 });
  errorRate.add(departments.status !== 200);

  const loginStart = Date.now();
  const login = http.post(
    `${BASE}/auth/login`,
    JSON.stringify({ username: 'loadtest', password: 'wrongpassword' }),
    { headers: HEADERS, tags: { name: 'POST /auth/login' }, responseCallback: http.expectedStatuses(400, 401) }
  );
  loginDuration.add(Date.now() - loginStart);
  check(login, { 'login 400/401': (r) => r.status === 400 || r.status === 401 });
}
