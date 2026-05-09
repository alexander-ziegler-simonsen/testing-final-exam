import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { handleSummary } from '../lib/summary.js';
export { handleSummary };

// Mirrors JMeter: "expan - jp@gc - Ultimate Thread Group"
// Six waves that each add more VUs than the last — all waves converge at ~6s,
// creating a sudden tsunami peak. Designed to find the breaking point.
//
// Wave 1:  10 VUs at t=0s  → ramp 1s, hold 5s
// Wave 2:  20 VUs at t=1s  → ramp 1s, hold 4s   (total:  30)
// Wave 3:  40 VUs at t=2s  → ramp 1s, hold 3s   (total:  70)
// Wave 4:  80 VUs at t=3s  → ramp 1s, hold 2s   (total: 150)
// Wave 5: 120 VUs at t=4s  → ramp 1s, hold 1s   (total: 270)
// Wave 6: 240 VUs at t=5s  → ramp 1s, hold 0s   (total: 510 at peak ~t=6s)

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
    expanding: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1s', target: 10 }, // wave 1 arrives
        { duration: '1s', target: 30 }, // wave 2 arrives (+20)
        { duration: '1s', target: 70 }, // wave 3 arrives (+40)
        { duration: '1s', target: 150 }, // wave 4 arrives (+80)
        { duration: '1s', target: 270 }, // wave 5 arrives (+120)
        { duration: '1s', target: 510 }, // wave 6 arrives (+240) — tsunami peak
        { duration: '10s', target: 510 }, // hold at peak
        { duration: '10s', target: 0 }, // ramp down
      ],
      gracefulRampDown: '10s',
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
