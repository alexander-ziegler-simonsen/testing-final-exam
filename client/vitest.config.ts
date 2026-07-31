import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import path from 'node:path'
// 1. Import the official Allure reporter constructor
import AllureReporter from 'allure-vitest/reporter' 

process.env.ALLURE_HOST_NAME = 'CI-Runner'
process.env.ALLURE_THREAD_NAME = 'Main-Thread'

const timestamp = new Date().toISOString()
    .replace(/T/, '_')
    .replace(/:/g, '-')
    .split('.')[0]

export default defineConfig({
    plugins: [react()],
    test: {

        globalSetup: [path.resolve(__dirname, './vitest-setup.ts')],
        // 2. Pass the instantiated class into the top-level test reporters array
        reporters: [
            'default', 
            new AllureReporter({ 
                resultsDir: path.resolve(__dirname, `../client/docs/vitest_coverage/run_${timestamp}/allure-results`) 
            })
        ],  

        browser: {
            enabled: true,
            provider: playwright(),
            instances: [
                { browser: 'chromium' },
            ],
        },

        coverage: {
            provider: 'v8',
            enabled: true,
            clean: false,
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['src/api/**/*'],
            reportsDirectory: path.resolve(__dirname, `../client/docs/vitest_coverage/run_${timestamp}`),

            reporter: [
                'text',
                'json',
                ['json-summary', { file: `report-${timestamp}.json` }]
            ],
        },
    },
})