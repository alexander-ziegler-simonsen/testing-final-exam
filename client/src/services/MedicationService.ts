import { apiFetch } from "../api/client"
import type { Medication } from "../entites/Medication"

const BASE = "/medicin"

export const medicationService = {
    getAll: async (): Promise<Medication[]> => apiFetch<Medication[]>(BASE),
    getById: async (id: number): Promise<Medication> => apiFetch<Medication>(`${BASE}/${id}`),
}
