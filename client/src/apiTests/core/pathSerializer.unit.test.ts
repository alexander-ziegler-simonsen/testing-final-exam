import { describe, it } from "vitest";
import { placeholder } from "../../test-utils/placeholder";

// Tests for the param serializers in ../../api/core/pathSerializer.gen.ts.
// Placeholders: each test passes by default until it's implemented.

describe("core/pathSerializer.gen", () => {
    describe("serializePrimitiveParam", () => {
        it("returns name=value", placeholder);
        it("URL-encodes the value unless allowReserved is set", placeholder);
        it("returns an empty string for undefined and null", placeholder);
        it("throws for a nested object or array", placeholder);
    });

    describe("serializeArrayParam", () => {
        it("joins exploded form values as repeated name=value pairs", placeholder);
        it("joins non-exploded form values with commas", placeholder);
        it("uses | for pipeDelimited and %20 for spaceDelimited", placeholder);
        it("prefixes label style with . and matrix style with ;", placeholder);
    });

    describe("serializeObjectParam", () => {
        it("serializes deepObject style as name[key]=value", placeholder);
        it("serializes non-exploded form style as name=key,value,key,value", placeholder);
        it("serializes a Date as its ISO string", placeholder);
        it("returns only the ISO string for a Date when valueOnly is set", placeholder);
    });

    describe("separators", () => {
        it.each(["label", "matrix", "simple", "form"])("separatorArrayExplode returns the right separator for %s", placeholder);
        it.each(["form", "spaceDelimited", "pipeDelimited"])("separatorArrayNoExplode returns the right separator for %s", placeholder);
        it.each(["label", "matrix", "simple", "form"])("separatorObjectExplode returns the right separator for %s", placeholder);
    });
});
