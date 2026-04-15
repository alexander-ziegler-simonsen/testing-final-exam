import { apiFetch } from "../api/client"
import type { Patient } from "../entites/Patient"

const BASE = "/patient"

export const patientService = {
    getAll: async (): Promise<Patient[]> => apiFetch<Patient[]>(BASE),
    getById: async (id: number): Promise<Patient> => apiFetch<Patient>(`${BASE}/${id}`),
}
