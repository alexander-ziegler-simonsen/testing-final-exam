import { apiFetch } from "../api/client"
import type { TreatmentStaff } from "../entites/TreatmentStaff"

const BASE = "/treatmentstaff"

// Omit<T, "id"> = T without "id" — excludes "id" since the DB assigns it on create
export type TreatmentStaffInput = Omit<TreatmentStaff, "id">

export const treatmentStaffService = {
    getAll: async (): Promise<TreatmentStaff[]> => apiFetch<TreatmentStaff[]>(BASE),
    getById: async (id: number): Promise<TreatmentStaff> => apiFetch<TreatmentStaff>(`${BASE}/${id}`),
    create: async (input: TreatmentStaffInput): Promise<void> =>
        apiFetch<void>(BASE, { method: "POST", body: JSON.stringify({ id: 0, ...input }) }),
    update: async (id: number, input: TreatmentStaffInput): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify({ id, ...input }) }),
    delete: async (id: number): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" }),
}
