import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["**/*.test.js"],
        environment: "node",
        globalSetup: ["./globalSetup.js"],
        testTimeout: 30_000,
    },
});