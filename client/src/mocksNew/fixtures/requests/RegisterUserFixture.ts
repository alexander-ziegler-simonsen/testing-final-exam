import type { RegisterUserRequest } from "../../../api/Requests/RegisterUserRequest";

export const mockRegisterUserRequest: RegisterUserRequest = {
    username: "jsmith",
    password: "Password123!",
    fkStaffId: 1,
    fkPatientId: null,
};

export const mockRegisterUserRequests: RegisterUserRequest[] = [
    mockRegisterUserRequest,
    { username: "alarsen", password: "Password123!", fkStaffId: 2, fkPatientId: null },
    { username: "ljensen", password: "Password123!", fkStaffId: null, fkPatientId: 1 },
];

// one entry per nullable field, with only that field set to null
export const mockRegisterUserRequestsWithNulls: RegisterUserRequest[] = [
    { username: "phansen", password: "Password123!", fkStaffId: 3, fkPatientId: null },
    { username: "mnielsen", password: "Password123!", fkStaffId: null, fkPatientId: 2 },
];
