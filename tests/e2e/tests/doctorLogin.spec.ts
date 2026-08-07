import { test, expect } from '@playwright/test';
import { resetDb } from './dbReset';

test.beforeEach(async () => {
    await resetDb();
});

test('doctor login with wrong password', async ({ page }) => {

    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('doctor');
    await page.getByRole('textbox', { name: 'Password' }).fill('WrongPassword123!');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('#login-error')).toBeVisible();
    await expect(page.locator('#login-error')).toContainText('Invalid username or password');
});