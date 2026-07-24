import { apiFetch } from "../api/client"
import type { Shift } from "../entites/Shift"
import { buildQueryString, type TableQuery } from "./tableQuery"

const BASE = "/shift"

export interface ShiftInput {
    startTime: string
    endTime: string
}

export const shiftService = {
    getAll: async (q?: TableQuery): Promise<Shift[]> => apiFetch<Shift[]>(`${BASE}${buildQueryString(q)}`),
    getById: async (id: number): Promise<Shift> => apiFetch<Shift>(`${BASE}/${id}`),
    create: async (input: ShiftInput): Promise<void> =>
        apiFetch<void>(BASE, { method: "POST", body: JSON.stringify({ id: 0, ...input }) }),
    update: async (id: number, input: ShiftInput): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify({ id, ...input }) }),
    delete: async (id: number): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" }),
}
