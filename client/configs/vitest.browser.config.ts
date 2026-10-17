import path from "node:path";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineProject } from "vitest/config";

export default defineProject({
  plugins: [react()],
  test: {
    name: "browser",
    // project root defaults to this file's folder (configs/), point it back at client/
    root: path.resolve(__dirname, ".."),
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["src/**/*.unit.test.ts"],
    setupFiles: [path.resolve(__dirname, "../src/mocks/setupMswBrowser.ts")],
    browser: {
      enabled: true,
      provider: playwright({
        contextOptions: {
          viewport: { width: 1920, height: 1920 },
        },
      }),
      // set a fixed api port, to not hit a randomly used port (happened with Windows/Hyper-V/WSL2)
      api: { port: 5175 },
      instances: [
        { browser: "chromium" },
        // { browser: 'firefox' },
        // { browser: 'webkit' },
      ],
      // fix for fonts pixel problems with CI ubuntu images - where small mismatch broke the test
      expect: {
        toMatchScreenshot: {
          comparatorOptions: {
            allowedMismatchedPixelRatio: 0.05,
          },
        },
      },
    },
  },
});
