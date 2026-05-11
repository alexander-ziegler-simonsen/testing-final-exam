import { test, expect } from '@playwright/test';

const API = 'http://localhost:5028/api';

test.describe('Protected routes', () => {

  test('unauthenticated user visiting /admin is redirected to /login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL('/login');
  });

  test('unauthenticated user visiting /nurse is redirected to /login', async ({ page }) => {
    await page.goto('/nurse');
    await expect(page).toHaveURL('/login');
  });

  test('unauthenticated user visiting /doctor is redirected to /login', async ({ page }) => {
    await page.goto('/doctor');
    await expect(page).toHaveURL('/login');
  });

  test('authenticated nurse cannot access /admin', async ({ page }) => {
    await page.route(`${API}/auth/login`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-jwt-token',
          role: 'nurse',
          staffId: 2,
          firstname: 'Nurse',
          lastname: 'User',
        }),
      })
    );

    await page.goto('/login');
    await page.getByPlaceholder('username').fill('nurse1');
    await page.getByPlaceholder('password').fill('password');
    await page.getByRole('button', { name: /Login/i }).click();
    await expect(page).toHaveURL('/nurse');

    await page.goto('/admin');
    await expect(page).toHaveURL('/login');
  });

});
