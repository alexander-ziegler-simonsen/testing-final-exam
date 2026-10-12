import { describe, it } from "vitest";
import { placeholder } from "../test-utils/placeholder";

// Checks that the generated files are in sync with the OpenAPI spec they were
// generated from (api/swagger/v1/swagger.json), see configs/openapi-ts.config.ts.
// Placeholders: each test passes by default until it's implemented.

describe("generated code matches api/swagger/v1/swagger.json", () => {
    it("every operation has a matching sdk function", placeholder);
    it("every sdk function maps to an operation in the spec (no stale functions)", placeholder);
    it("every operation's path and method match its sdk function's url and method", placeholder);
    it("every operation has a matching msw handler", placeholder);
    it("every request body schema has a matching z*Body schema", placeholder);
    it("string minLength/maxLength in the spec match the zod .min()/.max()", placeholder);
    it("required properties in the spec are required in the zod schema", placeholder);
    it("index.ts re-exports every sdk function and zod schema", placeholder);
    it("regenerating with openapi-ts produces no diff (files are neither hand-edited nor stale)", placeholder);
});
