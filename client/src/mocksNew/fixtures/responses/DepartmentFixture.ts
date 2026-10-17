import type { DepartmentResponse } from "../../../api/Responses/DepartmentResponse";

export const mockDepartmentResponse: DepartmentResponse = { id: 1, name: "Cardiology", type: "Medical" };

export const mockDepartmentResponses: DepartmentResponse[] = [
    mockDepartmentResponse,
    { id: 2, name: "Emergency", type: "Acute" },
    { id: 3, name: "Pediatrics", type: "Medical" },
];

// one entry per nullable field, with only that field set to null
export const mockDepartmentResponsesWithNulls: DepartmentResponse[] = [
    { ...mockDepartmentResponse, id: 11, name: null },
    { ...mockDepartmentResponse, id: 12, type: null },
];
