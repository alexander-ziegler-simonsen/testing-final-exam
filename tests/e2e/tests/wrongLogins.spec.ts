import { test, expect } from '@playwright/test';
// import { resetDb } from './dbReset';

// test.beforeEach(async () => {
//     await resetDb();
// });

test('doctor login with wrong password', async ({ page }) => {

    await page.goto('http://localhost:5173/');
    await page.getByTestId('public-footer-login-link').click();
    await page.getByTestId('login-username-input').fill('doctor');
    await page.getByTestId('login-password-input').fill('Doctor12');
    await page.getByTestId('login-submit-button').click();
    await expect(page.getByTestId('login-feedback-text')).toBeVisible();
    await expect(page.getByTestId('login-feedback-text')).toContainText('Wrong username or password.');
});