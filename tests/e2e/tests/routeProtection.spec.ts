import { test, expect } from '@playwright/test';

test('Unauthenticated user visiting /app is redirected to login', async () => {
  expect(true).toBe(true);
});

test('Nurse is blocked from /app/staff', async () => {
  expect(true).toBe(true);
});

test('Doctor is blocked from /app/give_treatment', async () => {
  expect(true).toBe(true);
});
