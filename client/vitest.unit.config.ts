import path from 'node:path'
import { defineProject } from 'vitest/config'

export default defineProject({
    test: {
        name: 'unit',
        environment: 'node',
        include: ['src/**/*.unit.test.ts'],
        setupFiles: [path.resolve(__dirname, './src/mocks/setupMswNode.ts')],
    },
})
