import { defineConfig } from "vitest/config";
import { BaseSequencer, type WorkspaceProject } from "vitest/node";

// Vitest's default sequencer does NOT run files in alphabetical order (it
// balances by past run duration), so the 01-, 02-, ... prefixes in tests/
// wouldn't actually reflect run order on their own. This sequencer forces
// plain alphabetical-by-path sorting, which — combined with fileParallelism
// below — makes the numeric prefixes the real, guaranteed run order.
class AlphabeticalSequencer extends BaseSequencer {
    async sort(files: [project: WorkspaceProject, testFile: string][]) {
        return [...files].sort(([, a], [, b]) => a.localeCompare(b));
    }
}

export default defineConfig({
    test: {
        include: ["tests/**/*.test.ts"],
        environment: "node",
        globalSetup: ["./globalSetup.ts"],
        testTimeout: 30_000,
        // Also stops files from running concurrently in separate worker
        // threads, so they execute one at a time, strictly in the sorted
        // order above.
        fileParallelism: false,
        sequence: {
            sequencer: AlphabeticalSequencer,
        },
    },
});
