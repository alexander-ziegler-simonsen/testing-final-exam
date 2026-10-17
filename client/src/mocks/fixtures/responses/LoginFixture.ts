import type { LoginResponse } from "../../../api/Responses/LoginResponse";

// a staff login gets its staff role name as role, everyone else gets "patient"
export const mockLoginResponse: LoginResponse = {
    token: "mock-access-token",
    staffId: 1,
    patientId: null,
    firstname: "John",
    lastname: "Smith",
    role: "Doctor",
};

const mockPatientLoginResponse: LoginResponse = {
    token: "mock-access-token",
    staffId: null,
    patientId: 1,
    firstname: "Lars",
    lastname: "Jensen",
    role: "patient",
};

export const mockLoginResponses: LoginResponse[] = [
    mockLoginResponse,
    { ...mockLoginResponse, staffId: 2, firstname: "Anna", lastname: "Larsen", role: "Nurse" },
    mockPatientLoginResponse,
];

// one entry per nullable field - a login is either staff or patient, so the other id is null already
export const mockLoginResponsesWithNulls: LoginResponse[] = [
    mockLoginResponse,
    mockPatientLoginResponse,
    { ...mockLoginResponse, firstname: null },
    { ...mockLoginResponse, lastname: null },
];
