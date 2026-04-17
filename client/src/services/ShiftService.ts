import { apiFetch } from "../api/client"
import type { Shift } from "../entites/Shift"
import { buildQueryString, type TableQuery } from "./tableQuery"

const BASE = "/shift"

export const shiftService = {
    getAll: async (q?: TableQuery): Promise<Shift[]> => apiFetch<Shift[]>(`${BASE}${buildQueryString(q)}`),
    getById: async (id: number): Promise<Shift> => apiFetch<Shift>(`${BASE}/${id}`),
}
