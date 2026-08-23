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
            // set a fixed api port, to not hit a randomly used port (happened with Windows/Hyper-V/WSL2)
            api: {
                port: 5175,
            },
            // fixed viewport(414x896) - for component images in Headless Chromium  tests
            viewport: { width: 414, height: 896 },
            instances: [
                { browser: 'chromium' },
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
})
