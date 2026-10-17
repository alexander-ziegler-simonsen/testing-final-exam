import type { MedicationStorageResponse } from "../../../api/Responses/MedicationStorageResponse";

export const mockMedicationStorageResponse: MedicationStorageResponse = { id: 1, fkMedicationId: 1, amount: 120 };

export const mockMedicationStorageResponses: MedicationStorageResponse[] = [
    mockMedicationStorageResponse,
    { id: 2, fkMedicationId: 2, amount: 80 },
    { id: 3, fkMedicationId: 3, amount: 35 },
];
