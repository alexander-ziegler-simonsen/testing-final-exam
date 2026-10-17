import type { MedicationStorageRequest } from "../../../api/Requests/MedicationStorageRequest";

export const mockMedicationStorageRequest: MedicationStorageRequest = { fkMedicationId: 1, amount: 120 };

export const mockMedicationStorageRequests: MedicationStorageRequest[] = [
    mockMedicationStorageRequest,
    { fkMedicationId: 2, amount: 80 },
    { fkMedicationId: 3, amount: 35 },
];
