import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // fast Node-only tests (msw/node, no browser) vs. real-browser tests
        // (msw/browser, Playwright chromium) — see vitest.unit.config.ts /
        // vitest.browser.config.ts.
        // paths resolve from the vitest root (client/), not from this file
        projects: ['./configs/vitest.unit.config.ts', './configs/vitest.browser.config.ts'],

        // 2. Pass the instantiated class into the top-level test reporters array
        reporters: [ 'default' ],

        coverage: {
            provider: 'v8',
            enabled: true,
            clean: false,
            include: ['src/**/*.{ts,tsx}'],

            reporter: [ 'text', 'json' ],
        },
    },
})