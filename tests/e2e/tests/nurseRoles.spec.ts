import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

  await page.goto('http://localhost:5173/');
  await page.getByTestId('public-footer-login-link').click();
  await page.getByTestId('login-username-input').fill('nurse');
  await page.getByTestId('login-password-input').fill('Nurse1234!');
  await page.getByTestId('login-submit-button').click();

//http://localhost:5173/app/overview
await expect(page.getByTestId('sidebar-desktop-departments-link-open-button')).toBeVisible();
await expect(page.getByTestId('sidebar-desktop-department-staff-link-open-button')).toBeVisible();
await expect(page.getByTestId('sidebar-desktop-facilities-link-open-button')).toBeVisible();
await expect(page.getByTestId('sidebar-desktop-missing-medicin-link-open-button')).toBeVisible();
await expect(page.getByTestId('sidebar-desktop-medicin-storage-link-open-button')).toBeVisible();
await expect(page.getByTestId('sidebar-desktop-external-medicin-link-open-button')).toBeVisible();
await expect(page.getByTestId('sidebar-desktop-patients-link-open-button')).toBeVisible();
await expect(page.getByTestId('sidebar-desktop-shifts-link-open-button')).toBeVisible();
await expect(page.getByTestId('sidebar-desktop-room-booking-link-open-button')).toBeVisible();
await expect(page.getByTestId('sidebar-desktop-treatment-link-open-button')).toBeVisible();
await expect(page.getByTestId('sidebar-desktop-give-treatment-link-open-button')).toBeVisible();

await page.getByTestId('dashboard-navbar-logout-button').click();
// http://localhost:5173/login
});
