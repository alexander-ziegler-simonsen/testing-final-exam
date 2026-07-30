import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    // Direct file link within your local monorepo workspaces
    input: "../apiProjects/api/docs/openapi.yaml",
    output: "src/api",
    plugins: [
        "@hey-api/client-axios", 
        "zod",
        {
            name: "@hey-api/sdk",
        },
    ],
});
