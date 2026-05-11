import { test, expect } from '@playwright/test';

test.describe('Public navigation', () => {

  test('home page loads with correct heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Welcome to the Hospital System/i })).toBeVisible();
  });

  test('navbar contains all public links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#NavHomeBtn')).toBeVisible();
    await expect(page.locator('#NavAboutBtn')).toBeVisible();
    await expect(page.locator('#NavContactBtn')).toBeVisible();
    await expect(page.locator('#navLocationBtn')).toBeVisible();
  });

  test('about page loads with hospital name', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: /Fake General Hospital/i })).toBeVisible();
  });

  test('contact page loads with contact heading', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: /Contact Us/i })).toBeVisible();
  });

  test('navbar about link navigates to about page', async ({ page }) => {
    await page.goto('/');
    await page.locator('#NavAboutBtn').click();
    await expect(page).toHaveURL('/about');
    await expect(page.getByRole('heading', { name: /Fake General Hospital/i })).toBeVisible();
  });

  test('navbar contact link navigates to contact page', async ({ page }) => {
    await page.goto('/');
    await page.locator('#NavContactBtn').click();
    await expect(page).toHaveURL('/contact');
  });

});
