import type { UserResponse } from "../../../api/Responses/UserResponse";

export const mockUserResponse: UserResponse = { id: 1, username: "jsmith", fkStaffId: 1, fkPatientId: null };

export const mockUserResponses: UserResponse[] = [
    mockUserResponse,
    { id: 2, username: "alarsen", fkStaffId: 2, fkPatientId: null },
    { id: 3, username: "ljensen", fkStaffId: null, fkPatientId: 1 },
];

// one entry per nullable field, with only that field set to null
export const mockUserResponsesWithNulls: UserResponse[] = [
    { id: 11, username: "phansen", fkStaffId: 3, fkPatientId: null },
    { id: 12, username: "mnielsen", fkStaffId: null, fkPatientId: 2 },
];
