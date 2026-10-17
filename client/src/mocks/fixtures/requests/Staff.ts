import type { StaffRequest } from "../../../api/Requests/StaffRequest";

export const mockStaffRequest: StaffRequest = { firstname: "John", lastname: "Smith", fkRoleId: 1 };

export const mockStaffRequests: StaffRequest[] = [
    mockStaffRequest,
    { firstname: "Anna", lastname: "Larsen", fkRoleId: 2 },
    { firstname: "Peter", lastname: "Hansen", fkRoleId: 3 },
];
