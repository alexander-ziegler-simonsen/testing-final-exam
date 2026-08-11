import { test, expect } from '@playwright/test';

test('Doctor looks at departmentStaff read data', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByTestId('public-footer-login-link').click();
  await expect(page).toHaveURL('http://localhost:5173/login');

  await page.getByTestId('login-username-input').fill('doctor');
  await page.getByTestId('login-password-input').fill('Doctor1234!');
  await page.getByTestId('login-submit-button').click();

  await expect(page).toHaveURL('http://localhost:5173/app/overview');

  await page.getByTestId('sidebar-desktop-department-staff-link-open-button').click();
  await expect(page).toHaveURL('http://localhost:5173/app/department_staff');

  // check data
  await expect(page.getByTestId('department-staff-table-row-0-cell-id')).toContainText('1');
  await expect(page.getByTestId('department-staff-table-row-0-cell-department')).toContainText('emergency (critical care)');
  await expect(page.getByTestId('department-staff-table-row-0-cell-staff')).toContainText('lars christensen');
  await expect(page.getByTestId('department-staff-table-row-1-cell-id')).toContainText('2');
  await expect(page.getByTestId('department-staff-table-row-1-cell-department')).toContainText('emergency (critical care)');
  await expect(page.getByTestId('department-staff-table-row-1-cell-staff')).toContainText('eva møller');
  await expect(page.getByTestId('department-staff-table-row-2-cell-id')).toContainText('3');
  await expect(page.getByTestId('department-staff-table-row-2-cell-department')).toContainText('surgery (operation)');
  await expect(page.getByTestId('department-staff-table-row-2-cell-staff')).toContainText('thomas pedersen');
  await expect(page.getByTestId('department-staff-table-row-3-cell-id')).toContainText('4');
  await expect(page.getByTestId('department-staff-table-row-3-cell-department')).toContainText('surgery (operation)');
  await expect(page.getByTestId('department-staff-table-row-3-cell-staff')).toContainText('maria jensen');
  await expect(page.getByTestId('department-staff-table-row-4-cell-id')).toContainText('5');
  await expect(page.getByTestId('department-staff-table-row-4-cell-department')).toContainText('cardiology (specialist)');
  await expect(page.getByTestId('department-staff-table-row-4-cell-staff')).toContainText('peter poulsen');
  await expect(page.getByTestId('department-staff-table-row-5-cell-id')).toContainText('6');
  await expect(page.getByTestId('department-staff-table-row-5-cell-department')).toContainText('cardiology (specialist)');
  await expect(page.getByTestId('department-staff-table-row-5-cell-staff')).toContainText('anna nielsen');
  await expect(page.getByTestId('department-staff-table-row-6-cell-id')).toContainText('7');
  await expect(page.getByTestId('department-staff-table-row-5-cell-department')).toContainText('cardiology (specialist)');
  await expect(page.getByTestId('department-staff-table-row-5-cell-staff')).toContainText('anna nielsen');
  await expect(page.getByTestId('department-staff-table-row-6-cell-id')).toContainText('7');
  await expect(page.getByTestId('department-staff-table-row-6-cell-department')).toContainText('pediatrics (child care)');
  await expect(page.getByTestId('department-staff-table-row-6-cell-staff')).toContainText('mikkel hansen');
  await expect(page.getByTestId('department-staff-table-row-7-cell-id')).toContainText('8');
  await expect(page.getByTestId('department-staff-table-row-7-cell-department')).toContainText('pediatrics (child care)');
  await expect(page.getByTestId('department-staff-table-row-7-cell-staff')).toContainText('laura larsen');
  await expect(page.getByTestId('department-staff-table-row-8-cell-id')).toContainText('9');
  await expect(page.getByTestId('department-staff-table-row-8-cell-department')).toContainText('radiology (diagnostics)');
  await expect(page.getByTestId('department-staff-table-row-8-cell-staff')).toContainText('frederik olsen');
  await expect(page.getByTestId('department-staff-table-row-9-cell-id')).toContainText('10');
  await expect(page.getByTestId('department-staff-table-row-9-cell-department')).toContainText('radiology (diagnostics)');
  await expect(page.getByTestId('department-staff-table-row-9-cell-staff')).toContainText('clara andersen');
  
  await page.getByTestId('dashboard-navbar-logout-button').click();
  await expect(page).toHaveURL('http://localhost:5173/login');

});