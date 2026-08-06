import { test, expect } from "@playwright/test";
import { resetDb } from "./dbReset";

test.beforeEach(async () => {
  await resetDb();
});

test("test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByTestId("public-footer-login-link").click();
  await expect(page).toHaveURL("http://localhost:5173/login");

  await page.getByTestId("login-username-input").fill("doctor");
  await page.getByTestId("login-password-input").fill("Doctor1234!");
  await page.getByTestId("login-submit-button").click();

  await expect(page).toHaveURL("http://localhost:5173/app/overview");
  await page.getByTestId("sidebar-desktop-departments-link-open-button").click();

  await expect(page).toHaveURL("http://localhost:5173/app/departments");

  // read all data
  await expect(page.getByTestId("departments-table-row-0-cell-id")).toContainText("1");
  await expect(page.getByTestId("departments-table-row-0-cell-name")).toContainText("emergency");
  await expect(page.getByTestId("departments-table-row-0-cell-type")).toContainText("critical care");

  await expect(page.getByTestId("departments-table-row-1-cell-id")).toContainText("2");
  await expect(page.getByTestId("departments-table-row-1-cell-name")).toContainText("surgery");
  await expect(page.getByTestId("departments-table-row-1-cell-type")).toContainText("operation");

  await expect(page.getByTestId("departments-table-row-2-cell-id")).toContainText("3");
  await expect(page.getByTestId("departments-table-row-2-cell-name")).toContainText("cardiology");
  await expect(page.getByTestId("departments-table-row-2-cell-type")).toContainText("specialist");

  await expect(page.getByTestId("departments-table-row-3-cell-id")).toContainText("4");
  await expect(page.getByTestId("departments-table-row-3-cell-name")).toContainText("pediatrics");
  await expect(page.getByTestId("departments-table-row-3-cell-type")).toContainText("child care");

  await expect(page.getByTestId("departments-table-row-4-cell-id")).toContainText("5");
  await expect(page.getByTestId("departments-table-row-4-cell-name")).toContainText("radiology");
  await expect(page.getByTestId("departments-table-row-4-cell-type")).toContainText("diagnostics");

  // edit one
  await page.getByTestId('departments-edit-1').click();
  await page.getByTestId('departments-form-field-name').fill('emergency1');
  await page.getByTestId('departments-form-field-type').fill('critical care1');
  await page.getByTestId('departments-form-submit-button').click();

  // check that it got updated
  await expect(page.getByTestId('departments-table-row-0-cell-id')).toContainText('1');
  await expect(page.getByTestId('departments-table-row-0-cell-name')).toContainText('emergency1');
  await expect(page.getByTestId('departments-table-row-0-cell-type')).toContainText('critical care1');
  
  // add a new one
  await page.getByTestId('departments-add-button').click();
  await page.getByTestId('departments-form-field-name').fill('test2');
  await page.getByTestId('departments-form-field-type').fill('test2');
  await page.getByTestId('departments-form-submit-button').click();

  // check that it got added
  await expect(page.getByTestId('departments-table-row-6-cell-id')).toContainText('7');
  await expect(page.getByTestId('departments-table-row-6-cell-name')).toContainText('test2');
  await expect(page.getByTestId('departments-table-row-6-cell-type')).toContainText('test2');
  
  // delete it
  await page.getByTestId('departments-delete-6').click();
  await page.getByTestId('departments-form-submit-button').click();

  // logout
  await page.getByTestId('dashboard-navbar-logout-button').click();
  await expect(page).toHaveURL("http://localhost:5173/login");
});
