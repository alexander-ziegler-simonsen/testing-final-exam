import { test, expect } from '@playwright/test';

test('nurse gives treatment and get doctors approval', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();

    await page.getByRole('textbox', { name: 'username' }).fill('nurse');

    await page.getByRole('textbox', { name: 'password' }).fill('Nurse1234!');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('tab', { name: 'Give Treatment' }).click();

    await page.getByRole('combobox').first().selectOption('1');
    await page.getByRole('textbox', { name: 'Describe the treatment…' }).fill('clean up burns on skin');

    await page.getByRole('combobox').nth(1).selectOption('2');

    await page.getByPlaceholder('e.g. 2').fill('2');
    await page.getByRole('button', { name: 'Doctor sign-off' }).click();

    await page.getByRole('textbox', { name: 'Doctor username' }).fill('doctor');
    await page.getByRole('textbox', { name: 'Password' }).fill('Doctor1234!');

    await page.getByRole('button', { name: 'Authenticate' }).click();

    await expect(page.getByLabel('Give Treatment').locator('form')).toContainText('Approved by Dr. eva møller');

    await page.getByRole('button', { name: 'Give Treatment' }).click();
    await expect(page.getByLabel('Give Treatment').locator('form')).toContainText('Treatment recorded successfully.');

    await page.getByRole('button', { name: 'Logout' }).click();
});