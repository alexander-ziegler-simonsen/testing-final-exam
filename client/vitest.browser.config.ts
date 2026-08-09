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
