import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    input: "../apiProjects/api/swagger/v1/swagger.json",
    output: "src/api",
    plugins: [
        { name: 'zod', includeInEntry: true },
        // Default source is ['@hey-api/examples'], which pulls fallback response
        // bodies from the OpenAPI "example" values (the same ones the API's
        // DefaultValue-based examples feed for Postman/Swagger UI). That meant any
        // handler used in a test without an explicit body would silently return
        // 200 with fake data instead of failing loud - masking a forgotten mock.
        // Empty source keeps that "no mock configured -> fail" contract intact.
        { name: 'msw', source: [] },
        { name: "@hey-api/sdk" },
        { name: "@hey-api/client-axios" }
    ],
});
