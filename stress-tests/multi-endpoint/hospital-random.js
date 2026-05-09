import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { handleSummary } from '../lib/summary.js';
export { handleSummary };

// Mirrors JMeter: "random ramp - jp@gc - Ultimate Thread Group"
// Five overlapping waves with irregular VU counts and hold times — simulates
// unpredictable real-world traffic that doesn't follow a clean ramp pattern.
//
// Wave 1: 10 VUs,  ramp 1s,  hold  1s
// Wave 2:  5 VUs,  ramp 12s, hold 12s
// Wave 3:  8 VUs,  ramp 30s, hold 10s
// Wave 4: 15 VUs,  ramp 30s, hold  3s
// Wave 5:  1 VU,   ramp  5s, hold  5s

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
    random: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1s', target: 10 }, // wave 1 ramp
        { duration: '2s', target: 10 }, // brief hold
        { duration: '5s', target: 5 }, // drop to wave 2
        { duration: '12s', target: 5 }, // wave 2 hold
        { duration: '8s', target: 15 }, // spike to wave 4 level
        { duration: '5s', target: 15 }, // hold
        { duration: '10s', target: 8 }, // settle to wave 3 level
        { duration: '10s', target: 8 }, // wave 3 hold
        { duration: '5s', target: 1 }, // trail off (wave 5)
        { duration: '5s', target: 1 }, // wave 5 hold
        { duration: '5s', target: 0 }, // done
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
