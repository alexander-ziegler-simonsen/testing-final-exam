import { chromium } from '@playwright/test';

const screenshotDir = '/private/tmp/claude-501/-Users-ziegler-Documents-code-projects-kea-S2-testing-final-exam/3f002685-65f7-4350-bb89-fb797b6f05df/scratchpad';

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
await page.getByTestId('login-username-input').fill('doctor');
await page.getByTestId('login-password-input').fill('Doctor1234!');
await page.getByTestId('login-submit-button').click();
await page.waitForTimeout(2000);
await page.screenshot({ path: `${screenshotDir}/0b-after-login-click.png` });
console.log('FEEDBACK:', await page.getByTestId('login-feedback-text').textContent().catch(() => 'n/a'));

console.log('URL_AFTER_LOGIN:', page.url());
await page.screenshot({ path: `${screenshotDir}/1-after-login.png` });

// Click the new sidebar link
await page.getByTestId(/sidebar-desktop-external-medicin-link/).first().click();
await page.getByTestId('external-medicin-page-heading').waitFor();
console.log('URL_AFTER_NAV:', page.url());
await page.screenshot({ path: `${screenshotDir}/2-external-medicin-empty.png` });

// Search by name
await page.getByTestId('external-medicin-search-input').fill('paracetamol');
await page.getByTestId('external-medicin-search-button').click();
await page.waitForTimeout(2500);
await page.screenshot({ path: `${screenshotDir}/3-search-results.png` });

// Toggle to ingredient search
await page.getByTestId('external-medicin-mode-ingredient').click();
await page.getByTestId('external-medicin-search-input').fill('paracetamol');
await page.getByTestId('external-medicin-search-button').click();
await page.waitForTimeout(2500);
await page.screenshot({ path: `${screenshotDir}/4-ingredient-results.png` });

// Try clicking first row (if any)
const rows = page.locator('[data-testid^="external-medicin-row-"]');
const rowCount = await rows.count();
console.log('ROW_COUNT:', rowCount);
if (rowCount > 0) {
  await rows.first().click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${screenshotDir}/5-after-row-click.png` });
  console.log('URL_AFTER_CLICK:', page.url());
}

console.log('CONSOLE_ERRORS:', JSON.stringify(errors));

await browser.close();
