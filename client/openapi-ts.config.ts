import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    // Direct file link within your local monorepo workspaces
    input: "../apiProjects/api/swagger/v1/swagger.json",
    output: "src/api",
    plugins: [ 
        "zod",
        { name: "@hey-api/sdk" },
        { name: "@hey-api/client-axios" }
    ],
});
