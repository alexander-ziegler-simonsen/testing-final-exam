import { apiFetch } from "../api/client"
import type { MedicationStorage } from "../entites/MedicationStorage"

const BASE = "/storage"

export type StorageInput = Omit<MedicationStorage, "id">

export const storageService = {
    getAll: async (): Promise<MedicationStorage[]> => apiFetch<MedicationStorage[]>(BASE),
    getById: async (id: number): Promise<MedicationStorage> => apiFetch<MedicationStorage>(`${BASE}/${id}`),
    update: async (id: number, input: StorageInput): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(input) }),
}
