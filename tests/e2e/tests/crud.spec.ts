import { test, expect } from '@playwright/test';

const API = 'http://localhost:5028/api';

// ─── helpers ──────────────────────────────────────────────────────────────────

function loginAsAdmin(page: import('@playwright/test').Page) {
  return page.route(`${API}/auth/login`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'fake-admin-token', role: 'admin', staffId: 1, firstname: 'Admin', lastname: 'User' }),
    })
  );
}

const deptList = [
  { id: 1, name: 'Cardiology', type: 'Medical' },
  { id: 2, name: 'Orthopedics', type: 'Surgical' },
];

async function goToAdminDepartmentsTab(page: import('@playwright/test').Page) {
  await loginAsAdmin(page);

  // mock all requests the admin dashboard makes on load
  await page.route(`${API}/staff`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.route(`${API}/department`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(deptList) })
  );
  await page.route(`${API}/shift`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.route(`${API}/medicin`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.route(`${API}/prescription`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.route(`${API}/treatmentstaff`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.route(`${API}/user`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.route(`${API}/storage`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.route(`${API}/missingstorage`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));

  await page.goto('/login');
  await page.getByPlaceholder('username').fill('admin1');
  await page.getByPlaceholder('password').fill('password');
  await page.getByRole('button', { name: /Login/i }).click();
  await expect(page).toHaveURL('/admin');

  await page.getByRole('tab', { name: /Departments/i }).click();
}

// ─── Department CRUD ─────────────────────────────────────────────────────────

test.describe('Admin Dashboard – Department CRUD', () => {

  test('Departments tab lists existing departments from the API', async ({ page }) => {
    await goToAdminDepartmentsTab(page);

    await expect(page.getByText('Cardiology')).toBeVisible();
    await expect(page.getByText('Orthopedics')).toBeVisible();
  });

  test('Add Department form is visible on the Departments tab', async ({ page }) => {
    await goToAdminDepartmentsTab(page);

    await expect(page.getByRole('heading', { name: /Add Department/i })).toBeVisible();
    await expect(page.getByPlaceholder('e.g. Cardiology')).toBeVisible();
  });

  test('submitting the Add Department form calls POST /api/department', async ({ page }) => {
    let postBody = '';
    await goToAdminDepartmentsTab(page);

    await page.route(`${API}/department`, async (route) => {
      if (route.request().method() === 'POST') {
        postBody = route.request().postData() ?? '';
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 3 }) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([...deptList, { id: 3, name: 'Neurology', type: 'Medical' }]) });
      }
    });

    await page.getByPlaceholder('e.g. Cardiology').fill('Neurology');
    await page.getByPlaceholder('e.g. Surgical').fill('Medical');
    await page.getByRole('button', { name: /Add Department/i }).click();

    await expect(page.getByText('Department created.')).toBeVisible();
    expect(postBody).toContain('Neurology');
  });

  test('empty name shows validation error without calling the API', async ({ page }) => {
    let postCalled = false;
    await goToAdminDepartmentsTab(page);

    await page.route(`${API}/department`, async (route) => {
      if (route.request().method() === 'POST') {
        postCalled = true;
        await route.fulfill({ status: 200, body: '' });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(deptList) });
      }
    });

    await page.getByRole('button', { name: /Add Department/i }).click();

    await expect(page.getByText('Department name is required.')).toBeVisible();
    expect(postCalled).toBe(false);
  });

  test('clicking Edit pre-fills the form with the department data', async ({ page }) => {
    await goToAdminDepartmentsTab(page);

    const editButtons = page.getByRole('button', { name: /^Edit$/i });
    await editButtons.first().click();

    await expect(page.getByRole('heading', { name: /Editing: Cardiology/i })).toBeVisible();
    await expect(page.getByDisplayValue('Cardiology')).toBeVisible();
  });

  test('Save Changes calls PUT /api/department/{id}', async ({ page }) => {
    let putCalled = false;
    await goToAdminDepartmentsTab(page);

    await page.route(`${API}/department/1`, async (route) => {
      if (route.request().method() === 'PUT') {
        putCalled = true;
        await route.fulfill({ status: 200, body: '' });
      }
    });

    await page.getByRole('button', { name: /^Edit$/i }).first().click();
    await page.getByRole('button', { name: /Save Changes/i }).click();

    await expect(page.getByText('Department updated.')).toBeVisible();
    expect(putCalled).toBe(true);
  });

  test('clicking Delete calls DELETE /api/department/{id}', async ({ page }) => {
    let deletedId = 0;
    await goToAdminDepartmentsTab(page);

    await page.route(`${API}/department/1`, async (route) => {
      if (route.request().method() === 'DELETE') {
        deletedId = 1;
        await route.fulfill({ status: 200, body: '' });
      }
    });

    await page.getByRole('button', { name: /^Delete$/i }).first().click();

    await page.waitForTimeout(300);
    expect(deletedId).toBe(1);
  });

});

// ─── Staff CRUD ───────────────────────────────────────────────────────────────

test.describe('Admin Dashboard – Staff tab', () => {

  test('Staff tab shows "No staff members yet." when API returns empty list', async ({ page }) => {
    await loginAsAdmin(page);

    await page.route(`${API}/staff`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/department`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/shift`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/medicin`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/prescription`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/treatmentstaff`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/user`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/storage`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/missingstorage`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));

    await page.goto('/login');
    await page.getByPlaceholder('username').fill('admin1');
    await page.getByPlaceholder('password').fill('password');
    await page.getByRole('button', { name: /Login/i }).click();
    await expect(page).toHaveURL('/admin');

    await expect(page.getByText('No staff members yet.')).toBeVisible();
  });

  test('Staff tab lists staff members returned by the API', async ({ page }) => {
    await loginAsAdmin(page);

    await page.route(`${API}/staff`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: 1, firstname: 'Jane', lastname: 'Doe', fkRoleId: 2 }]) })
    );
    await page.route(`${API}/department`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/shift`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/medicin`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/prescription`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/treatmentstaff`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/user`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/storage`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    await page.route(`${API}/missingstorage`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));

    await page.goto('/login');
    await page.getByPlaceholder('username').fill('admin1');
    await page.getByPlaceholder('password').fill('password');
    await page.getByRole('button', { name: /Login/i }).click();

    await expect(page.getByText(/Jane.*Doe/)).toBeVisible();
  });

});
