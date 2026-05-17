import { test, expect } from '@playwright/test';

/**
 * State Transition Testing – Route Protection
 *
 * States
 *   S0  Unauthenticated        – no session token stored
 *   S1  Authenticated[Nurse]   – JWT with role = "nurse" held in session
 *
 * Events
 *   E1  navigate(protected)    – visit /admin, /nurse, or /doctor without a token
 *   E2  login(role=nurse)      – submit nurse credentials, receive JWT
 *   E3  navigate(/admin)       – visit admin route while authenticated as nurse
 *
 * State Transition Diagram
 *
 *              E1: navigate(protected) → redirect /login
 *          ┌─────────────────────────────────────────────┐
 *          ▼                                             │
 *   ┌──────────────────┐   E2: login(nurse)   ┌─────────────────────────┐
 *   │  S0              │──────────────────────▶│  S1                     │
 *   │  Unauthenticated │                       │  Authenticated[Nurse]   │
 *   └──────────────────┘                       └─────────────────────────┘
 *          ▲                                             │
 *          │     E3: navigate(/admin)                    │
 *          │     → redirect /login  [authz failure]      │
 *          └─────────────────────────────────────────────┘
 *
 * Transition Table
 *   T1  S0 + E1(/admin)   → S0   redirect /login                [tested]
 *   T2  S0 + E1(/nurse)   → S0   redirect /login                [tested]
 *   T3  S0 + E1(/doctor)  → S0   redirect /login                [tested]
 *   T4  S0 + E2           → S1   land on /nurse (role home)     [tested]
 *   T5  S1 + E3(/admin)   → S0   redirect /login (authz fail)   [tested]
 */

const API = 'http://localhost:5028/api';

test.describe('Protected routes – State Transition Testing', () => {

  test('T1 – S0 + navigate(/admin) → S0: redirect /login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL('/login');
  });

  test('T2 – S0 + navigate(/nurse) → S0: redirect /login', async ({ page }) => {
    await page.goto('/nurse');
    await expect(page).toHaveURL('/login');
  });

  test('T3 – S0 + navigate(/doctor) → S0: redirect /login', async ({ page }) => {
    await page.goto('/doctor');
    await expect(page).toHaveURL('/login');
  });

  test('T4+T5 – S0 + login(nurse) → S1; S1 + navigate(/admin) → S0', async ({ page }) => {
    await page.route(`${API}/auth/login`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-jwt-token',
          role: 'nurse',
          staffId: 2,
          firstname: 'Nurse',
          lastname: 'User',
        }),
      })
    );

    // T4: S0 → login(nurse) → S1
    await page.goto('/login');
    await page.getByPlaceholder('username').fill('nurse1');
    await page.getByPlaceholder('password').fill('password');
    await page.getByRole('button', { name: /Login/i }).click();
    await expect(page).toHaveURL('/nurse');

    // T5: S1 → navigate(/admin) → S0 (unauthorized)
    await page.goto('/admin');
    await expect(page).toHaveURL('/login');
  });

});
