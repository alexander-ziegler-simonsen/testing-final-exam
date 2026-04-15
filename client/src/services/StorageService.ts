import { apiFetch } from "../api/client"
import type { MedicationStorage } from "../entites/MedicationStorage"

const BASE = "/storage"

export const storageService = {
    getAll: async (): Promise<MedicationStorage[]> => apiFetch<MedicationStorage[]>(BASE),
    getById: async (id: number): Promise<MedicationStorage> => apiFetch<MedicationStorage>(`${BASE}/${id}`),
}
