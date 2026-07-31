// vitest-setup.ts
import fs from 'node:fs'
import path from 'node:path'

export default function setup() {
    // This teardown hook runs automatically after all tests and coverage files are fully written
    return () => {
        // Dynamically look up the generated folders
        const clientDocsDir = path.resolve(__dirname, '../client/docs/vitest_coverage')
        if (!fs.existsSync(clientDocsDir)) return

        const runs = fs.readdirSync(clientDocsDir)
        
        // Target one directory above the current script folder to capture the project root
        const workspaceRoot = path.dirname(__dirname)
        const absolutePathPattern = new RegExp(workspaceRoot.replace(/\\/g, '\\\\'), 'g')

        for (const runDir of runs) {
            if (!runDir.startsWith('run_')) continue
            const targetDir = path.resolve(clientDocsDir, runDir)

            // Get files inside the run directory
            const files = fs.readdirSync(targetDir).map(f => path.resolve(targetDir, f))

            for (const filePath of files) {
                if (fs.existsSync(filePath) && fs.statSync(filePath).isFile() && filePath.endsWith('.json')) {
                    const originalContent = fs.readFileSync(filePath, 'utf8')
                    const sanitizedContent = originalContent.replace(absolutePathPattern, '.')
                    fs.writeFileSync(filePath, sanitizedContent, 'utf8')
                }
            }
        }
        console.log('✅ Local paths sanitized successfully.')
    }
}
