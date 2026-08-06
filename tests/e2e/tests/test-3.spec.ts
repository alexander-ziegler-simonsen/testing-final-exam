import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByTestId('public-footer-login-link').click();
  await page.getByTestId('login-username-input').click();
  await page.getByTestId('login-username-input').fill('doctor');
  await page.getByTestId('login-password-input').fill('Doctor1234!');
  await page.getByTestId('login-submit-button').click();

  await page.getByTestId('dashboard-main-content').click();
  await page.locator('body').press('F12');
  await page.getByTestId('dashboard-main-content').click();
  await page.locator('body').press('F12');
  await page.getByTestId('sidebar-desktop-external-medicin-link-open-button').click();
  await page.getByTestId('external-medicin-search-input').click();
  await page.getByTestId('external-medicin-search-input').fill('panodi');
  await page.getByTestId('external-medicin-search-button').click();
  await page.getByTestId('external-medicin-details-1').getByText('View').click();
  await page.getByTestId('one-external-medicin-back-button').click();
  await page.getByTestId('external-medicin-details-0').getByText('View').click();
  await page.getByTestId('one-external-medicin-back-button').click();
  await page.getByTestId('external-medicin-details-2').getByText('View').click();
  await page.goto('http://localhost:5173/app/external_medicin');
  await page.getByTestId('external-medicin-row-0').getByRole('cell', { name: 'GlaxoSmithKline Consumer' }).click();
  await page.getByTestId('external-medicin-row-1').getByRole('cell', { name: 'GlaxoSmithKline Consumer' }).click();
  await page.getByTestId('external-medicin-row-2').getByRole('cell', { name: 'GlaxoSmithKline Consumer' }).click();
  await page.getByTestId('external-medicin-row-1').getByRole('cell', { name: 'GlaxoSmithKline Consumer' }).click();
  await page.getByTestId('external-medicin-row-0').getByRole('cell', { name: 'GlaxoSmithKline Consumer' }).click();
});