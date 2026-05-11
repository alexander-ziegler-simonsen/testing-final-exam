import { test, expect } from '@playwright/test';

const API = 'http://localhost:5028/api';

const mockLoginSuccess = (page: import('@playwright/test').Page, role: string) =>
  page.route(`${API}/auth/login`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'fake-jwt-token',
        role,
        staffId: 1,
        firstname: 'Test',
        lastname: 'User',
      }),
    })
  );

const mockLoginFailure = (page: import('@playwright/test').Page) =>
  page.route(`${API}/auth/login`, (route) =>
    route.fulfill({ status: 401, body: 'Unauthorized' })
  );

test.describe('Login page', () => {

  test('shows login form with username and password fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Login/i })).toBeVisible();
    await expect(page.getByPlaceholder('username')).toBeVisible();
    await expect(page.getByPlaceholder('password')).toBeVisible();
    await expect(page.getByRole('button', { name: /Login/i })).toBeVisible();
  });

  test('shows error message on invalid credentials', async ({ page }) => {
    await mockLoginFailure(page);
    await page.goto('/login');

    await page.getByPlaceholder('username').fill('wronguser');
    await page.getByPlaceholder('password').fill('wrongpass');
    await page.getByRole('button', { name: /Login/i }).click();

    await expect(page.getByText(/Invalid username or password/i)).toBeVisible();
  });

  test('nurse login redirects to /nurse', async ({ page }) => {
    await mockLoginSuccess(page, 'nurse');
    await page.goto('/login');

    await page.getByPlaceholder('username').fill('nurse1');
    await page.getByPlaceholder('password').fill('password');
    await page.getByRole('button', { name: /Login/i }).click();

    await expect(page).toHaveURL('/nurse');
  });

  test('admin login redirects to /admin', async ({ page }) => {
    await mockLoginSuccess(page, 'admin');
    await page.goto('/login');

    await page.getByPlaceholder('username').fill('admin1');
    await page.getByPlaceholder('password').fill('password');
    await page.getByRole('button', { name: /Login/i }).click();

    await expect(page).toHaveURL('/admin');
  });

  test('doctor login redirects to /doctor', async ({ page }) => {
    await mockLoginSuccess(page, 'doctor');
    await page.goto('/login');

    await page.getByPlaceholder('username').fill('doctor1');
    await page.getByPlaceholder('password').fill('password');
    await page.getByRole('button', { name: /Login/i }).click();

    await expect(page).toHaveURL('/doctor');
  });

  test('pressing Enter on password field submits the form', async ({ page }) => {
    await mockLoginFailure(page);
    await page.goto('/login');

    await page.getByPlaceholder('username').fill('anyuser');
    await page.getByPlaceholder('password').fill('anypass');
    await page.getByPlaceholder('password').press('Enter');

    await expect(page.getByText(/Invalid username or password/i)).toBeVisible();
  });

});
