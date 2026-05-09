function ms(v)  { return v != null ? `${v.toFixed(2)} ms` : '—'; }
function pct(v) { return v != null ? `${(v * 100).toFixed(2)}%` : '—'; }
function num(v) { return v != null ? v.toFixed(2) : '—'; }

// Internal k6 metrics that add noise without insight
const SKIP = new Set(['vus', 'vus_max', 'data_sent', 'data_received']);

function thresholdRows(metrics) {
  return Object.entries(metrics)
    .filter(([, m]) => m.thresholds)
    .flatMap(([name, m]) =>
      Object.entries(m.thresholds).map(([expr, t]) => `
        <tr>
          <td>${name}</td>
          <td><code>${expr}</code></td>
          <td class="${t.ok ? 'pass' : 'fail'}">${t.ok ? '✓ PASS' : '✗ FAIL'}</td>
        </tr>`)
    ).join('');
}

function trendTable(metrics) {
  const rows = Object.entries(metrics)
    .filter(([name, m]) => m.type === 'trend' && !SKIP.has(name))
    .map(([name, m]) => {
      const v = m.values;
      return `<tr>
        <td>${name}</td>
        <td>${ms(v.avg)}</td>
        <td>${ms(v.min)}</td>
        <td>${ms(v.med)}</td>
        <td>${ms(v['p(90)'])}</td>
        <td>${ms(v['p(95)'])}</td>
        <td>${ms(v.max)}</td>
      </tr>`;
    }).join('');
  if (!rows) return '';
  return `
  <h2>Timing Breakdown</h2>
  <table>
    <tr><th>Metric</th><th>avg</th><th>min</th><th>median</th><th>p90</th><th>p95</th><th>max</th></tr>
    ${rows}
  </table>`;
}

function counterRateTable(metrics) {
  const rows = Object.entries(metrics)
    .filter(([name, m]) => (m.type === 'counter' || m.type === 'rate') && !SKIP.has(name))
    .map(([name, m]) => {
      const v = m.values;
      if (m.type === 'counter') {
        return `<tr><td>${name}</td><td>${v.count}</td><td>${num(v.rate)}/s</td></tr>`;
      }
      return `<tr><td>${name}</td><td>${pct(v.rate)}</td><td>—</td></tr>`;
    }).join('');
  if (!rows) return '';
  return `
  <h2>Counters &amp; Rates</h2>
  <table>
    <tr><th>Metric</th><th>Total / Rate</th><th>Per second</th></tr>
    ${rows}
  </table>`;
}

function buildHtml(data) {
  const name    = __ENV.TEST_NAME || 'stress-test';
  const dur     = data.metrics.http_req_duration?.values;
  const reqs    = data.metrics.http_reqs?.values;
  const failed  = data.metrics.http_req_failed?.values;
  const errRate = data.metrics.error_rate?.values;
  const allPass = Object.entries(data.metrics)
    .filter(([, m]) => m.thresholds)
    .every(([, m]) => Object.values(m.thresholds).every(t => t.ok));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>k6 Report — ${name}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body  { font-family: system-ui, sans-serif; margin: 40px auto; max-width: 960px; color: #222; }
    h1    { font-size: 1.6rem; border-bottom: 2px solid #333; padding-bottom: 8px; }
    h2    { font-size: 1.1rem; margin-top: 36px; color: #444; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: 700; font-size: 0.9rem; }
    .badge.pass { background: #d4edda; color: #155724; }
    .badge.fail { background: #f8d7da; color: #721c24; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.88rem; }
    th    { background: #f0f0f0; text-align: left; padding: 7px 10px; border: 1px solid #ccc; }
    td    { padding: 6px 10px; border: 1px solid #ddd; }
    tr:nth-child(even) td { background: #fafafa; }
    .pass { color: #155724; font-weight: 700; }
    .fail { color: #721c24; font-weight: 700; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px; }
    .card { background: #f8f8f8; border: 1px solid #ddd; border-radius: 6px; padding: 14px 16px; }
    .card .label { font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: .05em; }
    .card .value { font-size: 1.4rem; font-weight: 700; margin-top: 4px; }
    code { background: #eee; padding: 1px 4px; border-radius: 3px; font-size: 0.85em; }
  </style>
</head>
<body>
  <h1>k6 Stress Test Report</h1>
  <p>
    <strong>Test:</strong> ${name} &nbsp;|&nbsp;
    <strong>Generated:</strong> ${new Date().toUTCString()} &nbsp;|&nbsp;
    <span class="badge ${allPass ? 'pass' : 'fail'}">${allPass ? 'ALL THRESHOLDS PASSED' : 'THRESHOLDS FAILED'}</span>
  </p>

  <h2>Key Metrics</h2>
  <div class="summary-grid">
    <div class="card"><div class="label">Total Requests</div><div class="value">${reqs?.count ?? '—'}</div></div>
    <div class="card"><div class="label">Requests / sec</div><div class="value">${num(reqs?.rate)}</div></div>
    <div class="card"><div class="label">p95 Duration</div><div class="value">${ms(dur?.['p(95)'])}</div></div>
    <div class="card"><div class="label">Error Rate</div><div class="value">${pct(errRate?.rate ?? failed?.rate)}</div></div>
  </div>

  <h2>HTTP Request Duration</h2>
  <table>
    <tr><th>avg</th><th>min</th><th>median</th><th>p90</th><th>p95</th><th>p99</th><th>max</th></tr>
    <tr>
      <td>${ms(dur?.avg)}</td>
      <td>${ms(dur?.min)}</td>
      <td>${ms(dur?.med)}</td>
      <td>${ms(dur?.['p(90)'])}</td>
      <td>${ms(dur?.['p(95)'])}</td>
      <td>${ms(dur?.['p(99)'])}</td>
      <td>${ms(dur?.max)}</td>
    </tr>
  </table>

  <h2>Thresholds</h2>
  <table>
    <tr><th>Metric</th><th>Condition</th><th>Result</th></tr>
    ${thresholdRows(data.metrics)}
  </table>

  ${trendTable(data.metrics)}
  ${counterRateTable(data.metrics)}
</body>
</html>`;
}

export function handleSummary(data) {
  const name = __ENV.TEST_NAME || 'report';
  return {
    [`stress-tests/reports/${name}.html`]: buildHtml(data),
  };
}
