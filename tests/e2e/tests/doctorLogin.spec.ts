import { test, expect } from '@playwright/test';

test('doctor login and logout', async ({ page }) => {

    await page.goto('http://localhost:5173/');

    await page.getByRole('link', { name: 'Login' }).click();

    await page.getByRole('textbox', { name: 'Username' }).fill('doctor');

    await page.getByRole('textbox', { name: 'Password' }).fill('Doctor1234!');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('navigation')).toContainText('🩺');
    await expect(page.url()).toContain('/doctor');

    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page.url()).toContain('http://localhost:5173/');
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