import { apiFetch } from "../api/client"
import type { MedicationStorageMissing } from "../entites/MedicationStorageMissing"

const BASE = "/MissingStorage"

export type MissingStorageInput = {
    fkMedicationStorageId: number
    amountMissing: number
    wentMissingAt: string
}

export const missingStorageService = {
    getAll: async (): Promise<MedicationStorageMissing[]> => apiFetch<MedicationStorageMissing[]>(BASE),
    getById: async (id: number): Promise<MedicationStorageMissing> => apiFetch<MedicationStorageMissing>(`${BASE}/${id}`),
    create: async (input: MissingStorageInput): Promise<void> =>
        apiFetch<void>(BASE, { method: "POST", body: JSON.stringify(input) }),
}
