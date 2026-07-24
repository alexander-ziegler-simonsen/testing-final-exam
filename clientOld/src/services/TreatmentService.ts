import { apiFetch } from "../api/client"
import type { Treatment } from "../entites/Treatment"
import { buildQueryString, type TableQuery } from "./tableQuery"

const BASE = "/treatment"

export type TreatmentInput = Omit<Treatment, "id">

export const treatmentService = {
    getAll: async (q?: TableQuery): Promise<Treatment[]> => apiFetch<Treatment[]>(`${BASE}${buildQueryString(q)}`),
    getById: async (id: number): Promise<Treatment> => apiFetch<Treatment>(`${BASE}/${id}`),
    create: async (input: TreatmentInput): Promise<number> =>
        apiFetch<number>(BASE, { method: "POST", body: JSON.stringify(input) }),
    update: async (id: number, input: TreatmentInput): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify({ id, ...input }) }),
    delete: async (id: number): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" }),
}
