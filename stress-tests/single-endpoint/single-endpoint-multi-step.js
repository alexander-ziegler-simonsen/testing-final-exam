import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';
import { handleSummary } from '../lib/summary.js';
export { handleSummary };

// Single-endpoint attack benchmark — multi-step ramp — GET /api/patient
// All VUs hammer one endpoint with no sleep.

const BASE = 'http://localhost:5028/api';
const errorRate = new Rate('error_rate');

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
        { duration: '30s', target: 25 },
        { duration: '30s', target: 25 },
        { duration: '20s', target: 50 },
        { duration: '30s', target: 50 },
        { duration: '30s', target: 100 },
        { duration: '60s', target: 100 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '5s',
    },
  },
};

export default function () {
  const res = http.get(`${BASE}/patient`, { tags: { name: 'GET /patient' } });
  check(res, { '200 ok': (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
}
