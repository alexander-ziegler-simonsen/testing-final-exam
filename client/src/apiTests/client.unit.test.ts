import { describe, it } from "vitest";
import { placeholder } from "../test-utils/placeholder";

// Tests for the generated axios client: the shared instance in ../api/client.gen.ts
// and createClient in ../api/client/client.gen.ts.
// Placeholders: each test passes by default until it's implemented.

describe("client.gen", () => {
    describe("shared client", () => {
        it("is the one instance every sdk function uses by default", placeholder);
        it("setConfig merges new options into the existing config", placeholder);
        it("getConfig returns a copy, so mutating it doesn't change the client", placeholder);
        it("setConfig({ baseURL }) prefixes every request url", placeholder);
        it("setConfig({ withCredentials: true }) is applied to the axios instance defaults", placeholder);
        it("setConfig({ auth }) makes secured requests send Authorization: Bearer <token>", placeholder);
        it("setConfig({ auth: undefined }) stops sending the Authorization header", placeholder);
        it("instance exposes the axios instance so interceptors can be registered", placeholder);
    });

    describe("createClient", () => {
        it("creates an independent client whose config doesn't affect the shared one", placeholder);
        it("uses an axios instance passed in config instead of creating its own", placeholder);
        it("does not pass auth on to the axios instance", placeholder);
    });

    describe("request", () => {
        it("returns the axios response with data on success", placeholder);
        it("returns data that is not a number when a 2xx response has no body", placeholder);
        it("sets error to the response body on a 4xx/5xx", placeholder);
        it("sets a truthy error when an error response has an empty body", placeholder);
        it("sets error to {} on a network error with no response", placeholder);
        it("throws the AxiosError when throwOnError is true", placeholder);
        it("runs requestValidator before sending and responseValidator after receiving", placeholder);
    });
});
