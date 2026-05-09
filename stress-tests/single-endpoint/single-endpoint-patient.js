import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';
import { handleSummary } from '../lib/summary.js';
export { handleSummary };

// Single-endpoint attack benchmark — GET /api/patient
// All VUs hammer the same endpoint with no sleep, simulating a focused DoS.
// Uses the same tsunami ramp as hospital-expanding-no-sleep.js so results
// are directly comparable.

const BASE = 'http://localhost:5028/api';

const errorRate = new Rate('error_rate');

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
        { duration: '1s', target: 10 },
        { duration: '1s', target: 30 },
        { duration: '1s', target: 70 },
        { duration: '1s', target: 150 },
        { duration: '1s', target: 270 },
        { duration: '1s', target: 510 },
        { duration: '10s', target: 510 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
};

export default function () {
  const res = http.get(`${BASE}/patient`, { tags: { name: 'GET /patient' } });
  check(res, { '200 ok': (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
}
