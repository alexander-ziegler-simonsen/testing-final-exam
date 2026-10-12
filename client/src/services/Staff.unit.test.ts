import { describe, it } from "vitest";
import { placeholder } from "../test-utils/placeholder";

// Placeholders: each test passes by default until it's implemented.

describe("StaffService", () => {
    it("getAll returns the mocked staff list", placeholder);
    it("getAll throws when the API errors", placeholder);
    it("getById returns a single mocked staff member", placeholder);
    it("getById throws when the staff member is missing", placeholder);
    it("create posts the input and returns the new id", placeholder);
    it("create throws when the API errors", placeholder);
    it("create throws when the API returns a non-number id", placeholder);
    it("create throws before sending a request when the firstname is shorter than 2 characters", placeholder);
    it("update resolves without throwing on success", placeholder);
    it("update throws when the API errors", placeholder);
    it("update throws before sending a request when the input fails validation", placeholder);
    it("delete resolves without throwing on success", placeholder);
    it("delete throws when the API errors", placeholder);
    it("getCount returns the mocked staff count", placeholder);
    it("getCount throws when the API errors", placeholder);
});
