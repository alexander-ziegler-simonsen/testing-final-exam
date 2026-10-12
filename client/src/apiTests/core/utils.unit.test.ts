import { describe, it } from "vitest";
import { placeholder } from "../../test-utils/placeholder";

// Tests for the url and body helpers in ../../api/core/utils.gen.ts.
// Placeholders: each test passes by default until it's implemented.

describe("core/utils.gen", () => {
    describe("defaultPathSerializer", () => {
        it("replaces {id} with the path value", placeholder);
        it("URL-encodes the path value", placeholder);
        it("leaves {id} in place when the value is undefined or null", placeholder);
        it("replaces every placeholder when the url has several", placeholder);
    });

    describe("getUrl", () => {
        it("joins baseUrl and url", placeholder);
        it("adds a leading / when the url has none", placeholder);
        it("appends the serialized query after ?", placeholder);
        it("adds no ? when the query serializes to an empty string", placeholder);
        it("does not double the ? when the serializer already returns one", placeholder);
    });

    describe("getValidRequestBody", () => {
        it("returns undefined when there is no body", placeholder);
        it("returns a plain body as-is when there is no bodySerializer", placeholder);
        it("returns null for an empty-string body when a bodySerializer is set", placeholder);
        it("returns serializedBody when one is provided", placeholder);
    });
});
