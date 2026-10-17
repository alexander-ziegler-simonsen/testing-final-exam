import type { MedicationStorageMissingRequest } from "../../../api/Requests/MedicationStorageMissingRequest";

export const mockMedicationStorageMissingRequest: MedicationStorageMissingRequest = {
    fkMedicationStorageId: 1,
    amountMissing: 5,
    wentMissingAt: new Date("2026-10-01T08:30:00Z"),
};

export const mockMedicationStorageMissingRequests: MedicationStorageMissingRequest[] = [
    mockMedicationStorageMissingRequest,
    { fkMedicationStorageId: 2, amountMissing: 12, wentMissingAt: new Date("2026-10-05T14:00:00Z") },
    { fkMedicationStorageId: 1, amountMissing: 2, wentMissingAt: new Date("2026-10-12T21:45:00Z") },
];
