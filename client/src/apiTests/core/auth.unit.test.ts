import { describe, it } from "vitest";
import { placeholder } from "../../test-utils/placeholder";

// Tests for getAuthToken in ../../api/core/auth.gen.ts.
// Placeholders: each test passes by default until it's implemented.

describe("core/auth.gen getAuthToken", () => {
    it("returns Bearer <token> for the bearer scheme", placeholder);
    it("returns Basic <base64 token> for the basic scheme", placeholder);
    it("returns the raw token for apiKey auth", placeholder);
    it("calls the callback with the auth object when given a function", placeholder);
    it("awaits an async callback", placeholder);
    it("returns undefined when the token is an empty string or undefined", placeholder);
});
