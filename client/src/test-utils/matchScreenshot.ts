import { expect } from "vitest";
import { server } from "vitest/browser";

// Vitest's browser UI panel (shown whenever a test is run headed without
// --browser.ui=false, e.g. the interactive `test:browser-head` script) eats
// horizontal space from the test iframe, so components render narrower
// than they do headless/UI-less. Comparing against baselines captured
// without the panel would then fail on a dimension mismatch rather than an
// actual visual regression, so screenshot assertions are skipped whenever
// the panel might be showing.
export async function matchScreenshot(element: Element, name: string) {
    if (server.config.browser.ui) return;
    await expect(element).toMatchScreenshot(name);
}
