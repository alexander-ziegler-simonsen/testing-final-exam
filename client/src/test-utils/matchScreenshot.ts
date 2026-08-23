import { expect } from "vitest";
import { server } from "vitest/browser";

export async function matchScreenshot(element: Element, name: string) {
    // skip if vitest is runing in headed mode
    if (server.config.browser.ui) 
        return;

    await expect(element).toMatchScreenshot(name);
}
