import { apiFetch } from "../api/client"
import type { Department } from "../entites/Department"

const BASE = "/department"

export type DepartmentInput = Omit<Department, "id">

export const departmentService = {
    getAll: async (): Promise<Department[]> => apiFetch<Department[]>(BASE),
    getById: async (id: number): Promise<Department> => apiFetch<Department>(`${BASE}/${id}`),
    create: async (input: DepartmentInput): Promise<void> =>
        apiFetch<void>(BASE, { method: "POST", body: JSON.stringify({ id: 0, ...input }) }),
    update: async (id: number, input: DepartmentInput): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify({ id, ...input }) }),
    delete: async (id: number): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" }),
}
