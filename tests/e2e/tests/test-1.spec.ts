import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByTestId('public-footer-login-link').click();

  await expect(page).toHaveURL("http://localhost:5173/'login");

  await page.getByTestId('login-username-input').fill('doctor');
  await page.getByTestId('login-password-input').fill('Doctor1234!');


  await page.getByTestId('login-submit-button').click();
  await expect(page).toHaveURL("http://localhost:5173/app/overview");

  // check roles navigation links show up right after doctor login
  await expect.soft(page.getByTestId('sidebar-desktop-treatment-link-open-button')).toBeVisible();
  await expect.soft(page.getByTestId('sidebar-desktop-room-booking-link-open-button')).toBeVisible();
  await expect.soft(page.getByTestId('sidebar-desktop-shifts-link-open-button')).toBeVisible();
  await expect.soft(page.getByTestId('sidebar-desktop-patients-link-open-button')).toBeVisible();
  await expect.soft(page.getByTestId('sidebar-desktop-patients-link-open-button')).toBeVisible();
  await expect.soft(page.getByTestId('sidebar-desktop-external-medicin-link-open-button')).toBeVisible();
  await expect.soft(page.getByTestId('sidebar-desktop-medicin-storage-link-open-button')).toBeVisible();
  await expect.soft(page.getByTestId('sidebar-desktop-missing-medicin-link-open-button')).toBeVisible();
  await expect.soft(page.getByTestId('sidebar-desktop-facilities-link-open-button')).toBeVisible();
  await expect.soft(page.getByTestId('sidebar-desktop-department-staff-link-open-button')).toBeVisible();
  await expect.soft(page.getByTestId('sidebar-desktop-departments-link-open-button')).toBeVisible();


  await page.getByTestId('dashboard-main-content').click();
  await expect(page).toHaveURL("http://localhost:5173/app/external_medicin");



  // wrong input, found nothing
  // await page.getByTestId('sidebar-desktop-external-medicin-link-open-button').click();
  // await page.getByTestId('external-medicin-search-input').fill('panodiler');
  // await page.getByTestId('external-medicin-search-button').click();

  // right input, found something
  await page.getByTestId('external-medicin-search-input').fill('panodi');
  await page.getByTestId('external-medicin-search-input').press('Enter');
  await page.getByTestId('external-medicin-search-button').click();


  await page.getByTestId('dashboard-main-content').click();
  await expect(page).toHaveURL("http://localhost:5173/app/external_medicin/048744"); // need to mock this

  await expect(page.getByTestId('one-external-medicin-error')).toContainText('Failed to fetch product details');

  // go back to last page - TODO : make a button for this later
  await page.goBack();
  await expect(page).toHaveURL("http://localhost:5173/app/external_medicin");


  await page.getByTestId('dashboard-main-content').click();
  await page.getByTestId('external-medicin-search-input').click();
  await page.getByTestId('external-medicin-search-input').fill('panodli');
  await page.getByTestId('external-medicin-search-input').press('Enter');
  await page.getByTestId('external-medicin-search-input').fill('panodl');
  await page.getByTestId('external-medicin-search-input').press('Enter');
  await page.getByTestId('external-medicin-search-input').fill('panodi');
  await page.getByTestId('external-medicin-search-button').click();

  await page.getByRole('cell', { name: '100 stk. (dåse)' }).click();
  await page.getByRole('cell', { name: '100 stk. (dåse)' }).click();
  await page.getByTestId('external-medicin-row-4').getByRole('cell', { name: 'mg' }).click();
  await page.getByTestId('external-medicin-row-4').getByRole('cell', { name: 'Haleon Denmark ApS' }).click();
  await page.getByTestId('external-medicin-row-4').getByRole('cell', { name: 'Panodil' }).click();
  await page.getByTestId('external-medicin-row-5').getByRole('cell', { name: 'View' }).click();
  await page.getByTestId('one-external-medicin-field-varenummer').click();
});