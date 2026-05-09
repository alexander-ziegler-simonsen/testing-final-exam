import { apiFetch } from "../api/client"
import type { Medication } from "../entites/Medication"

const BASE = "/medicin"

// Omit<T, "key"> = T without "key" — excludes "id" since the DB assigns it on create
export type MedicationInput = Omit<Medication, "id">

export const medicationService = {
    getAll: async (): Promise<Medication[]> => apiFetch<Medication[]>(BASE),
    getById: async (id: number): Promise<Medication> => apiFetch<Medication>(`${BASE}/${id}`),
    create: async (input: MedicationInput): Promise<void> =>
        apiFetch<void>(BASE, { method: "POST", body: JSON.stringify({ id: 0, ...input }) }),
    update: async (id: number, input: MedicationInput): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify({ id, ...input }) }),
    delete: async (id: number): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" }),
}
