import { apiFetch } from "../api/client"
import type { Treatment } from "../entites/Treatment"

const BASE = "/treatment"

export type TreatmentInput = Omit<Treatment, "id">

export const treatmentService = {
    getAll: async (): Promise<Treatment[]> => apiFetch<Treatment[]>(BASE),
    getById: async (id: number): Promise<Treatment> => apiFetch<Treatment>(`${BASE}/${id}`),
    create: async (input: TreatmentInput): Promise<number> =>
        apiFetch<number>(BASE, { method: "POST", body: JSON.stringify(input) }),
}
