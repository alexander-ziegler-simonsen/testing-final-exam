import { apiFetch } from "../api/client"
import type { Shift } from "../entites/Shift"

const BASE = "/shift"

export const shiftService = {
    getAll: async (): Promise<Shift[]> => apiFetch<Shift[]>(BASE),
    getById: async (id: number): Promise<Shift> => apiFetch<Shift>(`${BASE}/${id}`),
}
