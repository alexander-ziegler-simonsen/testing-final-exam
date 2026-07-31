import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    input: "../apiProjects/api/swagger/v1/swagger.json",
    output: "src/api",
    plugins: [ 
        "zod",
        'msw',
        { name: "@hey-api/sdk" },
        { name: "@hey-api/client-axios" }
    ],
});
