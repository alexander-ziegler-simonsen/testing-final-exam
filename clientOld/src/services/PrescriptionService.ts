import { apiFetch } from "../api/client"
import type { Prescription } from "../entites/Prescription"

const BASE = "/prescription"

export type PrescriptionInput = Omit<Prescription, "id">

export const prescriptionService = {
    getAll: async (): Promise<Prescription[]> => apiFetch<Prescription[]>(BASE),
    getById: async (id: number): Promise<Prescription> => apiFetch<Prescription>(`${BASE}/${id}`),
    create: async (input: PrescriptionInput): Promise<void> =>
        apiFetch<void>(BASE, { method: "POST", body: JSON.stringify(input) }),
    update: async (id: number, input: PrescriptionInput): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify({ id, ...input }) }),
    delete: async (id: number): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" }),
}
