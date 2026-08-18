import { test, expect } from '@playwright/test';

test('Nurse logins and give treatment', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByTestId('public-footer-login-link').click();
  await expect(page).toHaveURL('http://localhost:5173/login');


  await page.getByTestId('login-username-input').fill('nurse');
  await page.getByTestId('login-password-input').fill('Nurse1234!');
  await page.getByTestId('login-submit-button').click();

  await expect(page).toHaveURL('http://localhost:5173/app/overview');
  await page.getByTestId('sidebar-desktop-give-treatment-link-open-button').click();

  await expect(page).toHaveURL('http://localhost:5173/app/give_treatment');
  await page.getByTestId('give-treatment-field-patient').selectOption('1');
  await page.getByTestId('give-treatment-field-description').click();
  await page.getByTestId('give-treatment-field-description').fill('test text here');
  await page.getByTestId('give-treatment-field-time').click();
  await page.getByTestId('give-treatment-submit-button').click();
  await page.getByTestId('dashboard-navbar-logout-button').click();

  await expect(page).toHaveURL('http://localhost:5173/login');
});

test('Nurse logins and give treatment , that needs a doctor to sign off on it- not done yet', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByTestId('public-footer-login-link').click();
  await expect(page).toHaveURL('http://localhost:5173/login');


  await page.getByTestId('login-username-input').fill('nurse');
  await page.getByTestId('login-password-input').fill('Nurse1234!');
  await page.getByTestId('login-submit-button').click();

  await expect(page).toHaveURL('http://localhost:5173/app/overview');
  await page.getByTestId('sidebar-desktop-give-treatment-link-open-button').click();

  await expect(page).toHaveURL('http://localhost:5173/app/give_treatment');
  await page.getByTestId('give-treatment-field-patient').selectOption('1');
  await page.getByTestId('give-treatment-field-description').click();
  await page.getByTestId('give-treatment-field-description').fill('test text here');
  await page.getByTestId('give-treatment-field-time').click();
  await page.getByTestId('give-treatment-submit-button').click();
  await page.getByTestId('dashboard-navbar-logout-button').click();

  await expect(page).toHaveURL('http://localhost:5173/login');
});