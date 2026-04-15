import { apiFetch } from "../api/client"
import type { Department } from "../entites/Department"

const BASE = "/department"

export const departmentService = {
    getAll: async (): Promise<Department[]> => apiFetch<Department[]>(BASE),
    getById: async (id: number): Promise<Department> => apiFetch<Department>(`${BASE}/${id}`),
}
