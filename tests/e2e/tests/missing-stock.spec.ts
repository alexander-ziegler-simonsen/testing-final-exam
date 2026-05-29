import { test, expect } from '@playwright/test';

/**
 * R-10 Feature: Missing Medicine Report
 *
 * A nurse can report that medication is missing from storage.
 * Submitting the form calls POST /api/missingstorage and shows a success message.
 * The missing report is then visible in the Missing Reports section.
 */

const API = 'http://localhost:5028/api';

const storages = [
  { id: 1, fkMedicationId: 10, amount: 50 },
  { id: 2, fkMedicationId: 11, amount: 5 },
];

const medications = [
  { id: 10, name: 'Aspirin', genericName: null, strength: '100mg', brand: null, category: null, form: 'Tablet', description: null },
  { id: 11, name: 'Ibuprofen', genericName: null, strength: '200mg', brand: null, category: null, form: 'Capsule', description: null },
];

const existingMissing = [
  { id: 1, fkMedicationStorageId: 1, amountMissing: 2, wentMissingAt: '2025-01-01T10:00:00' },
];

const newMissingReport = { id: 2, fkMedicationStorageId: 1, amountMissing: 5, wentMissingAt: '2025-06-01T09:00:00' };

async function loginAsNurseAndGoToMedicationStorage(page: import('@playwright/test').Page) {
  await page.route(`${API}/auth/login`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'fake-nurse-token', role: 'nurse', staffId: 2, firstname: 'Nurse', lastname: 'User' }),
    })
  );

  await page.route(`${API}/patient**`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  );
  await page.route(`${API}/shift**`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  );
  await page.route(`${API}/storage`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(storages) })
  );
  await page.route(`${API}/medicin`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(medications) })
  );
  await page.route(`${API}/missingstorage`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(existingMissing) })
  );
  await page.route(`${API}/roombooking**`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  );
  await page.route(`${API}/location**`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  );

  await page.goto('/login');
  await page.getByPlaceholder('username').fill('nurse1');
  await page.getByPlaceholder('password').fill('password');
  await page.getByRole('button', { name: /Login/i }).click();
  await expect(page).toHaveURL('/nurse');

  await page.getByRole('tab', { name: /Medication Storage/i }).click();
}

test.describe('R-10 – Missing Medicine Report flow', () => {

  test('Medication Storage tab shows the Report Missing Medicine form', async ({ page }) => {
    await loginAsNurseAndGoToMedicationStorage(page);

    await expect(page.getByRole('heading', { name: /Report Missing Medicine/i })).toBeVisible();
  });

  test('Report Missing form lists medication storage options', async ({ page }) => {
    await loginAsNurseAndGoToMedicationStorage(page);

    await expect(page.getByText(/Aspirin.*Storage #1.*stock: 50/)).toBeVisible();
    await expect(page.getByText(/Ibuprofen.*Storage #2.*stock: 5/)).toBeVisible();
  });

  test('Report Missing button is disabled until a storage entry is selected', async ({ page }) => {
    await loginAsNurseAndGoToMedicationStorage(page);

    const reportBtn = page.getByRole('button', { name: /Report Missing/i });
    await expect(reportBtn).toBeDisabled();
  });

  test('submitting the form calls POST /api/missingstorage', async ({ page }) => {
    let postBody = '';

    await loginAsNurseAndGoToMedicationStorage(page);

    await page.route(`${API}/missingstorage`, async (route) => {
      if (route.request().method() === 'POST') {
        postBody = route.request().postData() ?? '';
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 2 }) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([...existingMissing, newMissingReport]) });
      }
    });

    await page.getByRole('combobox').selectOption('1');
    await page.getByPlaceholder('e.g. 5').fill('5');
    await page.getByRole('button', { name: /Report Missing/i }).click();

    await expect(page.getByText('Missing medicine reported successfully.')).toBeVisible();
    expect(postBody).toContain('"fkMedicationStorageId":1');
    expect(postBody).toContain('"amountMissing":5');
  });

  test('shows validation error for non-positive amount', async ({ page }) => {
    await loginAsNurseAndGoToMedicationStorage(page);

    await page.getByRole('combobox').selectOption('1');
    await page.getByPlaceholder('e.g. 5').fill('-3');
    await page.getByRole('button', { name: /Report Missing/i }).click();

    await expect(page.getByText('Amount missing must be a positive number.')).toBeVisible();
  });

  test('the Missing Reports section shows existing reports when expanded', async ({ page }) => {
    await loginAsNurseAndGoToMedicationStorage(page);

    await expect(page.getByText(/Missing Reports \(1\)/)).toBeVisible();
    await page.getByRole('button', { name: /Show/i }).click();

    await expect(page.getByText('2')).toBeVisible(); // amountMissing
  });

});
