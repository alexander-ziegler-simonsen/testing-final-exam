import type { PatientRequest } from "../../../api/Requests/PatientRequest";

// dates are UTC midnight, matching how PatientRequestSchema turns them into "yyyy-MM-dd"
export const mockPatientRequest: PatientRequest = {
    firstname: "Lars",
    lastname: "Jensen",
    gender: "Male",
    cprNumber: "0101801234",
    dateOfBirth: new Date("1980-01-01"),
    weightKg: 82.5,
    heightCm: 180,
};

export const mockPatientRequests: PatientRequest[] = [
    mockPatientRequest,
    {
        firstname: "Mette",
        lastname: "Nielsen",
        gender: "Female",
        cprNumber: "1505925678",
        dateOfBirth: new Date("1992-05-15"),
        weightKg: 64,
        heightCm: 168,
    },
    {
        firstname: "Alex",
        lastname: "Berg",
        gender: "Other",
        cprNumber: "2012009012",
        dateOfBirth: new Date("2000-12-20"),
        weightKg: 71.3,
        heightCm: 175,
    },
];

// one entry per nullable field, with only that field set to null
export const mockPatientRequestsWithNulls: PatientRequest[] = [
    { ...mockPatientRequest, firstname: null },
    { ...mockPatientRequest, lastname: null },
    { ...mockPatientRequest, gender: null },
    { ...mockPatientRequest, cprNumber: null },
    { ...mockPatientRequest, dateOfBirth: null },
    { ...mockPatientRequest, weightKg: null },
    { ...mockPatientRequest, heightCm: null },
];
