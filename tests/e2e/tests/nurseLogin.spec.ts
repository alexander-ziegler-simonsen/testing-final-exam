import { test, expect } from '@playwright/test';

test('nurse login and logout', async ({ page }) => {

    await page.goto('http://localhost:5173/');

    await page.getByRole('link', { name: 'Login' }).click();

    await page.getByRole('textbox', { name: 'Username' }).fill('nurse');

    await page.getByRole('textbox', { name: 'Password' }).fill('Nurse1234!');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('💉')).toBeVisible();
    await expect(page.getByRole('navigation')).toContainText('💉');
    await expect(page.url()).toContain('/nurse');

    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page.url()).toContain('http://localhost:5173/');
});

test('nurse login with wrong password', async ({ page }) => {

    await page.goto('http://localhost:5173/');

    await page.getByRole('link', { name: 'Login' }).click();

    await page.getByRole('textbox', { name: 'Username' }).fill('nurse');

    await page.getByRole('textbox', { name: 'Password' }).fill('WrongPassword123!');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('#login-error')).toBeVisible();
    await expect(page.locator('#login-error')).toContainText('Invalid username or password');
});