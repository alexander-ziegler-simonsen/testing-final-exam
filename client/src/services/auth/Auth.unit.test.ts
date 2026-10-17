import { describe, it } from "vitest";
import { placeholder } from "../../test-utils/placeholder";

// Placeholders: each test passes by default until it's implemented.

describe("AuthService", () => {
    it("login returns the login response on success", placeholder);
    it("login attaches the returned token to later secured requests", placeholder);
    it("login throws \"Login failed with status 401\" when the credentials are rejected", placeholder);
    it("login throws \"Login failed\" when the error has no status", placeholder);
    it("login throws before sending a request when the password is shorter than 8 characters", placeholder);
    it("refresh returns the login response and attaches the new token", placeholder);
    it("refresh returns null when the refresh token is missing or expired (401)", placeholder);
    it("refresh returns null when the response has no data", placeholder);
    it("logout calls the logout endpoint", placeholder);
    it("logout stops sending the token on later requests", placeholder);
    it("logout clears the token even when the API call fails", placeholder);
});
