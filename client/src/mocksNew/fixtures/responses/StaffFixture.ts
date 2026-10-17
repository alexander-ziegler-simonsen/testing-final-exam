import type { StaffResponse } from "../../../api/Responses/StaffResponse";

export const mockStaffResponse: StaffResponse = { id: 1, firstname: "John", lastname: "Smith", fkRoleId: 1 };

export const mockStaffResponses: StaffResponse[] = [
    mockStaffResponse,
    { id: 2, firstname: "Anna", lastname: "Larsen", fkRoleId: 2 },
    { id: 3, firstname: "Peter", lastname: "Hansen", fkRoleId: 3 },
];

// one entry per nullable field, with only that field set to null
export const mockStaffResponsesWithNulls: StaffResponse[] = [
    { ...mockStaffResponse, id: 11, firstname: null },
    { ...mockStaffResponse, id: 12, lastname: null },
];
