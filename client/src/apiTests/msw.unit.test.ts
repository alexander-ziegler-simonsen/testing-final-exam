import { describe, it } from "vitest";
import { placeholder } from "../test-utils/placeholder";

// Tests for the generated MSW handlers in ../api/msw.gen.ts and the default
// handlers built from them in src/mocks/handlers.ts.
// Placeholders: each test passes by default until it's implemented.

describe("msw.gen", () => {
    describe("handle* functions", () => {
        it("respond 200 with the given body when called with { body }", placeholder);
        it("respond with the given status when called with { body, status }", placeholder);
        it("use the resolver's response when called with a function", placeholder);
        it("respond 501 Not Implemented when no response is configured", placeholder);
        it("let the request through when responseFallback is 'passthrough'", placeholder);
        it("match any host by default, and only options.baseUrl when it is set", placeholder);
        it("match :id path params (handleDepartmentGet answers /api/Department/5)", placeholder);
        it("do not answer a different endpoint (handleTreatmentStaffGetAll does not answer /api/DepartmentStaff)", placeholder);
    });

    describe("createMswHandlers", () => {
        it("pick has one handler factory per sdk function", placeholder);
        it("all() returns one handler per operation", placeholder);
        it("all({ pick }) uses the given response for the picked operations", placeholder);
        it("applies the config passed to createMswHandlers to every handler", placeholder);
        it("lets per-handler options override the shared config", placeholder);
    });

    describe("default handlers (src/mocks/handlers.ts)", () => {
        it("answer every sdk endpoint, so onUnhandledRequest never fires", placeholder);
        it("return bodies that match each endpoint's zod response schema", placeholder);
        it("productsByName returns the products whose name contains the search, ignoring case", placeholder);
        it("productsByName returns 404 when no product matches", placeholder);
        it("productsByIngredient returns 404 when no product matches", placeholder);
    });
});
