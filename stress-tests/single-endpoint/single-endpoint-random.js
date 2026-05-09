import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';
import { handleSummary } from '../lib/summary.js';
export { handleSummary };

// Single-endpoint attack benchmark — random ramp — GET /api/patient
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
    random: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1s', target: 10 },
        { duration: '2s', target: 10 },
        { duration: '5s', target: 5 },
        { duration: '12s', target: 5 },
        { duration: '8s', target: 15 },
        { duration: '5s', target: 15 },
        { duration: '10s', target: 8 },
        { duration: '10s', target: 8 },
        { duration: '5s', target: 1 },
        { duration: '5s', target: 1 },
        { duration: '5s', target: 0 },
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
