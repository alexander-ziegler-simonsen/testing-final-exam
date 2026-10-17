import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    input: "../api/swagger/v1/swagger.json",
    output: "src/api",
    plugins: [
        { name: 'zod', includeInEntry: true },
        { name: 'msw', source: [] },
        { name: "@hey-api/sdk" },
        { name: "@hey-api/client-axios" }
    ],
});
