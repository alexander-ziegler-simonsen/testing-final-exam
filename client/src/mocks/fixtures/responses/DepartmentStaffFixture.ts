import type { DepartmentStaffResponse } from "../../../api/Responses/DepartmentStaffResponse";
import { mockDepartmentResponse } from "./DepartmentFixture";
import { mockStaffResponse } from "./StaffFixture";

export const mockDepartmentStaffResponse: DepartmentStaffResponse = {
    id: 1,
    department: mockDepartmentResponse,
    staff: mockStaffResponse,
};

export const mockDepartmentStaffResponses: DepartmentStaffResponse[] = [
    mockDepartmentStaffResponse,
    {
        id: 2,
        department: { id: 2, name: "Emergency", type: "Acute" },
        staff: { id: 2, firstname: "Anna", lastname: "Larsen", fkRoleId: 2 },
    },
    {
        id: 3,
        department: { id: 3, name: "Pediatrics", type: "Medical" },
        staff: { id: 3, firstname: "Peter", lastname: "Hansen", fkRoleId: 3 },
    },
];

// the nullable fields live on the nested department and staff - one entry per nullable field
export const mockDepartmentStaffResponsesWithNulls: DepartmentStaffResponse[] = [
    { id: 11, department: { ...mockDepartmentResponse, name: null }, staff: mockStaffResponse },
    { id: 12, department: { ...mockDepartmentResponse, type: null }, staff: mockStaffResponse },
    { id: 13, department: mockDepartmentResponse, staff: { ...mockStaffResponse, firstname: null } },
    { id: 14, department: mockDepartmentResponse, staff: { ...mockStaffResponse, lastname: null } },
];
