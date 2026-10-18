import type { RegisterBabyRequest } from "../../../api/Requests/RegisterBabyRequest";

// dates are UTC midnight, matching how RegisterBabyRequestSchema turns them into "yyyy-MM-dd"
export const mockRegisterBabyRequest: RegisterBabyRequest = {
    firstname: "Emma",
    lastname: "Jensen",
    weightKg: 3.4,
    heightCm: 51,
    gender: "Female",
    dateOfBirth: new Date("2026-10-15"),
};

export const mockRegisterBabyRequests: RegisterBabyRequest[] = [
    mockRegisterBabyRequest,
    { firstname: "Oliver", lastname: "Nielsen", weightKg: 3.8, heightCm: 53, gender: "Male", dateOfBirth: new Date("2026-10-16") },
    { firstname: "Noa", lastname: "Berg", weightKg: 2.9, heightCm: 48, gender: "Other", dateOfBirth: new Date("2026-10-17") },
];
