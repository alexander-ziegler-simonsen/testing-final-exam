import type { TreatmentRequest } from "../../../api/Requests/TreatmentRequest";

export const mockTreatmentRequest: TreatmentRequest = {
    fkPatientId: 1,
    description: "Initial examination and blood test.",
    time: new Date("2026-10-20T09:00:00Z"),
};

export const mockTreatmentRequests: TreatmentRequest[] = [
    mockTreatmentRequest,
    { fkPatientId: 1, description: "Follow-up on blood test results.", time: new Date("2026-10-22T10:30:00Z") },
    { fkPatientId: 2, description: "Treatment of a sprained ankle.", time: new Date("2026-10-21T14:15:00Z") },
];

// one entry per nullable field, with only that field set to null
export const mockTreatmentRequestsWithNulls: TreatmentRequest[] = [
    { ...mockTreatmentRequest, description: null },
];
