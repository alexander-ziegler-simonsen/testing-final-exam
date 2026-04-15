import { apiFetch } from "../api/client"
import type { Staff } from "../entites/Staff"

const BASE = "/staff"

export const staffService = {
    getAll: async (): Promise<Staff[]> => apiFetch<Staff[]>(BASE),
    getById: async (id: number): Promise<Staff> => apiFetch<Staff>(`${BASE}/${id}`),
}
