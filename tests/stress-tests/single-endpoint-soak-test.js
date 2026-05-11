import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';
import { handleSummary } from './lib/summary.js';
export { handleSummary };

// Single-endpoint soak test — GET /api/patient
// Holds a moderate, sustainable load for 30 minutes to surface memory leaks,
// connection pool exhaustion, and gradual performance degradation.

const BASE = 'http://localhost:5028/api';
const errorRate = new Rate('error_rate');

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    error_rate: ['rate<0.01'],
  },
  scenarios: {
    soak: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 25 },
        { duration: '26m', target: 25 },
        { duration: '2m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
};

export default function () {
  const res = http.get(`${BASE}/patient`, { tags: { name: 'GET /patient' } });
  check(res, { '200 ok': (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
}
