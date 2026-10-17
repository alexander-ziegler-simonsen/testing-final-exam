import type { LoginRequest } from "../../../api/Requests/LoginRequest";

export const mockLoginRequest: LoginRequest = { username: "jsmith", password: "Password123!" };

export const mockLoginRequests: LoginRequest[] = [
    mockLoginRequest,
    { username: "alarsen", password: "Password123!" },
    { username: "ljensen", password: "Password123!" },
];
