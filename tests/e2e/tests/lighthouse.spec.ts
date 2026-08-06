import os from 'os';
import path from 'path';
import net from 'net';
import { test as base, expect, chromium } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import { resetDb } from './dbReset';

// Grabs an OS-assigned free port instead of a hardcoded one, so a stray
// concurrent run (e.g. an IDE-triggered test alongside a terminal run)
// doesn't collide trying to bind the same CDP debugging port.
function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, () => {
      const port = (server.address() as net.AddressInfo).port;
      server.close(() => resolve(port));
    });
  });
}

// playwright-lighthouse audits by opening its own CDP target rather than
// reusing the test's page. That target lands in the browser's default
// (non-incognito) context, but @playwright/test's built-in `context` fixture
// is an incognito context - login state set there would be invisible to
// lighthouse's target. A persistent context has only one, non-incognito
// context for the whole browser, so cookies/localStorage set via this
// fixture's `page` are visible to lighthouse's target too.
const test = base.extend<{ port: number; context: BrowserContext; page: Page }>({
  port: async ({}, use) => {
    await use(await getFreePort());
  },
  context: async ({ port }, use) => {
    const userDataDir = path.join(os.tmpdir(), 'pw-lighthouse', String(Math.random()));
    const context = await chromium.launchPersistentContext(userDataDir, {
      args: [`--remote-debugging-port=${port}`],
      viewport: { width: 1280, height: 720 },
    });
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    await use(context.pages()[0] ?? (await context.newPage()));
  },
});

// Every route reachable from the doctor sidebar (see App.tsx / DoctorSidebarCheck.spec.ts) -
// this doctor account is blocked from /app/staff (admin only) and /app/give_treatment
// (nurse/admin only), so those two are excluded.
const DASHBOARD_PAGES = [
  { name: 'overview', path: '/app/overview' },
  { name: 'departments', path: '/app/departments' },
  { name: 'department-staff', path: '/app/department_staff' },
  { name: 'facilities', path: '/app/facilities' },
  { name: 'patients', path: '/app/patients' },
  { name: 'missing-medicin', path: '/app/missing_medicin' },
  { name: 'medicin-storage', path: '/app/medicin_storage' },
  { name: 'external-medicin', path: '/app/external_medicin' },
  { name: 'shifts', path: '/app/shifts' },
  { name: 'room-booking', path: '/app/room_booking' },
  { name: 'treatment', path: '/app/treatment' },
];

test.beforeEach(async () => {
  await resetDb();
});

test('doctor dashboard pages meet lighthouse thresholds', async ({ page, port }, testInfo) => {
  await page.goto('http://localhost:5173/login');
  await page.getByTestId('login-username-input').fill('doctor');
  await page.getByTestId('login-password-input').fill('Doctor1234!');
  await page.getByTestId('login-submit-button').click();
  await expect(page).toHaveURL('http://localhost:5173/app/overview');

  for (const { name, path: routePath } of DASHBOARD_PAGES) {
    await test.step(`lighthouse: ${name}`, async () => {
      await page.goto(`http://localhost:5173${routePath}`);

      await playAudit({
        page,
        port,
        // Starting thresholds against the unminified Vite dev server (see
        // playwright.config.ts webServer) - performance in particular reads
        // much lower here than a production build, tune once real scores are in.
        thresholds: {
          performance: 40,
          accessibility: 85,
          'best-practices': 80,
        },
        reports: {
          formats: { html: true },
          name: `${name}-lighthouse`,
          directory: './lighthouse-reports',
        },
      });

      await testInfo.attach(`${name}-lighthouse`, {
        path: `./lighthouse-reports/${name}-lighthouse.html`,
        contentType: 'text/html',
      });
    });
  }
});
