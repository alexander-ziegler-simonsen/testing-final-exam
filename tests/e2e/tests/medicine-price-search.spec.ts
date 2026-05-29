import { test, expect } from '@playwright/test';

/**
 * Medicine Price Search — E2E tests
 *
 * The external Danish medicine price API is fully mocked via page.route().
 * No real network calls are made.
 *
 * The external API is proxied through the backend; Playwright intercepts the
 * backend proxy route so the tests run without a live external connection.
 */

const API = 'http://localhost:5028/api';
const EXT = `${API}/medicin/external`;

const productList = [
  { varenummer: '001', navn: 'Panodil', firma: 'Karo Pharma', styrke: '500 mg', pakning: '20 stk' },
  { varenummer: '002', navn: 'Ipren', firma: 'Karo Pharma', styrke: '200 mg', pakning: '24 stk' },
];

const productDetail = {
  varenummer: '001',
  navn: 'Panodil',
  firma: 'Karo Pharma',
  styrke: '500 mg',
  pakning: '20 stk',
  prisPrPakning: '29.95',
  prisPrEnhed: '1.50',
  virksomtStof: 'Paracetamol',
  atcKode: 'N02BE01',
  udleveringsgruppe: 'HF',
  Haandkoeb: true,
  Udgaaet: false,
};

test.describe('Medicine Price Search (home page)', () => {

  test('home page shows the Medicine Price Search section', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Medicine Price Search/i })).toBeVisible();
    await expect(page.getByPlaceholder(/e.g. Ibuprofen/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Search/i })).toBeVisible();
  });

  test('"By Name" and "By Ingredient" mode buttons are visible', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: /By Name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /By Ingredient/i })).toBeVisible();
  });

  test('searching by name displays product results', async ({ page }) => {
    await page.route(`${EXT}/name/**`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(productList) })
    );

    await page.goto('/');
    await page.getByPlaceholder(/e.g. Ibuprofen/i).fill('Panodil');
    await page.getByRole('button', { name: /Search/i }).click();

    await expect(page.getByText('Panodil')).toBeVisible();
    await expect(page.getByText('Ipren')).toBeVisible();
  });

  test('empty search does not show results or error', async ({ page }) => {
    let called = false;
    await page.route(`${EXT}/**`, (route) => { called = true; route.fulfill({ status: 200, body: '[]' }); });

    await page.goto('/');
    await page.getByRole('button', { name: /Search/i }).click();

    await page.waitForTimeout(300);
    expect(called).toBe(false);
  });

  test('clicking Details button shows product detail view', async ({ page }) => {
    await page.route(`${EXT}/name/**`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(productList) })
    );
    await page.route(`${EXT}/details/**`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(productDetail) })
    );

    await page.goto('/');
    await page.getByPlaceholder(/e.g. Ibuprofen/i).fill('Panodil');
    await page.getByRole('button', { name: /Search/i }).click();
    await expect(page.getByText('Panodil')).toBeVisible();

    await page.getByRole('button', { name: /Details/i }).first().click();

    await expect(page.getByText('Paracetamol')).toBeVisible();
    await expect(page.getByText('29.95')).toBeVisible();
  });

  test('"Back to results" button returns to the product list', async ({ page }) => {
    await page.route(`${EXT}/name/**`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(productList) })
    );
    await page.route(`${EXT}/details/**`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(productDetail) })
    );

    await page.goto('/');
    await page.getByPlaceholder(/e.g. Ibuprofen/i).fill('Panodil');
    await page.getByRole('button', { name: /Search/i }).click();
    await expect(page.getByText('Panodil')).toBeVisible();

    await page.getByRole('button', { name: /Details/i }).first().click();
    await expect(page.getByRole('button', { name: /Back to results/i })).toBeVisible();
    await page.getByRole('button', { name: /Back to results/i }).click();

    await expect(page.getByText('Ipren')).toBeVisible();
    await expect(page.getByText('Paracetamol')).not.toBeVisible();
  });

  test('API error shows an error message', async ({ page }) => {
    await page.route(`${EXT}/name/**`, (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' })
    );

    await page.goto('/');
    await page.getByPlaceholder(/e.g. Ibuprofen/i).fill('anything');
    await page.getByRole('button', { name: /Search/i }).click();

    await expect(page.getByText(/Could not fetch results/i)).toBeVisible();
  });

  test('pressing Enter in the search field triggers a search', async ({ page }) => {
    await page.route(`${EXT}/name/**`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(productList) })
    );

    await page.goto('/');
    const input = page.getByPlaceholder(/e.g. Ibuprofen/i);
    await input.fill('Panodil');
    await input.press('Enter');

    await expect(page.getByText('Panodil')).toBeVisible();
  });

});
