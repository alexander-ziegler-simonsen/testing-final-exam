import type { StaffRoleRequest } from "../../../api/Requests/StaffRoleRequest";

export const mockStaffRoleRequest: StaffRoleRequest = { name: "Doctor" };

export const mockStaffRoleRequests: StaffRoleRequest[] = [
    mockStaffRoleRequest,
    { name: "Nurse" },
    { name: "Pharmacist" },
];
