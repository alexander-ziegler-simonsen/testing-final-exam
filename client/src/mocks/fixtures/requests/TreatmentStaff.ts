import type { TreatmentStaffRequest } from "../../../api/Requests/TreatmentStaffRequest";

export const mockTreatmentStaffRequest: TreatmentStaffRequest = { fkTreatmentId: 1, fkStaffId: 1 };

export const mockTreatmentStaffRequests: TreatmentStaffRequest[] = [
    mockTreatmentStaffRequest,
    { fkTreatmentId: 1, fkStaffId: 2 },
    { fkTreatmentId: 3, fkStaffId: 2 },
];
