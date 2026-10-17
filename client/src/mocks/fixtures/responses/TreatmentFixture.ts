import type { z } from "zod";
import type { TreatmentResponseSchema } from "../../../api/Responses/TreatmentResponse";

// wire format (what the api sends): time is an ISO string, the schema turns it into a Date when parsing
type TreatmentResponseJson = z.input<typeof TreatmentResponseSchema>;

export const mockTreatmentResponse: TreatmentResponseJson = {
    id: 1,
    fkPatientId: 1,
    description: "Initial examination and blood test.",
    time: "2026-10-20T09:00:00Z",
};

export const mockTreatmentResponses: TreatmentResponseJson[] = [
    mockTreatmentResponse,
    { id: 2, fkPatientId: 1, description: "Follow-up on blood test results.", time: "2026-10-22T10:30:00Z" },
    { id: 3, fkPatientId: 2, description: "Treatment of a sprained ankle.", time: "2026-10-21T14:15:00Z" },
];

// one entry per nullable field, with only that field set to null
export const mockTreatmentResponsesWithNulls: TreatmentResponseJson[] = [
    { ...mockTreatmentResponse, id: 11, description: null },
];
