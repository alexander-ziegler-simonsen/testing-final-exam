import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.locator('body').click();
  await page.goto('http://localhost:5173/');

  await expect(page).toHaveURL('http://localhost:5173/');


  await page.getByTestId('public-footer-login-link').click();
await expect(page).toHaveURL('http://localhost:5173/login');

  await page.getByTestId('login-username-input').fill('doctor');
  await page.getByTestId('login-password-input').fill('Doctor1234!');
  await page.getByTestId('login-submit-button').click();

  await expect(page).toHaveURL('http://localhost:5173/app/overview');

  await page.getByTestId('sidebar-desktop-external-medicin-link-open-button').click();
  await page.getByTestId('external-medicin-search-input').click();
  await page.getByTestId('external-medicin-search-input').fill('panodi');
  await page.getByTestId('external-medicin-search-button').click();
  await page.getByTestId('external-medicin-row-0').getByRole('cell', { name: '10 stk. (blister)' }).click();
  await page.getByTestId('one-external-medicin-back-button').click();
  await page.getByTestId('external-medicin-row-1').getByRole('cell', { name: '10 stk. (blister)' }).click();
  await page.getByTestId('one-external-medicin-back-button').click();
  await page.getByTestId('external-medicin-row-2').getByRole('cell', { name: 'stk. tabl. m modif udløsn' }).click();

  await expect(page).toHaveURL('http://localhost:5173/app/external_medicin/008453');

  await expect(page.getByTestId('one-external-medicin-error')).toContainText('Failed to fetch product details');

  await page.goto('http://localhost:5173/app/external_medicin');

  // go back to last page
  await page.goBack();
  await expect(page).toHaveURL('http://localhost:5173/app/external_medicin')

  // check that the page updates afterwards, when there was no details on that product
  await expect(page.getByTestId('external-medicin-details-2')).toContainText('No details');
  
  // logout
  await page.getByTestId('dashboard-navbar-logout-button').click();
  await expect(page).toHaveURL('http://localhost:5173/login');
});
