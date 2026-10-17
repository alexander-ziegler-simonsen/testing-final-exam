import type { LoginRequest } from "../../../api/Requests/LoginRequest";

// each username is the role it logs in as - see mockLoginResponses
export const mockLoginRequest: LoginRequest = { username: "doctor", password: "password" };

export const mockLoginRequests: LoginRequest[] = [
    mockLoginRequest,
    { username: "nurse", password: "password" },
    { username: "patient", password: "password" },
    { username: "admin", password: "password" },
];
