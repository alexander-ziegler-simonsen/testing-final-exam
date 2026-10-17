import path from 'node:path'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineProject } from 'vitest/config'

export default defineProject({
    plugins: [react()],
    test: {
        // a project's root defaults to its config file's folder, point it back at client/
        root: path.resolve(__dirname, '..'),
        name: 'browser',
        include: ['src/**/*.test.{ts,tsx}'],
        exclude: ['src/**/*.unit.test.ts'],
        setupFiles: [path.resolve(__dirname, '../src/mocks/SetupMswBrowser.ts')],
        browser: {
            enabled: true,
            provider: playwright(),
            // set a fixed api port, to not hit a randomly used port (happened with Windows/Hyper-V/WSL2)
            api: { port: 5175 },
            viewport: { width: 1024, height: 1024 },
            instances: [
                { browser: 'chromium' },
                // { browser: 'firefox' },
                // { browser: 'webkit' },
            ],
        },
    },
})
