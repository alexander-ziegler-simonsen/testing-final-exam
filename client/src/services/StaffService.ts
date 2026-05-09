import { apiFetch } from "../api/client"
import type { Staff } from "../entites/Staff"

const BASE = "/staff"

export type StaffInput = Omit<Staff, "id">

export const staffService = {
    getAll: async (): Promise<Staff[]> => apiFetch<Staff[]>(BASE),
    getById: async (id: number): Promise<Staff> => apiFetch<Staff>(`${BASE}/${id}`),
    create: async (input: StaffInput): Promise<void> =>
        apiFetch<void>(BASE, { method: "POST", body: JSON.stringify({ id: 0, ...input }) }),
    update: async (id: number, input: StaffInput): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify({ id, ...input }) }),
    delete: async (id: number): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" }),
}
