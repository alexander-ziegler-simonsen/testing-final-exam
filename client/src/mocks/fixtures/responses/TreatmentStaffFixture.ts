import type { TreatmentStaffResponse } from "../../../api/Responses/TreatmentStaffResponse";

export const mockTreatmentStaffResponse: TreatmentStaffResponse = { id: 1, fkTreatmentId: 1, fkStaffId: 1 };

export const mockTreatmentStaffResponses: TreatmentStaffResponse[] = [
    mockTreatmentStaffResponse,
    { id: 2, fkTreatmentId: 1, fkStaffId: 2 },
    { id: 3, fkTreatmentId: 3, fkStaffId: 2 },
];
