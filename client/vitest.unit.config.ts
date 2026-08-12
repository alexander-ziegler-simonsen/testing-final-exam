import path from 'node:path'
import { defineProject } from 'vitest/config'

export default defineProject({
    test: {
        name: 'unit',
        environment: "jsdom",
        include: ['src/**/*.unit.test.ts'],
        setupFiles: [path.resolve(__dirname, './src/mocks/setupMswNode.ts')],
        typecheck: {
            enabled: true,
            include: [ 'src/**/*.unit.test.ts' ],
        },
    },
})
