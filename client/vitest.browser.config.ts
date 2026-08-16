import path from 'node:path'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineProject } from 'vitest/config'

export default defineProject({
    plugins: [react()],
    test: {
        name: 'browser',
        include: ['src/**/*.test.{ts,tsx}', 'vitest-example/**/*.test.tsx'],
        exclude: ['src/**/*.unit.test.ts'],
        setupFiles: [path.resolve(__dirname, './src/mocks/setupMswBrowser.ts')],
        browser: {
            enabled: true,
            provider: playwright(),
            // Windows/Hyper-V/WSL2 periodically reserve chunks of the high
            // ephemeral port range for NAT (see `netsh interface ipv4 show
            // excludedportrange protocol=tcp`), which shifts around and can
            // land Vitest's randomly-picked dev-server port inside a
            // reserved block, causing an EACCES (not EADDRINUSE) bind
            // error. Pin to a low, stable port well outside those ranges.
            api: {
                port: 5175,
            },
            // Headless Chromium's default viewport (414x896) is what all
            // committed baselines were captured at. Pin it explicitly so
            // headed runs (which don't get this default automatically)
            // render at the same size instead of falling back to whatever
            // window size the OS/Playwright happens to open headed.
            viewport: { width: 414, height: 896 },
            instances: [
                { browser: 'chromium' },
                // { browser: 'firefox' },
                // { browser: 'webkit' },
            ],
            // Baselines are generated on whatever machine happens to run
            // `img:update` (developer laptops, CI), which don't all render
            // fonts pixel-identically. Allow a small mismatch so that
            // doesn't fail the whole suite over rendering noise.
            expect: {
                toMatchScreenshot: {
                    comparatorOptions: {
                        allowedMismatchedPixelRatio: 0.05,
                    },
                },
            },
        },
    },
})
