import type { DepartmentRequest } from "../../../api/Requests/DepartmentRequest";

export const mockDepartmentRequest: DepartmentRequest = { name: "Cardiology", type: "Medical" };

export const mockDepartmentRequests: DepartmentRequest[] = [
    mockDepartmentRequest,
    { name: "Emergency", type: "Acute" },
    { name: "Pediatrics", type: "Medical" },
];

// one entry per nullable field, with only that field set to null
export const mockDepartmentRequestsWithNulls: DepartmentRequest[] = [
    { ...mockDepartmentRequest, name: null },
    { ...mockDepartmentRequest, type: null },
];
