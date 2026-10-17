import type { StaffRoleResponse } from "../../../api/Responses/StaffRoleResponse";

export const mockStaffRoleResponse: StaffRoleResponse = { id: 1, name: "Doctor" };

export const mockStaffRoleResponses: StaffRoleResponse[] = [
    mockStaffRoleResponse,
    { id: 2, name: "Nurse" },
    { id: 3, name: "Pharmacist" },
];
