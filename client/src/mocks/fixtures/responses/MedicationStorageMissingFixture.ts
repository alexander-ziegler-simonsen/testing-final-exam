import type { z } from "zod";
import type { MedicationStorageMissingResponseSchema } from "../../../api/Responses/MedicationStorageMissingResponse";

// wire format (what the api sends): wentMissingAt is an ISO string, the schema turns it into a Date when parsing
type MedicationStorageMissingResponseJson = z.input<typeof MedicationStorageMissingResponseSchema>;

export const mockMedicationStorageMissingResponse: MedicationStorageMissingResponseJson = {
    id: 1,
    fkMedicationStorageId: 1,
    amountMissing: 5,
    wentMissingAt: "2026-10-01T08:30:00Z",
};

export const mockMedicationStorageMissingResponses: MedicationStorageMissingResponseJson[] = [
    mockMedicationStorageMissingResponse,
    { id: 2, fkMedicationStorageId: 2, amountMissing: 12, wentMissingAt: "2026-10-05T14:00:00Z" },
    { id: 3, fkMedicationStorageId: 1, amountMissing: 2, wentMissingAt: "2026-10-12T21:45:00Z" },
];
