import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "./AuthStore";

const mockUser = {
    staffId: 7,
    patientId: null,
    firstName: "Karen",
    lastName: "Holm",
    role: "nurse" as const,
};

describe("useAuthStore", () => {
    beforeEach(() => {
        useAuthStore.getState().clearSession();
    });

    it("starts with no session", () => {
        expect(useAuthStore.getState().accessToken).toBeNull();
        expect(useAuthStore.getState().user).toBeNull();
    });

    it("setSession stores the token and user", () => {
        useAuthStore.getState().setSession("token-123", mockUser);

        expect(useAuthStore.getState().accessToken).toBe("token-123");
        expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it("setSession overwrites a previous session", () => {
        useAuthStore.getState().setSession("token-123", mockUser);

        const secondUser = { ...mockUser, staffId: 9, firstName: "Jonas" };
        useAuthStore.getState().setSession("token-456", secondUser);

        expect(useAuthStore.getState().accessToken).toBe("token-456");
        expect(useAuthStore.getState().user).toEqual(secondUser);
    });

    it("clearSession resets the token and user to null", () => {
        useAuthStore.getState().setSession("token-123", mockUser);

        useAuthStore.getState().clearSession();

        expect(useAuthStore.getState().accessToken).toBeNull();
        expect(useAuthStore.getState().user).toBeNull();
    });

    it("clearSession is a no-op when there is no session", () => {
        useAuthStore.getState().clearSession();

        expect(useAuthStore.getState().accessToken).toBeNull();
        expect(useAuthStore.getState().user).toBeNull();
    });
});
