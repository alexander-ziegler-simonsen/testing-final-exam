import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import {
    handleUserChangePassword,
    handleUserDelete,
    handleUserGetAll,
    handleUserRegister,
} from "../api/msw.gen";
import { mockUser, mockUsers } from "../mocks/fixtures";
import { server } from "../mocks/Server";
import { UserService } from "./User";

describe("UserService", () => {
    it("getAll returns the mocked user list", async () => {
        server.use(handleUserGetAll({ body: mockUsers }));
        const users = await UserService.getAll();
        expect(users).toEqual(mockUsers);
    });

    it("getAll throws when the API errors", async () => {
        server.use(
            handleUserGetAll(() => HttpResponse.json({ title: "Internal Server Error" }, { status: 500 })),
        );
        const result = UserService.getAll();
        await expect(result).rejects.toThrow("Failed to load users");
    });

    it("register resolves without throwing on success", async () => {
        server.use(handleUserRegister({ body: true }));
        const result = UserService.register({ username: "alice", password: "supersecret", fkStaffId: 7, fkPatientId: null });
        await expect(result).resolves.toBeUndefined();
    });

    it("register throws when the API errors", async () => {
        server.use(
            handleUserRegister(() =>
                HttpResponse.json({ title: "Username already taken" }, { status: 409 }),
            ),
        );
        const result = UserService.register({ username: "alice", password: "supersecret" });
        await expect(result).rejects.toThrow("Failed to register user");
    });

    it("changePassword resolves without throwing on success", async () => {
        server.use(handleUserChangePassword({ body: null }));
        const result = UserService.changePassword(mockUser.id!, "newpassword");
        await expect(result).resolves.toBeUndefined();
    });

    it("changePassword throws when the API errors", async () => {
        server.use(
            handleUserChangePassword(() =>
                HttpResponse.json({ title: "Internal Server Error" }, { status: 500 }),
            ),
        );

        const result = UserService.changePassword(mockUser.id!, "newpassword");

        await expect(result).rejects.toThrow(`Failed to change password for user ${mockUser.id}`);
    });

    it("delete resolves without throwing on success", async () => {
        server.use(handleUserDelete({ body: null }));
        const result = UserService.delete(mockUser.id!);
        await expect(result).resolves.toBeUndefined();
    });

    it("delete throws when the API errors", async () => {
        server.use(
            handleUserDelete(() => HttpResponse.json({ title: "Internal Server Error" }, { status: 500 })),
        );
        const result = UserService.delete(mockUser.id!);
        await expect(result).rejects.toThrow(`Failed to delete user ${mockUser.id}`);
    });
});
