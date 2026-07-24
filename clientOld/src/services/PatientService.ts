import { apiFetch } from "../api/client"
import type { Patient } from "../entites/Patient"
import { buildQueryString, type TableQuery } from "./tableQuery"

const BASE = "/patient"

export const patientService = {
    getAll: async (q?: TableQuery): Promise<Patient[]> => apiFetch<Patient[]>(`${BASE}${buildQueryString(q)}`),
    getById: async (id: number): Promise<Patient> => apiFetch<Patient>(`${BASE}/${id}`),
}
