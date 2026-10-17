import path from 'node:path'
import { defineProject } from 'vitest/config'

export default defineProject({
    test: {
        // a project's root defaults to its config file's folder, point it back at client/
        root: path.resolve(__dirname, '..'),
        name: 'unit',
        environment: "jsdom",
        include: ['src/**/*.unit.test.ts'],
        setupFiles: [path.resolve(__dirname, '../src/mocks/SetupMswNode.ts')],
        typecheck: {
            enabled: true,
            include: [ 'src/**/*.unit.test.ts' ],
        },
    },
})
