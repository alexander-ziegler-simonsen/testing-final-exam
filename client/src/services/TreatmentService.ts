import { apiFetch } from "../api/client"
import type { Treatment } from "../entites/Treatment"

const BASE = "/treatment"

export const treatmentService = {
    getAll: async (): Promise<Treatment[]> => apiFetch<Treatment[]>(BASE),
    getById: async (id: number): Promise<Treatment> => apiFetch<Treatment>(`${BASE}/${id}`),
}
