import type { DepartmentStaffRequest } from "../../../api/Requests/DepartmentStaffRequest";

export const mockDepartmentStaffRequest: DepartmentStaffRequest = { fkStaffId: 1, fkDepartmentId: 1 };

export const mockDepartmentStaffRequests: DepartmentStaffRequest[] = [
    mockDepartmentStaffRequest,
    { fkStaffId: 2, fkDepartmentId: 2 },
    { fkStaffId: 3, fkDepartmentId: 3 },
];
