import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { handleSummary } from '../lib/summary.js';
export { handleSummary };

// Mirrors JMeter: "multi step ramp - jp@gc - Ultimate Thread Group"
// Three waves stepping up VU count — each wave ramps, holds, then the next takes over.
//
// Wave 1:  0s → ramp to  25 over 30s → hold 30s (done at  60s)
// Wave 2: 60s → ramp to  50 over 20s → hold 30s (done at 110s)
// Wave 3:110s → ramp to 100 over 30s → hold 60s (done at 200s)

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
    multi_step: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 25 }, // wave 1 ramp
        { duration: '30s', target: 25 }, // wave 1 hold
        { duration: '20s', target: 50 }, // wave 2 ramp
        { duration: '30s', target: 50 }, // wave 2 hold
        { duration: '30s', target: 100 }, // wave 3 ramp
        { duration: '60s', target: 100 }, // wave 3 hold
        { duration: '10s', target: 0 }, // ramp down
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
  sleep(0.5);

  const shifts = http.get(`${BASE}/shift`, { tags: { name: 'GET /shift' } });
  check(shifts, { 'shifts 200': (r) => r.status === 200 });
  errorRate.add(shifts.status !== 200);
  sleep(0.5);

  const departments = http.get(`${BASE}/department`, { tags: { name: 'GET /department' } });
  check(departments, { 'departments 200': (r) => r.status === 200 });
  errorRate.add(departments.status !== 200);
  sleep(0.5);

  const loginStart = Date.now();
  const login = http.post(
    `${BASE}/auth/login`,
    JSON.stringify({ username: 'loadtest', password: 'wrongpassword' }),
    { headers: HEADERS, tags: { name: 'POST /auth/login' }, responseCallback: http.expectedStatuses(400, 401) }
  );
  loginDuration.add(Date.now() - loginStart);
  check(login, { 'login 400/401': (r) => r.status === 400 || r.status === 401 });
  sleep(1);
}
