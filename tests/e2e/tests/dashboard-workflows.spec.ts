import { test, expect } from '@playwright/test';

/**
 * Dashboard Workflow Tests
 *
 * Tests that verify nurse and doctor dashboards load correctly, display data,
 * and expose the right tabs and features for each role.
 */

const API = 'http://localhost:5028/api';

const patients = [
  { id: 1, firstname: 'Alice', lastname: 'Smith', gender: 'Female', cprNumber: '0101901234' },
  { id: 2, firstname: 'Bob', lastname: 'Jones', gender: 'Male', cprNumber: '0202901234' },
];

const shifts = [
  { id: 1, startTime: '2025-06-01T08:00:00', endTime: '2025-06-01T16:00:00' },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

async function loginAndGoTo(
  page: import('@playwright/test').Page,
  role: string,
  path: string,
  extraRoutes?: (page: import('@playwright/test').Page) => Promise<void>
) {
  await page.route(`${API}/auth/login`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'fake-token', role, staffId: 1, firstname: 'Test', lastname: 'User' }),
    })
  );

  if (extraRoutes) await extraRoutes(page);

  await page.goto('/login');
  await page.getByPlaceholder('username').fill(`${role}1`);
  await page.getByPlaceholder('password').fill('password');
  await page.getByRole('button', { name: /Login/i }).click();
  await expect(page).toHaveURL(path);
}

// ─── Nurse Dashboard ──────────────────────────────────────────────────────────

test.describe('Nurse Dashboard', () => {

  test('renders the Nurse Dashboard heading after login', async ({ page }) => {
    await loginAndGoTo(page, 'nurse', '/nurse', async (p) => {
      await p.route(`${API}/patient**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(patients) })
      );
      await p.route(`${API}/shift**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(shifts) })
      );
    });

    await expect(page.getByRole('heading', { name: /Nurse Dashboard/i })).toBeVisible();
  });

  test('displays the Patients tab with patient data', async ({ page }) => {
    await loginAndGoTo(page, 'nurse', '/nurse', async (p) => {
      await p.route(`${API}/patient**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(patients) })
      );
      await p.route(`${API}/shift**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
    });

    await expect(page.getByText('Alice')).toBeVisible();
    await expect(page.getByText('Bob')).toBeVisible();
  });

  test('patient count badge reflects the number of patients loaded', async ({ page }) => {
    await loginAndGoTo(page, 'nurse', '/nurse', async (p) => {
      await p.route(`${API}/patient**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(patients) })
      );
      await p.route(`${API}/shift**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
    });

    await expect(page.getByRole('tab', { name: /Patients.*2/i })).toBeVisible();
  });

  test('clicking View on a patient row navigates to the patient detail page', async ({ page }) => {
    await loginAndGoTo(page, 'nurse', '/nurse', async (p) => {
      await p.route(`${API}/patient**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(patients) })
      );
      await p.route(`${API}/shift**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
    });

    await page.route(`${API}/patient/1`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(patients[0]) })
    );
    await page.route(`${API}/treatment**`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.route(`${API}/roombooking**`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.route(`${API}/location**`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await page.getByRole('button', { name: /View/i }).first().click();
    await expect(page).toHaveURL('/patients/1');
  });

  test('Shifts tab shows shift data', async ({ page }) => {
    await loginAndGoTo(page, 'nurse', '/nurse', async (p) => {
      await p.route(`${API}/patient**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
      await p.route(`${API}/shift**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(shifts) })
      );
    });

    await page.getByRole('tab', { name: /Shifts/i }).click();
    await expect(page.getByText('1')).toBeVisible(); // shift ID
  });

  test('Give Treatment tab shows the Give Treatment form', async ({ page }) => {
    await loginAndGoTo(page, 'nurse', '/nurse', async (p) => {
      await p.route(`${API}/patient**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(patients) })
      );
      await p.route(`${API}/shift**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
      await p.route(`${API}/medicin`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
      await p.route(`${API}/storage`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
    });

    await page.getByRole('tab', { name: /Give Treatment/i }).click();
    await expect(page.getByRole('heading', { name: /Give Treatment/i })).toBeVisible();
  });

});

// ─── Doctor Dashboard ─────────────────────────────────────────────────────────

test.describe('Doctor Dashboard', () => {

  test('renders the Doctor Dashboard heading after login', async ({ page }) => {
    await loginAndGoTo(page, 'doctor', '/doctor', async (p) => {
      await p.route(`${API}/patient**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(patients) })
      );
      await p.route(`${API}/shift**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
      await p.route(`${API}/medicin`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
      await p.route(`${API}/storage`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
    });

    await expect(page.getByRole('heading', { name: /Doctor Dashboard/i })).toBeVisible();
  });

  test('doctor dashboard shows patient data', async ({ page }) => {
    await loginAndGoTo(page, 'doctor', '/doctor', async (p) => {
      await p.route(`${API}/patient**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(patients) })
      );
      await p.route(`${API}/shift**`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
      await p.route(`${API}/medicin`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
      await p.route(`${API}/storage`, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
    });

    await expect(page.getByText('Alice')).toBeVisible();
    await expect(page.getByText('Bob')).toBeVisible();
  });

});
