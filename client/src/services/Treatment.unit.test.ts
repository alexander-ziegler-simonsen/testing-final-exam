import { describe, it } from "vitest";
import { placeholder } from "../test-utils/placeholder";

// Placeholders: each test passes by default until it's implemented.

describe("TreatmentService", () => {
    it("getAll returns the mocked treatment list", placeholder);
    it("getAll maps the filter to the FkPatientId, Description and Time query params", placeholder);
    it("getAll sends sortBy and sortDir", placeholder);
    it("getAll leaves a null description out of the query", placeholder);
    it("getAll throws when the API errors", placeholder);
    it("getById returns a single mocked treatment", placeholder);
    it("getById throws when the treatment is missing", placeholder);
    it("create posts the input and returns the new id", placeholder);
    it("create sends staffId as a query param when given", placeholder);
    it("create sends no staffId query param when staffId is null or 0", placeholder);
    it("create throws when the API errors", placeholder);
    it("create throws when the API returns a non-number id", placeholder);
    it("create throws before sending a request when the description is shorter than 2 characters", placeholder);
    it("update resolves without throwing on success", placeholder);
    it("update throws when the API errors", placeholder);
    it("update throws before sending a request when the input fails validation", placeholder);
    it("delete resolves without throwing on success", placeholder);
    it("delete throws when the API errors", placeholder);
});
